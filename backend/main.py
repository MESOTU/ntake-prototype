from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv
import openai
from openai import OpenAI 
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from sqlalchemy import text 
import httpx
import traceback
import boto3

# Load environment variables from .env file
load_dotenv()

# Get OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# AWS configuration
aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
aws_region = os.getenv("AWS_REGION", "us-east-1")

# Database setup
database_url = os.getenv("DATABASE_URL")
engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Patient data model
class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    date_of_birth = Column(String)
    primary_diagnosis = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create all database tables
Base.metadata.create_all(bind=engine)

# DEBUG FUNCTION 
def debug_database_connection():
    """Debug database connection details"""
    print(f"🔍 DATABASE_URL: {database_url}")
    try:
        db = SessionLocal()
        result = db.execute(text("SELECT current_database();"))
        db_name = result.scalar()
        print(f"✅ Connected to database: {db_name}")
        
        # Test if patients table exists and count records
        result = db.execute(text("SELECT COUNT(*) FROM patients;"))
        patient_count = result.scalar()
        print(f"📊 Patients in database: {patient_count}")
        
        db.close()
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

# Call it after your database setup
debug_database_connection()

def test_database_connection():
    """Test if database connection is working"""
    try:
        # Try to create a session
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        print("✅ Database connection successful")
        db.close()
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

# Test the connection
test_database_connection()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5170",
        "http://localhost:5171",
        "http://localhost:5172",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
        "http://localhost:5180",
        "https://intake-prototype-h85w6140b-mesotus-projects.vercel.app",
        "https://intake-prototype.vercel.app",
        "https://intake-prototype-3sa2uwec3-mesotus-projects.vercel.app",
        "https://intake-prototype-git-main-mesotus-projects.vercel.app",
        "https://intake-prototype-nlh6gz65z-mesotus-projects.vercel.app",
        "https://*.vercel.app"  # Allow ALL Vercel domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test Open AI function
def test_openai_connection():
    """Simple test to verify OpenAI API is working"""
    import sys
    print("✅ OpenAI API Key loaded:", openai_api_key[:10] + "..." if openai_api_key else "❌ No key found", file=sys.stderr)

test_openai_connection()
openai.api_key = openai_api_key

# PDF Text Extraction function
def extract_text_from_pdf(pdf_file):
    """Extract text from PDF file - tries text extraction first, then AWS Textract for images"""
    try:
        import pdfplumber
           
        print("🔍 Starting PDF text extraction...")
           
        # First try: Regular text extraction
        text = ""
        pdf_file.seek(0)
        with pdfplumber.open(pdf_file) as pdf:
            print(f"📄 PDF has {len(pdf.pages)} pages")
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
           
        print(f"📊 Initial text extraction got {len(text)} characters")

        # If no text found, use AWS Textract
        if not text.strip():
            print("📄 No text found - attempting AWS Textract...")
            text = extract_text_with_textract(pdf_file)

        if not text.strip():
            print("❌ Both text extraction and AWS Textract failed")
            return None
            
        print(f"✅ Final extracted {len(text)} characters")
        return text
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

# Extract text using AWS Textract
def extract_text_with_textract(pdf_file):
    """Extract text from image-based PDFs using AWS Textract"""
    try:
        print("🔍 Starting AWS Textract processing...")
        
        # Initialize Textract client with credentials
        textract = boto3.client(
            'textract',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=aws_region
        )
        
        # Convert PDF to images first
        from pdf2image import convert_from_bytes
        import io
        
        print("📄 Converting PDF to images for Textract...")
        pdf_file.seek(0)
        images = convert_from_bytes(pdf_file.read(), dpi=200)
        
        # Process each image with Textract
        text = ""
        for i, image in enumerate(images):
            print(f"🔍 Textract processing page {i+1}/{len(images)}")
            
            # Convert image to bytes
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='JPEG')
            img_byte_arr = img_byte_arr.getvalue()
            
            # Call Textract for image
            response = textract.detect_document_text(
                Document={'Bytes': img_byte_arr}
            )
            
            # Extract text from blocks
            page_text = ""
            for block in response['Blocks']:
                if block['BlockType'] == 'LINE':
                    page_text += block['Text'] + "\n"
            
            text += f"--- Page {i+1} ---\n{page_text}\n"
        
        print(f"✅ AWS Textract extracted {len(text)} characters")
        return text.strip()
        
    except Exception as e:
        print(f"❌ AWS Textract failed: {e}")
        import traceback
        traceback.print_exc()
        return ""

