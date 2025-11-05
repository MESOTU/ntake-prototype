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
    """Extract answers for our 7 demo questions from text with enhanced understanding"""
    try:
        prompt = f"""
        Analyze this medical conversation text and extract specific information for these 7 questions.
        Use contextual understanding and medical knowledge to map terms appropriately.

        TEXT TO ANALYZE:
        {text}

        QUESTIONS TO ANSWER:
        1. Are you a new participant? (Answer: "Yes" or "No" - look for terms like "new", "first time", "returning", "existing")
        2. What diagnoses or conditions do you have? (List specific conditions - expand abbreviations: MS→Multiple Sclerosis, COPD→Chronic Obstructive Pulmonary Disease, etc.)
        3. How often do you get upset, angry, anxious, withdrawn? (Answer: "Never", "Rarely", "Occasionally", "Often", "Almost always" - map synonyms: "sometimes"→"Occasionally", "frequently"→"Often")
        4. How much support do you need to manage physical challenges? (0-10 number - extract numbers mentioned like "7 out of 10" or descriptive terms mapped to numbers)
        5. What are your living arrangements? (Describe living situation - extract who they live with, type of housing)
        6. In the last 30 days, how much was your family impacted because of your disability? (Answer: "None", "Mild", "Moderate", "Severe", "Extreme", "Not Applicable" - map intensity terms: "a little"→"Mild", "somewhat"→"Moderate", "very"→"Severe", "extremely"→"Extreme")
        7. If we were to score your impairment restrictions (0-5 scale with 0.5 increments - extract numbers mentioned like "3 on a 5 point scale")

        IMPORTANT MAPPING RULES:
        - "MS", "multiple sclerosis" → "Multiple Sclerosis"
        - "sometimes", "occasionally" → "Occasionally" 
        - "often", "frequently" → "Often"
        - "rarely", "seldom" → "Rarely"
        - "a little", "slightly" → "Mild"
        - "somewhat", "moderately" → "Moderate"
        - "very", "severely", "significantly" → "Severe"
        - "extremely", "critically" → "Extreme"
        - Extract numbers directly when mentioned (e.g., "7 out of 10" → 7, "3 on a 5 point scale" → 3)

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

def extract_answers_for_intake_questions(text):
    """Extract answers for ALL intake questions from text"""
    try:
        prompt = f"""

        Analyze this conversation text and extract specific information for these intake questions.
        Use advanced contextual understanding and medical knowledge to infer answers from both explicit statements and implied meanings from descriptions, symptoms, and daily experiences..

        TEXT TO ANALYZE:
        {text}

        ADVANCED INFERENCE FRAMEWORK:

        SCALE RATING INTERPRETATION (0-5):
        0 (None): No mention of difficulty, describes full independence, "no problems", "easy"
        1 (Mild): "Minor", "slight", "a little", "barely noticeable", "manageable without help"
        2 (Moderate): "Some", "occasional", "now and then", "moderate", "needs minimal assistance"
        3 (Severe): "Significant", "major", "regular", "often", "frequent help needed", "struggles with"
        4 (Extreme): "Constant", "always", "cannot manage", "completely unable", "dependent on others"
        5 (Not Applicable): Activity not attempted, condition prevents participation entirely

        YES/NO INFERENCE PATTERNS:
        YES Indicators: "Help with", "assistance for", "support to", "needs help", "requires aid", 
                    "can't do alone", "struggles to", "finds it hard to", "depends on", 
                    "caregiver helps", "family assists", "worker supports"
        NO Indicators: "Independent", "manages alone", "no help needed", "self-sufficient",
                    "does everything myself", "no assistance", "handles independently"
        UNSURE Indicators: "Sometimes", "it depends", "varies", "good days and bad days",
                        "uncertain", "not sure", "maybe"

        SYMPTOM-TO-CONDITION MAPPING:
        PHYSICAL: wheelchair, cane, walker, mobility issues, weakness, tremors, shaking,
                fatigue, tiredness, exhaustion, balance problems, falling, dizziness,
                pain, stiffness, muscle spasms, coordination issues

        COGNITIVE: memory problems, forgetting, confusion, disorientation, concentration issues,
                distractibility, attention problems, problem-solving difficulties,
                decision-making challenges, learning difficulties

        EMOTIONAL: anxiety, worry, fear, panic attacks, depression, sadness, low mood,
                anger, frustration, irritability, mood swings, emotional outbursts,
                withdrawal, isolation, social anxiety

        COMMUNICATION: difficulty understanding, trouble following conversations,
                    speech problems, stuttering, finding words, expressive difficulties,
                    social communication challenges, avoiding conversations

        SENSORY: vision problems, hearing difficulties, sensitivity to light/sound,
                sensory overload, tactile sensitivities

        ACTIVITY PARTICIPATION INDICATORS:
        - Structured activities: "day program", "work", "school", "classes", "therapy sessions"
        - Community participation: "shopping", "appointments", "outings", "events", "social gatherings"
        - Social participation: "friends", "family visits", "phone calls", "social media"
        - Recreation: "hobbies", "leisure activities", "entertainment", "sports", "crafts"

        SUPPORT NEEDS CLASSIFICATION:
        - Personal care: bathing, dressing, grooming, toileting, feeding
        - Household: cleaning, cooking, shopping, laundry, home maintenance
        - Medical: medications, appointments, treatments, therapy exercises
        - Mobility: transportation, transfers, walking assistance
        - Communication: interpreters, communication devices, speech therapy
        - Cognitive: reminders, scheduling, decision support, memory aids
        - Emotional: counseling, emotional support, crisis management
        - Social: social skills, relationship support, community integration

        CONTEXTUAL CLUES FOR SPECIFIC QUESTIONS:

        FOR WORK/SCHOOL PARTICIPATION:
        - Mentions of employment, job, workplace, colleagues → participates in work
        - Mentions of school, classes, studying, teachers → participates in education  
        - Mentions of day programs, centers, structured activities → participates in structured learning
        - Mentions of volunteering, community work → participates in productive activities

        FOR DIFFICULTY LEVELS:
        - Time-based clues: "takes longer", "needs extra time", "slow to complete" → moderate-severe difficulty
        - Assistance clues: "with help", "with support", "needs assistance" → significant difficulty
        - Emotional clues: "frustrating", "overwhelming", "stressful" → moderate-severe difficulty
        - Frequency clues: "always", "often", "frequently" → consistent difficulty

        FOR SUPPORT NEEDS:
        - Equipment mentions: wheelchair, walker, communication device → equipment support needed
        - Personal assistance: caregiver, support worker, family help → personal support needed
        - Environmental: home modifications, accessibility features → environmental support needed
        - Professional: therapists, doctors, specialists → professional support needed

        PAY ATTENTION TO:
        - Comparative language: "harder than before", "worse than last year", "improved since"
        - Conditional statements: "when I'm tired", "on bad days", "if it's crowded"
        - Frequency modifiers: "always", "often", "sometimes", "rarely", "never"
        - Intensity descriptors: "mild", "moderate", "severe", "extreme", "overwhelming"
        - Support terminology: "help", "assistance", "support", "aid", "care"

        USE CONTEXTUAL REASONING:
        - If someone uses a wheelchair, infer mobility challenges and potential need for accessibility supports
        - If someone mentions memory problems, infer potential need for reminders and cognitive supports
        - If someone describes social anxiety, infer potential participation restrictions in social settings
        - If someone has multiple medications, infer potential need for medication management support
        - If someone has fluctuating conditions, infer that challenges may vary day-to-day

        EXTRACT ANSWERS FOR THESE QUESTIONS AND DATA PATHS:

        INTRODUCTION SECTION:
        - "introduction.today_date" (extract date as DD/MM/YYYY)
        - "introduction.who_completing" (match to: Participant/client/patient, Family member/parent, Carer, Participant AND family member together, Legal guardian, Support worker, Intake team, Allied health professional, Teacher/educator, Employer/workplace)
        - "introduction.new_participant" (Yes/No)
        - "introduction.urgent_help" (Yes/No)
        - "introduction.services_used" (list from: Active Community, Supported Independent Living, Specialist Disability Accommodation, Respite Care (STA, MTA), SLES Work Program, Employment, Allied Health)
        - "introduction.active_service_location" (Home/Community/Both)
        - "introduction.referral_source" (list from: Your COS, Your school, Someone in your healthcare team, Someone in your family, A friend, Other)
        - "introduction.motivation" (extract text about motivation)
        - "introduction.funding_source" (list from: NDIS, Workcover, Private/Self-funded, Aged Care/DVA funding, Other)
        - "introduction.funding_source_other" (if Other selected, extract details)
        - "introduction.funding_supports" (list from: Capital Supports, Capacity Building Supports, Core Supports, Other)
        - "introduction.funding_supports_other" (if Other selected, extract details)

        ABOUT ME SECTION:
        - "about_me.year_of_birth" (extract year as number)
        - "about_me.postcode" (extract postcode as number)
        - "about_me.gender" (match to: Female, Male, Non-Binary, Transgender Female, Transgender Male, Prefer Not To Say, Other)
        - "about_me.gender_other" (if Other selected, extract details)
        - "about_me.cultural_background" (list from: Australian - from an English speaking, Anglo-Celtic background, Australian - from a culturally and linguistically diverse background, Aboriginal, Torres Strait Islander, Other)
        - "about_me.living_arrangements" (extract text about living situation)
        - "about_me.things_love" (extract text about likes/enjoyments)
        - "about_me.things_dislike" (extract text about dislikes/avoidances)
        - "about_me.friends_family_description" (extract text about personality/relationships)

        ABOUT FAMILY SECTION:
        - "about_family.family_members" (extract text about family composition)
        - "about_family.family_relationship" (extract text about family relationships)
        - "about_family.legal_decision_maker" (Yes/No/NA)
        - "about_family.decision_maker_name" (if Yes, extract name)
        - "about_family.family_activities" (extract text about family activities)
        - "about_family.family_help" (extract text about family support)
        - "about_family.family_impact_level" (None/Mild/Moderate/Severe/Extreme)
        - "about_family.family_impact_ways" (extract text about impact details)
        - "about_family.personal_story" (extract text about personal history)

        ICF IMPAIRMENT SECTION:
        - "icf_impairment.diagnoses" (list from: Brain Injury/Head Injury, Anorexia, Anxiety Disorder, ADHD, Autism, Bipolar Affective Disorder, Cerebral Palsy, Chronic Fatigue/ME, COPD, Congenital abnormality/deformity, Developmental Language Disorder, Dementia, Depression, Diabetes, Downs Syndrome, Dysarthria, Dysfluency, Dysphagia, Dysphasia/Aphasia, Dyspraxia, Epilepsy, Hearing Impairment/Deafness, Incontinence, Insulin Dependent Diabetes, Learning Disability, Neurological disorder, Non Insulin Dependent Diabetes, PTSD, Sensory Processing Disorder, Stroke, RET Syndrome, Spinal Injury, Tourette's Syndrome, Vision impairment, Fragile X, Obesity)
        - "icf_impairment.physical.challenges_description" (extract text about physical challenges)
        - "icf_impairment.physical.challenges_worsened" (Yes/No)
        - "icf_impairment.physical.changes_description" (extract text about physical changes)
        - "icf_impairment.physical.monitoring_needs" (extract text about monitoring needs)
        - "icf_impairment.body_systems.challenges" (extract text about body system challenges)
        - "icf_impairment.body_systems.worsened" (Yes/No)
        - "icf_impairment.body_systems.changes_description" (extract text about body system changes)
        - "icf_impairment.body_systems.monitoring_needs" (extract text about monitoring needs)
        - "icf_impairment.cognitive_emotional.challenges" (extract text about cognitive/emotional challenges)
        - "icf_impairment.cognitive_emotional.worsened" (Yes/No)
        - "icf_impairment.cognitive_emotional.changes_description" (extract text about cognitive/emotional changes)
        - "icf_impairment.cognitive_emotional.monitoring_needs" (extract text about monitoring needs)
        - "icf_impairment.supports_needs.current_medications" (extract text about medications)
        - "icf_impairment.supports_needs.medication_supports" (extract text about medication supports)
        - "icf_impairment.supports_needs.medical_specialists" (extract text about medical specialists)
        - "icf_impairment.supports_needs.specialist_appointment_supports" (extract text about specialist appointment supports)
        - "icf_impairment.supports_needs.therapists_therapies" (extract text about therapists/therapies)
        - "icf_impairment.supports_needs.therapy_appointment_supports" (extract text about therapy appointment supports)
        - "icf_impairment.supports_needs.special_diet" (extract text about special diet)
        - "icf_impairment.supports_needs.diet_supports" (extract text about diet supports)
        - "icf_impairment.supports_needs.environmental_supports" (extract text about environmental supports)
        - "icf_impairment.supports_needs.equipment_needs" (extract text about equipment needs)
        - "icf_impairment.supports_needs.equipment_usage_supports" (extract text about equipment usage supports)
        - "icf_impairment.supports_needs.sensory_supports" (extract text about sensory supports)
        - "icf_impairment.supports_needs.sensory_supports_usage" (extract text about sensory supports usage)
        - "icf_impairment.unmet_needs.support_needs" (extract text about unmet support needs)
        - "icf_impairment.impairment_score.score" (extract number 0-5 with 0.5 increments for impairment score)

        ICF ACTIVITY SECTION:
        - "icf_activity.understanding_communicating.needs_support" (Yes/No/Unsure)
        - "icf_activity.understanding_communicating.concentration_difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_activity.understanding_communicating.support_concentration" (Yes/No/Unsure)
        - "icf_activity.understanding_communicating.concentration_supports" (extract text about concentration supports)
        - "icf_activity.understanding_communicating.remembering_difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_activity.understanding_communicating.support_remembering" (Yes/No/Unsure)
        - "icf_activity.understanding_communicating.remembering_supports" (extract text about remembering supports)
        - "icf_activity.understanding_communicating.problem_solving_difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_activity.understanding_communicating.support_problem_solving" (Yes/No/Unsure)
        - "icf_activity.understanding_communicating.problem_solving_supports" (extract text about problem solving supports)
        - "icf_activity.understanding_communicating.learning_difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_activity.understanding_communicating.support_learning" (Yes/No/Unsure)
        - "icf_activity.understanding_communicating.learning_supports" (extract text about learning supports)
        - "icf_activity.understanding_communicating.understanding_difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_activity.understanding_communicating.support_understanding" (Yes/No/Unsure)
        - "icf_activity.understanding_communicating.understanding_supports" (extract text about understanding supports)
        - "icf_activity.understanding_communicating.conversation_difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_activity.understanding_communicating.support_conversation" (Yes/No/Unsure)
        - "icf_activity.understanding_communicating.conversation_supports" (extract text about conversation supports)
        - "icf_activity.understanding_communicating.unmet_supports" (extract text about unmet communication supports)

        ICF PARTICIPATION SECTION:
        - "icf_participation.school_work.participates" (Yes/No/Unsure)
        - "icf_participation.school_work.daily_difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_participation.school_work.support_daily" (Yes/No/Unsure)
        - "icf_participation.school_work.daily_supports" (extract text about daily work/school supports)
        - "icf_participation.school_work.important_tasks_difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_participation.school_work.support_important_tasks" (Yes/No/Unsure)
        - "icf_participation.school_work.important_tasks_supports" (extract text about important tasks supports)
        - "icf_participation.school_work.completing_difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_participation.school_work.support_completing" (Yes/No/Unsure)
        - "icf_participation.school_work.completing_supports" (extract text about completing work supports)
        - "icf_participation.school_work.speed_difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_participation.school_work.support_speed" (Yes/No/Unsure)
        - "icf_participation.school_work.speed_supports" (extract text about work speed supports)
        - "icf_participation.school_work.unmet_supports" (extract text about unmet school/work supports)
        - "icf_participation.community.problems_support" (Yes/No/Unsure)
        - "icf_participation.community.joining_difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_participation.community.supports" (extract text about community supports)
        - "icf_participation.community.unmet_supports" (extract text about unmet community supports)
        - "icf_participation.relaxation.difficulty" (0-5: None/Mild/Moderate/Severe/Extreme/Not Applicable)
        - "icf_participation.relaxation.support" (Yes/No/Unsure)
        - "icf_participation.relaxation.supports" (extract text about relaxation supports)
        - "icf_participation.relaxation.unmet_supports" (extract text about unmet relaxation supports)
        - "icf_participation.other.limitations" (Yes/No/Unsure)
        - "icf_participation.other.limitations_details" (extract text about other participation limitations)
        - "icf_participation.score.score" (extract number 0-5 with 0.5 increments for participation score)

        ICF WELL-BEING SECTION:
        - "icf_wellbeing.emotional_frequency" (0-5: Never/Rarely/Sometimes/Often/Very often/All the time)
        - "icf_wellbeing.emotional_intensity" (0-5: No intensity/Mild/Moderate/High/Very high/Extreme)
        - "icf_wellbeing.emotional_experience" (extract text about emotional experiences)
        - "icf_wellbeing.emotional_triggers" (extract text about emotional triggers)
        - "icf_wellbeing.emotional_supports" (extract text about emotional supports)
        - "icf_wellbeing.unmet_supports" (extract text about unmet emotional supports)
        - "icf_wellbeing.score.score" (extract number 0-5 with 0.5 increments for wellbeing score)

        IMPORTANT: When in doubt between two possible interpretations, choose the more specific and contextual one based on the overall narrative.

        RETURN AS JSON with these exact field names. For any information that is missing or unclear, use "Unknown".
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
            print(f"✅ AI extracted answers for ALL intake questions: {extracted_data}")
            return extracted_data
        except json.JSONDecodeError:
            print("❌ AI didn't return valid JSON:", result_text)
            # Return empty object for all fields
            return create_empty_intake_answers_object()
        
    except Exception as e:
        print(f"❌ Error in extract_answers_for_intake_questions: {e}")
        return create_empty_intake_answers_object()

def create_empty_intake_answers_object():
    """Create an empty answers object for all intake questions"""
    return {
        # Introduction questions
        "introduction.today_date": "Unknown",
        "introduction.who_completing": "Unknown",
        "introduction.new_participant": "Unknown",
        "introduction.urgent_help": "Unknown",
        "introduction.services_used": "Unknown",
        "introduction.active_service_location": "Unknown",
        "introduction.referral_source": "Unknown",
        "introduction.motivation": "Unknown",
        "introduction.funding_source": "Unknown",
        "introduction.funding_source_other": "Unknown",
        "introduction.funding_supports": "Unknown",
        "introduction.funding_supports_other": "Unknown",
        
        # About Me questions
        "about_me.year_of_birth": "Unknown",
        "about_me.postcode": "Unknown",
        "about_me.gender": "Unknown",
        "about_me.gender_other": "Unknown",
        "about_me.cultural_background": "Unknown",
        "about_me.living_arrangements": "Unknown",
        "about_me.things_love": "Unknown",
        "about_me.things_dislike": "Unknown",
        "about_me.friends_family_description": "Unknown",
        
        # About Family questions
        "about_family.family_members": "Unknown",
        "about_family.family_relationship": "Unknown",
        "about_family.legal_decision_maker": "Unknown",
        "about_family.decision_maker_name": "Unknown",
        "about_family.family_activities": "Unknown",
        "about_family.family_help": "Unknown",
        "about_family.family_impact_level": "Unknown",
        "about_family.family_impact_ways": "Unknown",
        "about_family.personal_story": "Unknown",

        # ICF Impairment Section
        "icf_impairment.diagnoses": "Unknown",
        "icf_impairment.physical.challenges_description": "Unknown",
        "icf_impairment.physical.challenges_worsened": "Unknown",
        "icf_impairment.physical.changes_description": "Unknown",
        "icf_impairment.physical.monitoring_needs": "Unknown",
        "icf_impairment.body_systems.challenges": "Unknown",
        "icf_impairment.body_systems.worsened": "Unknown",
        "icf_impairment.body_systems.changes_description": "Unknown",
        "icf_impairment.body_systems.monitoring_needs": "Unknown",
        "icf_impairment.cognitive_emotional.challenges": "Unknown",
        "icf_impairment.cognitive_emotional.worsened": "Unknown",
        "icf_impairment.cognitive_emotional.changes_description": "Unknown",
        "icf_impairment.cognitive_emotional.monitoring_needs": "Unknown",
        "icf_impairment.supports_needs.current_medications": "Unknown",
        "icf_impairment.supports_needs.medication_supports": "Unknown",
        "icf_impairment.supports_needs.medical_specialists": "Unknown",
        "icf_impairment.supports_needs.specialist_appointment_supports": "Unknown",
        "icf_impairment.supports_needs.therapists_therapies": "Unknown",
        "icf_impairment.supports_needs.therapy_appointment_supports": "Unknown",
        "icf_impairment.supports_needs.special_diet": "Unknown",
        "icf_impairment.supports_needs.diet_supports": "Unknown",
        "icf_impairment.supports_needs.environmental_supports": "Unknown",
        "icf_impairment.supports_needs.equipment_needs": "Unknown",
        "icf_impairment.supports_needs.equipment_usage_supports": "Unknown",
        "icf_impairment.supports_needs.sensory_supports": "Unknown",
        "icf_impairment.supports_needs.sensory_supports_usage": "Unknown",
        "icf_impairment.unmet_needs.support_needs": "Unknown",
        "icf_impairment.impairment_score.score": "Unknown",

        # ICF Activity Section
        "icf_activity.understanding_communicating.needs_support": "Unknown",
        "icf_activity.understanding_communicating.concentration_difficulty": "Unknown",
        "icf_activity.understanding_communicating.support_concentration": "Unknown",
        "icf_activity.understanding_communicating.concentration_supports": "Unknown",
        "icf_activity.understanding_communicating.remembering_difficulty": "Unknown",
        "icf_activity.understanding_communicating.support_remembering": "Unknown",
        "icf_activity.understanding_communicating.remembering_supports": "Unknown",
        "icf_activity.understanding_communicating.problem_solving_difficulty": "Unknown",
        "icf_activity.understanding_communicating.support_problem_solving": "Unknown",
        "icf_activity.understanding_communicating.problem_solving_supports": "Unknown",
        "icf_activity.understanding_communicating.learning_difficulty": "Unknown",
        "icf_activity.understanding_communicating.support_learning": "Unknown",
        "icf_activity.understanding_communicating.learning_supports": "Unknown",
        "icf_activity.understanding_communicating.understanding_difficulty": "Unknown",
        "icf_activity.understanding_communicating.support_understanding": "Unknown",
        "icf_activity.understanding_communicating.understanding_supports": "Unknown",
        "icf_activity.understanding_communicating.conversation_difficulty": "Unknown",
        "icf_activity.understanding_communicating.support_conversation": "Unknown",
        "icf_activity.understanding_communicating.conversation_supports": "Unknown",
        "icf_activity.understanding_communicating.unmet_supports": "Unknown",

        # ICF Participation Section
        "icf_participation.school_work.participates": "Unknown",
        "icf_participation.school_work.daily_difficulty": "Unknown",
        "icf_participation.school_work.support_daily": "Unknown",
        "icf_participation.school_work.daily_supports": "Unknown",
        "icf_participation.school_work.important_tasks_difficulty": "Unknown",
        "icf_participation.school_work.support_important_tasks": "Unknown",
        "icf_participation.school_work.important_tasks_supports": "Unknown",
        "icf_participation.school_work.completing_difficulty": "Unknown",
        "icf_participation.school_work.support_completing": "Unknown",
        "icf_participation.school_work.completing_supports": "Unknown",
        "icf_participation.school_work.speed_difficulty": "Unknown",
        "icf_participation.school_work.support_speed": "Unknown",
        "icf_participation.school_work.speed_supports": "Unknown",
        "icf_participation.school_work.unmet_supports": "Unknown",
        "icf_participation.community.problems_support": "Unknown",
        "icf_participation.community.joining_difficulty": "Unknown",
        "icf_participation.community.supports": "Unknown",
        "icf_participation.community.unmet_supports": "Unknown",
        "icf_participation.relaxation.difficulty": "Unknown",
        "icf_participation.relaxation.support": "Unknown",
        "icf_participation.relaxation.supports": "Unknown",
        "icf_participation.relaxation.unmet_supports": "Unknown",
        "icf_participation.other.limitations": "Unknown",
        "icf_participation.other.limitations_details": "Unknown",
        "icf_participation.score.score": "Unknown",

        # ICF Well-being Section
        "icf_wellbeing.emotional_frequency": "Unknown",
        "icf_wellbeing.emotional_intensity": "Unknown",
        "icf_wellbeing.emotional_experience": "Unknown",
        "icf_wellbeing.emotional_triggers": "Unknown",
        "icf_wellbeing.emotional_supports": "Unknown",
        "icf_wellbeing.unmet_supports": "Unknown",
        "icf_wellbeing.score.score": "Unknown"
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
        print(f"📄 TRANSCRIPTION: {transcript}")  # Live Audio Transcript

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

# Enhanced PDF parsing for intake questions
@app.post("/parse-pdf-for-intake")
async def parse_pdf_for_intake(file: UploadFile = File(...)):
    print("🟢 /parse-pdf-for-intake endpoint called")
    try:
        if not file.filename.endswith('.pdf'):
            return JSONResponse(
                status_code=400,
                content={"error": "Please upload a PDF file"}
            )
        
        print(f"📁 Processing PDF for intake questions: {file.filename}")
        
        # Step 1: Extract text from PDF
        text = extract_text_from_pdf(file.file)
        if not text:
            return JSONResponse(
                status_code=400,
                content={"error": "Could not extract text from PDF"}
            )
        
        print(f"✅ Extracted {len(text)} characters from PDF")
        
        # Step 2: Extract answers for intake questions
        extracted_answers = extract_answers_for_intake_questions(text)
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "PDF processed for intake questions!",
                "extracted_answers": extracted_answers
            }
        )
        
    except Exception as e:
        print(f"❌ Error in /parse-pdf-for-intake: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": f"PDF processing failed: {str(e)}"}
        )

# Enhanced audio parsing for intake questions
@app.post("/parse-audio-for-intake")
async def parse_audio_for_intake(file: UploadFile = File(...)):
    print("🟢 /parse-audio-for-intake endpoint called")
    try:
        allowed_types = ['.mp3', '.wav', '.m4a', '.ogg', '.mp4']
        if not any(file.filename.lower().endswith(ext) for ext in allowed_types):
            return {"error": "Please upload an audio file"}
        
        print(f"📁 Processing audio for intake questions: {file.filename}")
        
        # Step 1: Transcribe audio to text
        transcript = transcribe_audio(file.file, file.filename)
        if not transcript:
            return {"error": "Could not transcribe audio"}
        
        print(f"✅ Transcribed {len(transcript)} characters from audio")
        print(f"📄 TRANSCRIPTION: {transcript}")

        # Step 2: Extract answers for intake questions
        extracted_answers = extract_answers_for_intake_questions(transcript)
        
        return {
            "status": "success",
            "message": "Audio processed for intake questions!",
            "extracted_answers": extracted_answers
        }
        
    except Exception as e:
        print(f"❌ Error in /parse-audio-for-intake: {e}")
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