import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { fetchAssets, uploadAssetFile } from '../../store/slices/assetSlice';

// Material UI components
import {
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  Container
} from '@mui/material';

// Material UI icons
import {
  CloudUpload,
  AttachFile,
  Delete
} from '@mui/icons-material';

// Define supported file formats for upload
const SUPPORTED_FORMATS = ['.csv', '.xlsx', '.pdf'];

function FileUpload() {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch assets on component mount
  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  // State management
  const [files, setFiles] = useState<File[]>([]); // Selected files for upload
  const [uploading, setUploading] = useState<boolean>(false); // Upload in progress state
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null); // Status message after upload attempt

  // Handle file selection from input
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);

      // Validate file formats
      const invalidFiles = newFiles.filter(file => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        return !SUPPORTED_FORMATS.includes(extension);
      });

      // Show error if invalid files are selected
      if (invalidFiles.length > 0) {
        setUploadStatus({
          success: false,
          message: `Unsupported file format(s): ${invalidFiles.map(f => f.name).join(', ')}. Supported: ${SUPPORTED_FORMATS.join(', ')}`
        });
        return;
      }

      // Add valid files to state
      setFiles(prev => [...prev, ...newFiles]);
      setUploadStatus(null);
    }
  };

  // Remove a file from the selection
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle file upload process
  const uploadFiles = async () => {
    if (files.length === 0) {
      setUploadStatus({
        success: false,
        message: 'Please select files to upload.',
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      // Currently only uploads the first file
      const fileToUpload = files[0];
      await dispatch(uploadAssetFile(fileToUpload)).unwrap();

      // Show success message
      setUploadStatus({
        success: true,
        message: `Successfully uploaded: ${fileToUpload.name}`,
      });

      // Clear file selection and refresh asset list
      setFiles([]);
      dispatch(fetchAssets());
    } catch (error) {
      // Handle upload errors
      let message = 'File upload failed. Please try again.';
      if (error instanceof Error) {
        message = error.message;
      }
      setUploadStatus({
        success: false,
        message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4} alignItems="center">
        {/* Page title */}
        <Typography variant="h4" align="center">
          File Upload
        </Typography>

        {/* Instructions text */}
        <Typography variant="body1" align="center">
          Upload your files below. Supported formats: CSV, XLSX, PDF.
        </Typography>

        {/* File drop area */}
        <Paper
          component="label"
          htmlFor="file-upload-input"
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 600,
            textAlign: 'center',
            border: '2px dashed #ccc',
            backgroundColor: '#fafafa',
            cursor: 'pointer'
          }}
        >
          {/* Hidden file input */}
          <input
            id="file-upload-input"
            type="file"
            multiple
            onChange={(e) => {
              handleFileSelect(e);
              e.target.value = ''; // Reset input value to allow selecting the same file again
            }}
            style={{ display: 'none' }}
            accept={SUPPORTED_FORMATS.join(',')}
          />
          <CloudUpload sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag and drop files here or click to select
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported formats: {SUPPORTED_FORMATS.join(', ')}
          </Typography>
        </Paper>

        {/* Status alert for success/error messages */}
        {uploadStatus && (
          <Alert
            severity={uploadStatus.success ? 'success' : 'error'}
            onClose={() => setUploadStatus(null)}
            sx={{ width: '100%', maxWidth: 600 }}
          >
            {uploadStatus.message}
          </Alert>
        )}

        {/* Selected files list */}
        {files.length > 0 && (
          <Paper sx={{ width: '100%', maxWidth: 600 }}>
            <List>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removeFile(index)}>
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <AttachFile />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(2)} KB`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Upload button */}
        <Button
          variant="contained"
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
          onClick={uploadFiles}
          disabled={files.length === 0 || uploading}
          fullWidth
          sx={{ maxWidth: 600 }}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </Stack>
    </Container>
  );
}

export default FileUpload;