# AI Data Extraction Function
def extract_data_with_ai(text):
    """Use OpenAI to extract structured data from text"""
    try:
        # Create the prompt for OpenAI
        prompt = f"""
        Extract the following information from this medical document:
        
        {text}
        
        Return as JSON with these fields:
        - patient_name: Full name
        - date_of_birth: YYYY-MM-DD format  
        - primary_diagnosis: Main condition
        
        If any information is missing, use "Unknown"
        """
        
        # Call OpenAI API
        client = OpenAI(api_key=openai_api_key, http_client=httpx.Client())
        response = client.chat.completions.create(  
            model="gpt-3.5-turbo", 
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1 # Low temperature for consistent output
        )
        
        # Extract the AI's response
        result_text = response.choices[0].message.content

        # Parse the JSON response from AI
        import json
        try:
            extracted_data = json.loads(result_text)
            return extracted_data
        except json.JSONDecodeError:
            # If AI didn't return valid JSON, return the raw text for debugging
            print("❌ AI didn't return valid JSON:", result_text)
            return {
                "patient_name": "Parse Error", 
                "date_of_birth": "1900-01-01",
                "primary_diagnosis": "See console for AI response"
            }
        
    except Exception as e:
        print(f"❌ Error with AI extraction: {e}")
        return None

def extract_answers_for_questions(text):
    """Extract answers for our 7 demo questions from text"""
    try:
        prompt = f"""
        Analyze this text and extract specific information for these 7 questions:
        
        TEXT TO ANALYZE:
        {text}
        
        QUESTIONS TO ANSWER:
        1. Are you a new participant? (Answer: "Yes" or "No")
        2. What diagnoses or conditions do you have? (List specific conditions)
        3. How often do you get upset, angry, anxious, withdrawn? (Answer: "Never", "Rarely", "Occasionally", "Often", "Almost always")
        4. How much support do you need to manage physical challenges? (0-10 number)
        5. What are your living arrangements? (Describe living situation)
        6. In the last 30 days, how much was your family impacted because of your disability? (Answer: "None", "Mild", "Moderate", "Severe", "Extreme", "Not Applicable")
        7. If we were to score your impairment restrictions (0-5 scale with 0.5 increments)
        
        Return as JSON with these exact field names:
        - "introduction.new_participant"
        - "icf_impairment.diagnoses" 
        - "wellbeing.frequency"
        - "icf_impairment.mobility_support_level"
        - "about_you.living_situation"
        - "family.carer_wellbeing"
        - "icf_impairment.score"
        
        For any information that is missing or unclear, use "Unknown".
        """
        
        client = OpenAI(api_key=openai_api_key, http_client=httpx.Client())
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )
        
        result_text = response.choices[0].message.content
        
        import json
        try:
            extracted_data = json.loads(result_text)
            print(f"✅ AI extracted answers: {extracted_data}")
            return extracted_data
        except json.JSONDecodeError:
            print("❌ AI didn't return valid JSON:", result_text)
            return {
                "introduction.new_participant": "Unknown",
                "icf_impairment.diagnoses": "Unknown",
                "wellbeing.frequency": "Unknown",
                "icf_impairment.mobility_support_level": "Unknown", 
                "about_you.living_situation": "Unknown",
                "family.carer_wellbeing": "Unknown",
                "icf_impairment.score": "Unknown"
            }
        
    except Exception as e:
        print(f"❌ Error in extract_answers_for_questions: {e}")
        return {
            "introduction.new_participant": "Unknown",
            "icf_impairment.diagnoses": "Unknown",
            "wellbeing.frequency": "Unknown",
            "icf_impairment.mobility_support_level": "Unknown",
            "about_you.living_situation": "Unknown", 
            "family.carer_wellbeing": "Unknown",
            "icf_impairment.score": "Unknown"
        }

