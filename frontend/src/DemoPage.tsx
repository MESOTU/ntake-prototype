// DemoPage.tsx
import { useState, useRef } from 'react';
import { 
  Container, Box, Typography, Button, Alert, 
  Card, CardContent, Stepper, Step, StepLabel,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { DEMO_QUESTIONS } from './demoQuestions';
import QuestionWithAIAnswer from './QuestionWithAIAnswer';

// Define types for our data
interface FormData {
  [key: string]: any;
}

interface AIAnswers {
  [key: string]: string;
}

// Audio Recorder Component - UPDATED WITH TRUNCATION FIXES
const AudioRecorder = ({ onRecordingComplete }: { onRecordingComplete: (audioBlob: Blob) => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stopCountdown, setStopCountdown] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      streamRef.current = stream;
      
      // Try to use better audio formats in order of preference
      const options = { 
        mimeType: 'audio/webm;codecs=opus' 
      };
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('📦 Audio chunk collected:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onstop = () => {
        console.log('🛑 Recording stopped, total chunks:', audioChunksRef.current.length);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setIsProcessing(true);
        
        console.log('🎵 Final audio blob size:', audioBlob.size, 'bytes');
        
        // Call the completion handler and reset processing state when done
        Promise.resolve(onRecordingComplete(audioBlob))
          .finally(() => {
            setIsProcessing(false);
          });
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Start collecting data every second to ensure we capture everything
      mediaRecorder.start(1000);
      setIsRecording(true);
      setStopCountdown(0);
      
      console.log('🎤 Recording started with format:', mediaRecorder.mimeType);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('⏹️ Stopping recording in 3 seconds...');
      setStopCountdown(3);
      
      const countdownInterval = setInterval(() => {
        setStopCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // ACTUALLY STOP RECORDING AFTER COUNTDOWN
            console.log('🎬 Final stop, total chunks:', audioChunksRef.current.length);
            mediaRecorderRef.current!.stop();
            setIsRecording(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
      {!isRecording && !audioURL && !isProcessing && stopCountdown === 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={startRecording}
          sx={{ mb: 1 }}
        >
          🎤 Start Recording
        </Button>
      )}
      
      {isRecording && stopCountdown === 0 && (
        <Button
          variant="contained"
          color="secondary"
          onClick={stopRecording}
          sx={{ mb: 1 }}
        >
          ⏹️ Stop Recording
        </Button>
      )}
      
      {isRecording && stopCountdown > 0 && (
        <Typography variant="body2" color="secondary" sx={{ mb: 1 }}>
          ⏱️ Stopping in {stopCountdown}...
        </Typography>
      )}
      
      {isRecording && (
        <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
          ● Recording in progress... (Speak clearly)
        </Typography>
      )}
      
      {isProcessing && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Processing recording...</Typography>
        </Box>
      )}
      
      {audioURL && !isProcessing && (
        <Box>
          <audio controls src={audioURL} style={{ marginBottom: 8, width: '100%' }} />
          <Typography variant="body2" color="text.secondary">
            Recording complete! Answers extracted automatically.
          </Typography>
        </Box>
      )}
      
      <Typography variant="caption" color="text.secondary">
        Record live conversation with patient - wait for countdown to ensure full capture
      </Typography>
    </Box>
  );
};

const DemoPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({});
  const [aiAnswers, setAiAnswers] = useState<AIAnswers>({});
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);

  const handleFileUpload = async (file: File, type: 'pdf' | 'audio') => {
    const uploadFormData = new FormData(); 
    uploadFormData.append('file', file);
    
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const endpoint = type === 'pdf' 
      ? `${backendUrl}/parse-pdf-for-questions`
      : `${backendUrl}/parse-audio-for-questions`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: uploadFormData, 
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setAiAnswers(result.extracted_answers || {});
        setFileUploaded(true);
        
        // Auto-populate answers where AI is confident
        const updatedData = { ...formData };
        Object.entries(result.extracted_answers || {}).forEach(([field, value]) => {
          if (value !== 'Unknown') {
            updatedData[field] = value;
          }
        });
        setFormData(updatedData);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error}`);
    } 
  };

  // Handler for recording completion
  const handleRecordingComplete = async (audioBlob: Blob) => {
    console.log('🎯 Starting recording processing...');
    console.log('📊 Audio blob size:', audioBlob.size, 'bytes');
    
    const uploadFormData = new FormData();
    const audioFile = new File([audioBlob], 'live-recording.wav', { type: 'audio/wav' });
    uploadFormData.append('file', audioFile);
      
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
    try {
      console.log('📡 Sending to backend...');
      
      const response = await fetch(`${backendUrl}/parse-audio-for-questions`, {
        method: 'POST',
        body: uploadFormData,
      });
        
      const result = await response.json();
      console.log('🔍 FULL BACKEND RESPONSE:', result);

      // Show the actual transcription of live audio
      if (result.transcript) {
        console.log('🎙️ FULL TRANSCRIPTION:', result.transcript);
        console.log('📝 Transcription length:', result.transcript.length, 'characters');
      }
      
      if (result.status === 'success') {
        console.log('✅ AI Extracted Answers:', result.extracted_answers);
        setAiAnswers(result.extracted_answers || {});
        setFileUploaded(true);
          
        // Auto-populate answers
        const updatedData = { ...formData };
        Object.entries(result.extracted_answers || {}).forEach(([field, value]) => {
          console.log(`📝 Field: ${field}, Value: ${value}`);
          if (value !== 'Unknown') {
            updatedData[field] = value;
          }
        });
        setFormData(updatedData);
      } else {
        console.log('❌ Backend returned error:', result);
      }
    } catch (error) {
      console.error('❌ Recording processing failed:', error);
      alert('Failed to process recording. Please try again.');
    }
  };

  const currentQuestion = DEMO_QUESTIONS[currentStep];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Intake Demo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Test how AI can extract answers from PDFs, audio files, or live recordings
        </Typography>

        {/* New Navigation Section to Full Intake Form */}
        <Box sx={{ textAlign: 'center', mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Ready for the full experience?
          </Typography>
          <Button 
            component={Link} 
            to="/intake" 
            variant="contained" 
            color="primary"
            size="large"
          >
            Go to Full Intake Form (33+ Questions)
          </Button>
          <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
            Includes all sections: Introduction, About Me, About My Family, and more
          </Typography>
        </Box>

        {/* Upload Section - UPDATED with recording */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Step 1: Upload Documents or Record Live
            </Typography>
            
            {/* File Upload Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Upload PDF
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0], 'pdf');
                    }
                  }}
                />
              </Button>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Upload Audio File
                <input
                  type="file"
                  accept=".mp3,.wav,.m4a"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0], 'audio');
                    }
                  }}
                />
              </Button>
            </Box>
            
            {/* Live Recording Section */}
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1 }}>
              Or record live conversation:
            </Typography>
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            
            {fileUploaded && (
              <Alert severity="success" sx={{ mt: 2 }}>
                File processed! AI found {Object.keys(aiAnswers).length} potential answers.
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Progress Stepper */}
        <Stepper activeStep={currentStep} sx={{ mb: 3 }}>
          {DEMO_QUESTIONS.map((question) => (
            <Step key={question.id}>
              <StepLabel>
                {question.section}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Current Question */}
        {currentQuestion && (
          <Card>
            <CardContent>
              <QuestionWithAIAnswer
                question={currentQuestion}
                value={formData[currentQuestion.data_path]}
                aiAnswer={aiAnswers[currentQuestion.data_path]}
                onChange={(value: any) => setFormData(prev => ({
                  ...prev,
                  [currentQuestion.data_path]: value
                }))}
              />
              
              {/* Navigation */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Back
                </Button>
                
                <Button
                  variant="contained"
                  onClick={() => {
                    if (currentStep < DEMO_QUESTIONS.length - 1) {
                      setCurrentStep(prev => prev + 1);
                    } else {
                      // Demo complete - show summary
                      console.log('Demo completed:', formData);
                      alert('Demo completed! Check console for data.');
                    }
                  }}
                >
                  {currentStep < DEMO_QUESTIONS.length - 1 ? 'Next' : 'Complete'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h6">Debug Info</Typography>
          <Typography variant="body2">
            AI Answers: {JSON.stringify(aiAnswers)}
          </Typography>
          <Typography variant="body2">
            Form Data: {JSON.stringify(formData)}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export { DemoPage as default };