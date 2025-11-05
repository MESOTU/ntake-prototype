// IntakePage.tsx
import { useState, useRef } from 'react';
import {
  Container, Box, Typography, Button, Alert,
  Card, CardContent, CircularProgress,
  AppBar, Tabs, Tab
} from '@mui/material';
import { INTAKE_QUESTIONS } from './IntakeQuestions';
import QuestionWithAIAnswer from './QuestionWithAIAnswer';

// Define types for our data
interface FormData {
  [key: string]: any;
}

interface AIAnswers {
  [key: string]: any;
}

// Audio Recorder Component (same as DemoPage)
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
      
      const options = { 
        mimeType: 'audio/webm;codecs=opus' 
      };
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setIsProcessing(true);
        
        Promise.resolve(onRecordingComplete(audioBlob))
          .finally(() => {
            setIsProcessing(false);
          });
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setStopCountdown(0);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setStopCountdown(3);
      
      const countdownInterval = setInterval(() => {
        setStopCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
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
    </Box>
  );
};

// Helper function to flatten nested objects
const flattenObject = (obj: any, prefix = ''): AIAnswers => {
  const flattened: AIAnswers = {};
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      // Recursively flatten nested objects
      const nestedFlattened = flattenObject(obj[key], `${prefix}${key}.`);
      Object.assign(flattened, nestedFlattened);
    } else {
      // Handle arrays and primitive values
      flattened[`${prefix}${key}`] = obj[key];
    }
  }
  
  return flattened;
};

// NEW FUNCTION: Process AI answers to match form expectations
const processAIAnswersForForm = (flattenedAnswers: AIAnswers, questions: any[]): FormData => {
  const processedData: FormData = {};
  
  Object.entries(flattenedAnswers).forEach(([field, value]) => {
    if (value !== 'Unknown' && value !== null && value !== undefined) {
      // Find the question for this field
      const question = questions.find(q => q.data_path === field);
      
      if (question) {
        switch (question.type) {
          case 'single_choice':
            // For single choice, check if the AI answer matches any option exactly
            if (question.options && question.options.includes(value)) {
              processedData[field] = value;
              console.log(`✅ Exact match for ${field}: "${value}"`);
            } else {
              // If no exact match, try to find a close match
              const matchedOption = question.options?.find((option: string) => 
                option.toLowerCase().includes(value.toLowerCase()) || 
                value.toLowerCase().includes(option.toLowerCase())
              );
              if (matchedOption) {
                processedData[field] = matchedOption;
                console.log(`🔍 Fuzzy matched "${value}" to "${matchedOption}" for ${field}`);
              } else {
                processedData[field] = value; // Fallback to raw value
                console.log(`❌ No match found for ${field}: "${value}"`);
              }
            }
            break;
            
          case 'multiple_choice':
            // For multiple choice, handle both single values and arrays
            if (Array.isArray(value)) {
              // If it's already an array, use it directly
              processedData[field] = value;
            } else if (typeof value === 'string') {
              // If it's a string, check if it matches any options
              const matchedOptions = question.options?.filter((option: string) => 
                option.toLowerCase().includes(value.toLowerCase()) || 
                value.toLowerCase().includes(option.toLowerCase())
              ) || [];
              
              if (matchedOptions.length > 0) {
                processedData[field] = matchedOptions;
                console.log(`🔍 Multiple choice matched "${value}" to ${JSON.stringify(matchedOptions)} for ${field}`);
              } else {
                processedData[field] = [value]; // Fallback to array with raw value
              }
            }
            break;
            
          default:
            // For other types, use the value directly
            processedData[field] = value;
        }
      } else {
        // If no question found, use value directly
        processedData[field] = value;
      }
    }
  });
  
  return processedData;
};

