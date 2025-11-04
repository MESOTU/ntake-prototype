// QuestionWithAIAnswer.tsx - UPDATED FOR ALL QUESTION TYPES
import { 
  Box, Typography, Radio, RadioGroup, FormControlLabel, 
  FormControl, Alert, Button, TextField, Slider,
  Checkbox, FormGroup
} from '@mui/material';

interface Question {
  id: string;
  section: string;
  type: string;
  question_text: string;
  options?: string[];
  scale_range?: { min: number; max: number; step?: number };
  data_path: string;
  ai_extractable: boolean;
  branching_logic?: { [key: string]: string | undefined };
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
      
      case 'multiple_choice':
        return (
          <FormGroup>
            {question.options?.map(option => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox 
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const newValue = Array.isArray(value) ? [...value] : [];
                      if (e.target.checked) {
                        newValue.push(option);
                      } else {
                        const index = newValue.indexOf(option);
                        if (index > -1) newValue.splice(index, 1);
                      }
                      onChange(newValue);
                    }}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
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
            multiline
            rows={3}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer..."
          />
        );
      
      case 'date':
        return (
          <TextField
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        );
      
      case 'number':
        return (
          <TextField
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter number..."
            fullWidth
          />
        );
      
      case 'heading':
        return (
          <Typography 
            variant="h5" 
            color="primary" 
            sx={{ 
              mt: 3, 
              mb: 2, 
              pb: 1, 
              borderBottom: '2px solid',
              borderColor: 'primary.main'
            }}
          >
            {question.question_text}
          </Typography>
        );
      
      default:
        return (
          <Typography color="error">
            Unknown question type: {question.type}
          </Typography>
        );
    }
  };

  // For heading questions, just return the heading without input or AI
  if (question.type === 'heading') {
    return renderInput();
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {question.question_text}
      </Typography>
      
      {/* AI Answer Suggestion */}
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