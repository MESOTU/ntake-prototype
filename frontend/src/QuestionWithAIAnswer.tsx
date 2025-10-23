// QuestionWithAIAnswer.tsx
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Alert, Button, TextField, Slider } from '@mui/material';

interface Question {
  id: string;
  section: string;
  type: string;
  question_text: string;
  options?: string[];
  scale_range?: { min: number; max: number; step?: number };
  data_path: string;
  ai_extractable: boolean;
}

interface QuestionWithAIAnswerProps {
  question: Question;
  value: any;
  aiAnswer: string;
  onChange: (value: any) => void;
}

const QuestionWithAIAnswer = ({ question, value, aiAnswer, onChange }: QuestionWithAIAnswerProps) => {
  const hasAIAnswer = aiAnswer && aiAnswer !== 'Unknown';
  const isUsingAIAnswer = value === aiAnswer;

  const renderInput = () => {
    switch (question.type) {
      case 'single_choice':
        return (
          <FormControl component="fieldset">
            <RadioGroup value={value || ''} onChange={(e) => onChange(e.target.value)}>
              {question.options?.map(option => (
                <FormControlLabel 
                  key={option} 
                  value={option} 
                  control={<Radio />} 
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      
      case 'scale':
        const scaleRange = question.scale_range || { min: 0, max: 10, step: 1 };
        return (
          <Box sx={{ width: '100%', px: 2 }}>
            <Slider
              value={value || scaleRange.min}
              onChange={(_, newValue) => onChange(newValue)}
              min={scaleRange.min}
              max={scaleRange.max}
              step={scaleRange.step || 1}
              valueLabelDisplay="auto"
            />
          </Box>
        );
      
      case 'text':
        return (
          <TextField
            fullWidth
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer..."
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {question.question_text}
      </Typography>
      
      {/* AI Answer Suggestion - Show even if currently using it */}
      {hasAIAnswer && (
        <Alert 
          severity={isUsingAIAnswer ? "success" : "info"}
          action={
            !isUsingAIAnswer && (
              <Button 
                color="inherit" 
                size="small"
                onClick={() => onChange(aiAnswer)}
              >
                Use AI Answer
              </Button>
            )
          }
          sx={{ mb: 2 }}
        >
          {isUsingAIAnswer ? (
            <>✓ Using AI answer: <strong>{aiAnswer}</strong></>
          ) : (
            <>AI detected: <strong>{aiAnswer}</strong></>
          )}
        </Alert>
      )}
      
      {renderInput()}
    </Box>
  );
};

export default QuestionWithAIAnswer;