# Whisper Transcription Function
def transcribe_audio(audio_file, filename=None):
    """Transcribe audio file to text using OpenAI Whisper"""
    try:
        client = OpenAI(api_key=openai_api_key, http_client=httpx.Client())

        # Reset file pointer and read as bytes
        audio_file.seek(0)
        audio_bytes = audio_file.read()
        
        # Determine content type based on filename
        if filename and filename.lower().endswith('.mp4'):
            content_type = "audio/mp4"
        elif filename and filename.lower().endswith('.m4a'):
            content_type = "audio/mp4" 
        elif filename and filename.lower().endswith('.mp3'):
            content_type = "audio/mpeg"
        elif filename and filename.lower().endswith('.wav'):
            content_type = "audio/wav"
        else:
            content_type = "audio/mpeg"  # Default
        
        # Use the tuple format
        file_tuple = ("audio_file", audio_bytes, content_type)

        
        # Real Whisper API call
        response = client.audio.transcriptions.create(
            model="whisper-1", 
            file=file_tuple,
            response_format="text"
        )
        
        print("✅ Audio transcribed successfully")
        return response
        
    except Exception as e:
        print(f"❌ Error transcribing audio: {e}")
        return None

def test_textract_connection():
    """Test if AWS Textract connection is working"""
    try:
        textract = boto3.client(
            'textract',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=aws_region
        )
        print("✅ AWS Textract client initialized successfully")
    except Exception as e:
        print(f"❌ AWS Textract connection failed: {e}")

# Test the connection
test_textract_connection()

@app.get("/")
def read_root():
    return {"message": "Backend is working!"}

# Parse PDF Endpoint - WITH CRASH PROTECTION
@app.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    print("🟢 /parse-pdf endpoint called - START")
    try:
        # Simple check
        if not file.filename.endswith('.pdf'):
            print("❌ Not a PDF file")
            return JSONResponse(
                status_code=400,
                content={"error": "Please upload a PDF file"},
                headers={"Access-Control-Allow-Origin": "https://intake-prototype.vercel.app"}
            )
        
        print(f"📁 Processing file: {file.filename}")
        
        # Step 1: Extract text from PDF
        print("🔍 Step 1: Extracting text from PDF...")
        text = extract_text_from_pdf(file.file)
        if not text:
            print("❌ No text extracted from PDF")
            return JSONResponse(
                status_code=400,
                content={"error": "Could not extract text from PDF"},
                headers={"Access-Control-Allow-Origin": "https://intake-prototype.vercel.app"}
            )
        
        print(f"✅ Extracted {len(text)} characters from PDF")
        
        # Step 2: Use AI to extract structured data
        print("🤖 Step 2: Using AI to extract data...")
        extracted_data = extract_data_with_ai(text)
        if not extracted_data:
            print("❌ AI extraction failed")
            return JSONResponse(
                status_code=400,
                content={"error": "AI data extraction failed"},
                headers={"Access-Control-Allow-Origin": "https://intake-prototype.vercel.app"}
            )
        
        print(f"✅ AI extracted data: {extracted_data}")

        # Step 3: Save to database
        print("💾 Step 3: Saving to database...")
        db = SessionLocal()
        try:
            db_patient = Patient(
                patient_name=extracted_data["patient_name"],
                date_of_birth=extracted_data["date_of_birth"],
                primary_diagnosis=extracted_data["primary_diagnosis"]
            )
            db.add(db_patient)
            db.commit()
            db.refresh(db_patient)
            print(f"✅ Patient saved to database: {extracted_data['patient_name']}")
        except Exception as db_error:
            print(f"❌ Database save failed: {db_error}")
            # Continue even if database fails
        finally:
            db.close()        
        
        print("🎉 /parse-pdf completed successfully")
        return JSONResponse(
            status_code=200,
            content={
                "status": "success", 
                "message": "PDF processed successfully!",
                "extracted_data": extracted_data
            },
            headers={"Access-Control-Allow-Origin": "https://intake-prototype.vercel.app"}
        )
        
    except Exception as e:
        print(f"💥 TOP-LEVEL CRASH in /parse-pdf: {e}")
        print("🔍 Full traceback:")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": f"Server error during PDF processing: {str(e)}"},
            headers={"Access-Control-Allow-Origin": "https://intake-prototype.vercel.app"}
        )