const IntakePage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [aiAnswers, setAiAnswers] = useState<AIAnswers>({});
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);

  // Get unique sections from questions
  const sections = Array.from(new Set(INTAKE_QUESTIONS.map(q => q.section)));
  
  // Filter questions for current section
  const currentSectionQuestions = INTAKE_QUESTIONS.filter(
    question => question.section === sections[currentSection]
  );

  const handleFileUpload = async (file: File, type: 'pdf' | 'audio') => {
    const uploadFormData = new FormData(); 
    uploadFormData.append('file', file);
    
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const endpoint = type === 'pdf' 
      ? `${backendUrl}/parse-pdf-for-intake`
      : `${backendUrl}/parse-audio-for-intake`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: uploadFormData, 
      });
      
      const result = await response.json();

      console.log('🔍 FULL BACKEND RESPONSE:', result);
      console.log('📊 AI EXTRACTED ANSWERS (RAW):', result.extracted_answers);
      console.log('🎯 NUMBER OF RAW ANSWERS FOUND:', Object.keys(result.extracted_answers || {}).length);
      
      if (result.status === 'success') {
        // Flatten the nested AI response
        const flattenedAnswers = flattenObject(result.extracted_answers || {});
        
        console.log('📊 AI EXTRACTED ANSWERS (FLATTENED):', flattenedAnswers);
        console.log('🎯 NUMBER OF FLATTENED ANSWERS:', Object.keys(flattenedAnswers).length);
        
        setAiAnswers(flattenedAnswers);
        setFileUploaded(true);
        
        // Process AI answers for form compatibility
        const processedAnswers = processAIAnswersForForm(flattenedAnswers, INTAKE_QUESTIONS);
        
        // Auto-populate answers where AI is confident
        const updatedData = { ...formData, ...processedAnswers };
        setFormData(updatedData);
        
        console.log('✅ FINAL PROCESSED FORM DATA:', processedAnswers);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error}`);
    } 
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    const uploadFormData = new FormData();
    const audioFile = new File([audioBlob], 'live-recording.wav', { type: 'audio/wav' });
    uploadFormData.append('file', audioFile);
      
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
    try {
      const response = await fetch(`${backendUrl}/parse-audio-for-intake`, {
        method: 'POST',
        body: uploadFormData,
      });
        
      const result = await response.json();

      if (result.status === 'success') {
        // Flatten the nested AI response for audio too
        const flattenedAnswers = flattenObject(result.extracted_answers || {});
        
        console.log('🔊 AUDIO - FLATTENED AI ANSWERS:', flattenedAnswers);
        
        setAiAnswers(flattenedAnswers);
        setFileUploaded(true);
        
        // Process AI answers for form compatibility
        const processedAnswers = processAIAnswersForForm(flattenedAnswers, INTAKE_QUESTIONS);
        
        const updatedData = { ...formData, ...processedAnswers };
        setFormData(updatedData);
        
        console.log('🔊 AUDIO - FINAL PROCESSED FORM DATA:', processedAnswers);
      }
    } catch (error) {
      console.error('Recording processing failed:', error);
      alert('Failed to process recording. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Full Intake Assessment
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Complete assessment form with AI-assisted answer extraction
        </Typography>

        {/* Upload Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upload Documents or Record Live Conversation
            </Typography>
            
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

        {/* Section Navigation Tabs */}
        <AppBar position="static" sx={{ mb: 3 }}>
          <Tabs
            value={currentSection}
            onChange={(_, newValue) => setCurrentSection(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {sections.map((section, index) => (
              <Tab 
                key={section} 
                label={section.replace(/_/g, ' ').toUpperCase()}
                id={`section-tab-${index}`}
                sx={{ 
                  color: 'white', // Force white text
                  '&.Mui-selected': {
                  color: 'white', // Keep white when selected
                }
              }}
              />
            ))}
          </Tabs>
        </AppBar>

        {/* Current Section Questions */}
        <Box>
          {currentSectionQuestions.map((question) => (
            <Card key={question.id} sx={{ mb: 2 }}>
              <CardContent>
                <QuestionWithAIAnswer
                  question={question}
                  value={formData[question.data_path]}
                  aiAnswer={aiAnswers[question.data_path]}
                  onChange={(value: any) => setFormData(prev => ({
                    ...prev,
                    [question.data_path]: value
                  }))}
                />
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Section Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={currentSection === 0}
            onClick={() => setCurrentSection(prev => prev - 1)}
            variant="outlined"
          >
            Previous Section
          </Button>
          
          <Button
            variant="contained"
            onClick={() => {
              if (currentSection < sections.length - 1) {
                setCurrentSection(prev => prev + 1);
              } else {
                console.log('Form completed:', formData);
                alert('Assessment completed! Check console for data.');
              }
            }}
          >
            {currentSection < sections.length - 1 ? 'Next Section' : 'Complete Assessment'}
          </Button>
        </Box>

        {/* Debug Info */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h6">Debug Info</Typography>
          <Typography variant="body2">
            Current Section: {sections[currentSection]}
          </Typography>
          <Typography variant="body2">
            Questions in Section: {currentSectionQuestions.length}
          </Typography>
          <Typography variant="body2">
            AI Answers: {Object.keys(aiAnswers).length}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace', fontSize: '0.75rem' }}>
            Sample AI Answers: {JSON.stringify(Object.entries(aiAnswers).slice(0, 3))}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export { IntakePage as default };