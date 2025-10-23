// DemoPage.tsx
import { useState } from 'react';
import { 
  Container, Box, Typography, Button, Alert, 
  Card, CardContent, Stepper, Step, StepLabel 
} from '@mui/material';
import { DEMO_QUESTIONS } from './demoQuestions';
import QuestionWithAIAnswer from './QuestionWithAIAnswer';

// Define types for our data
interface FormData {
  [key: string]: any;
}

interface AIAnswers {
  [key: string]: string;
}

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
      ? `${backendUrl}/parse-pdf-for-questions`  // ← FIXED: Use backendUrl here
      : `${backendUrl}/parse-audio-for-questions`; // ← FIXED: And here
    
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
      alert(`Upload failed: ${error}`); // ← Added alert for better error visibility
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
          Test how AI can extract answers from PDFs and audio recordings
        </Typography>

        {/* Upload Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Step 1: Upload Documents
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
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
              >
                Upload Audio
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
            
            {fileUploaded && (
              <Alert severity="success">
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