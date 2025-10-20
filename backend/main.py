from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is working!"}

@app.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    # Simple check
    if not file.filename.endswith('.pdf'):
        return {"error": "Please upload a PDF file"}
    
    # Return mock data for now
    return {
        "status": "success", 
        "message": "File received!",
        "extracted_data": {
            "patient_name": "Test Patient",
            "date_of_birth": "1990-01-01",
            "primary_diagnosis": "Test Condition"
        }
    }

@app.post("/parse-voice")
async def parse_voice(file: UploadFile = File(...)):
    # Basic validation
    allowed_types = ['.mp3', '.wav', '.m4a', '.ogg']
    if not any(file.filename.lower().endswith(ext) for ext in allowed_types):
        return {"error": "Please upload an audio file (MP3, WAV, M4A, OGG)"}
    
    try:
        # For now, return mock data (same as PDF but different message)
        # Later we'll add Whisper API here
        return {
            "status": "success", 
            "message": "Audio file received! (Mock data - Whisper API coming soon)",
            "extracted_data": {
                "patient_name": "Voice Test Patient",
                "date_of_birth": "1975-08-22", 
                "primary_diagnosis": "Audio-recorded Condition"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)