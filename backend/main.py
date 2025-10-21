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

# Load environment variables from .env file
load_dotenv()

# Get OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

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
        "http://localhost:5173",
        "https://intake-prototype-h85w6140b-mesotus-projects.vercel.app",
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
    """Extract text from PDF file using pdfplumber"""
    try:
        import pdfplumber
        text = ""
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    except Exception as e:
        print(f"❌ Error extracting text from PDF: {e}")
        return None

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
            file=file_tuple,  # ← CHANGE THIS from audio_file to file_tuple
            response_format="text"
        )
        
        print("✅ Audio transcribed successfully")
        return response
        
    except Exception as e:
        print(f"❌ Error transcribing audio: {e}")
        return None

@app.get("/")
def read_root():
    return {"message": "Backend is working!"}

# Parse PDF Endpoint
@app.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    # Simple check
    if not file.filename.endswith('.pdf'):
        return {"error": "Please upload a PDF file"}
    
    try:
        # Step 1: Extract text from PDF
        text = extract_text_from_pdf(file.file)
        if not text:
            return {"error": "Could not extract text from PDF"}
        
        # Step 2: Use AI to extract structured data
        extracted_data = extract_data_with_ai(text)

        # Step 3: Save to database ← ADD HERE
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
            "message": "PDF processed successfully!",
            "extracted_data": extracted_data
        }
        
    except Exception as e:
        return {"error": f"Processing failed: {str(e)}"}

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

        # Step 3: Save to database ← ADD THIS BLOCK
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)