# Parse Voice Endpoint
@app.post("/parse-voice")
async def parse_voice(file: UploadFile = File(...)):
    # Basic validation
    allowed_types = ['.mp3', '.wav', '.m4a', '.ogg', '.mp4']
    if not any(file.filename.lower().endswith(ext) for ext in allowed_types):
        return {"error": "Please upload an audio file (MP3, WAV, M4A, OGG)"}
    
    try:
        # Step 1: Transcribe audio to text
        transcript = transcribe_audio(file.file, file.filename)
        if not transcript:
            return {"error": "Could not transcribe audio"}
        
        # Step 2: Use AI to extract structured data
        extracted_data = extract_data_with_ai(transcript)

        # Step 3: Save to database
        db = SessionLocal()
        try:
            db_patient = Patient(
                patient_name=extracted_data["patient_name"],
                date_of_birth=extracted_data["date_of_birth"],
                primary_diagnosis=extracted_data["primary_diagnosis"]
            )
            db.add(db_patient)
            db.commit()
            db.refresh(db_patient)
            print(f"✅ Patient saved to database: {extracted_data['patient_name']}")
        finally:
            db.close()       
        
        return {
            "status": "success", 
            "message": "Audio processed successfully!",
            "extracted_data": extracted_data
        }
        
    except Exception as e:
        return {"error": f"Audio processing failed: {str(e)}"}

# Enhanced PDF parsing for specific questions
@app.post("/parse-pdf-for-questions")
async def parse_pdf_for_questions(file: UploadFile = File(...)):
    print("🟢 /parse-pdf-for-questions endpoint called")
    try:
        if not file.filename.endswith('.pdf'):
            return JSONResponse(
                status_code=400,
                content={"error": "Please upload a PDF file"}
            )
        
        print(f"📁 Processing PDF for questions: {file.filename}")
        
        # Step 1: Extract text from PDF
        text = extract_text_from_pdf(file.file)
        if not text:
            return JSONResponse(
                status_code=400,
                content={"error": "Could not extract text from PDF"}
            )
        
        print(f"✅ Extracted {len(text)} characters from PDF")
        
        # Step 2: Extract answers for our specific questions
        extracted_answers = extract_answers_for_questions(text)
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "PDF processed for questions!",
                "extracted_answers": extracted_answers
            }
        )
        
    except Exception as e:
        print(f"❌ Error in /parse-pdf-for-questions: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": f"PDF processing failed: {str(e)}"}
        )

# Enhanced audio parsing for specific questions
@app.post("/parse-audio-for-questions")
async def parse_audio_for_questions(file: UploadFile = File(...)):
    print("🟢 /parse-audio-for-questions endpoint called")
    try:
        allowed_types = ['.mp3', '.wav', '.m4a', '.ogg', '.mp4']
        if not any(file.filename.lower().endswith(ext) for ext in allowed_types):
            return {"error": "Please upload an audio file"}
        
        print(f"📁 Processing audio for questions: {file.filename}")
        
        # Step 1: Transcribe audio to text
        transcript = transcribe_audio(file.file, file.filename)
        if not transcript:
            return {"error": "Could not transcribe audio"}
        
        print(f"✅ Transcribed {len(transcript)} characters from audio")
        
        # Step 2: Extract answers for our specific questions
        extracted_answers = extract_answers_for_questions(transcript)
        
        return {
            "status": "success",
            "message": "Audio processed for questions!",
            "extracted_answers": extracted_answers
        }
        
    except Exception as e:
        print(f"❌ Error in /parse-audio-for-questions: {e}")
        return {"error": f"Audio processing failed: {str(e)}"}

# Get all patients endpoint
@app.get("/patients")
def get_patients():
    """Get all saved patients from the database"""
    try:
        db = SessionLocal()
        patients = db.query(Patient).order_by(Patient.created_at.desc()).all()
        db.close()
        
        # Convert to list of dictionaries for JSON response
        patient_list = []
        for patient in patients:
            patient_list.append({
                "id": patient.id,
                "patient_name": patient.patient_name,
                "date_of_birth": patient.date_of_birth,
                "primary_diagnosis": patient.primary_diagnosis,
                "created_at": patient.created_at.isoformat()
            })
        
        return {
            "status": "success",
            "count": len(patient_list),
            "patients": patient_list
        }
        
    except Exception as e:
        return {"error": f"Failed to fetch patients: {str(e)}"}        

#if __name__ == "__main__":
 #   port = int(os.environ.get("PORT", 10000))  # Use 10000 as default
 #   print(f"🚀 Starting server on port {port}")
 #   uvicorn.run(app, host="0.0.0.0", port=port)