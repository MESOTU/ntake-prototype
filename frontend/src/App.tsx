import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { Button, Container, TextField, Box, Typography, Alert } from '@mui/material';
import DemoPage from './DemoPage';
import IntakePage from './IntakePage';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [extractedData, setExtractedData] = useState({
    patient_name: '',
    date_of_birth: '',
    primary_diagnosis: ''
  });
  const [patients, setPatients] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('File selected: ' + e.target.files[0].name);
      setError('');
      setExtractedData({
        patient_name: '',
        date_of_birth: '', 
        primary_diagnosis: ''
      });
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      setStatus('Audio file selected: ' + e.target.files[0].name);
      setError('');
      setExtractedData({
        patient_name: '',
        date_of_birth: '', 
        primary_diagnosis: ''
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setStatus('Uploading...');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://intake-prototype-backend.onrender.com'}/parse-pdf`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setStatus(data.message);
      setExtractedData(data.extracted_data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setStatus('');
    }
  };

  const handleAudioUpload = async () => {
    if (!audioFile) {
      setError('Please select an audio file first');
      return;
    }

    setStatus('Processing audio...');
    setError('');

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      console.log('Sending audio to backend...');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://intake-prototype-backend.onrender.com'}/parse-voice`, {
        method: 'POST',
        body: formData,
      });
      console.log('Audio response status:', response.status);
      const data = await response.json();
      console.log('Audio response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Audio processing failed');
      }

      setStatus(data.message);
      setExtractedData(data.extracted_data);
      
    } catch (err) {
      console.error('Audio upload error:', err);
      setError(err instanceof Error ? err.message : 'Audio processing failed');
      setStatus('');
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://intake-prototype-backend.onrender.com'}/patients`);
      const data = await response.json();
      if (data.status === 'success') {
        setPatients(data.patients);
      }
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  // Landing page component
  const LandingPage = () => (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Disability Care Intake Prototype
        </Typography>
        
        {/* DEMO BUTTON */}
        <Button 
          variant="outlined" 
          component={Link}
          to="/demo"
          fullWidth
          sx={{ mb: 1 }}
        >
          🧪 Try AI Demo (7 Questions)
        </Button>

        <Button 
          variant="contained" 
          component={Link}
          to="/intake"
          fullWidth
          sx={{ mb: 3 }} 
        >
          📋 Full Intake Form (33+ Questions)
        </Button>

        {/* PDF Upload Section */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            Select PDF File
            <input
              type="file"
              accept=".pdf"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            {file ? `Selected: ${file.name}` : 'No PDF file selected'}
          </Typography>
          
          <Button
            variant="outlined"
            onClick={handleUpload}
            fullWidth
            disabled={!file}
          >
            Upload and Parse PDF
          </Button>
        </Box>

        {/* Voice Upload Section */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #eee' }}>
          <Typography variant="h5" gutterBottom>
            Or Upload Voice Recording
          </Typography>
          
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            Select Audio File
            <input
              type="file"
              accept=".mp3,.wav,.m4a,.ogg,.mp4"
              hidden
              onChange={handleAudioFileChange}
            />
          </Button>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            {audioFile ? `Selected: ${audioFile.name}` : 'No audio file selected'}
          </Typography>
          
          <Button
            variant="outlined"
            onClick={handleAudioUpload}
            fullWidth
            disabled={!audioFile}
          >
            Process Audio Recording
          </Button>
        </Box>

        <Button 
          variant="outlined" 
          onClick={fetchPatients}
          fullWidth
          sx={{ mt: 3 }}
        >
          View Saved Patients
        </Button>

        {/* Status Messages */}
        {status && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {status}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Extracted Data Display */}
        {extractedData && extractedData.patient_name && (
          <Box sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Extracted Data:
            </Typography>
            <TextField
              fullWidth
              label="Patient Name"
              value={extractedData.patient_name}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Date of Birth" 
              value={extractedData.date_of_birth}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Primary Diagnosis"
              value={extractedData.primary_diagnosis}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </Box>
        )}

        {/* Patient List Section */}
        {patients.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Saved Patients ({patients.length})
            </Typography>
            {patients.map((patient) => (
              <Box key={patient.id} sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, mb: 1 }}>
                <Typography><strong>Name:</strong> {patient.patient_name}</Typography>
                <Typography><strong>DOB:</strong> {patient.date_of_birth}</Typography>
                <Typography><strong>Diagnosis:</strong> {patient.primary_diagnosis}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Added: {new Date(patient.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );

  return (
    <Routes>
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/intake" element={<IntakePage />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;