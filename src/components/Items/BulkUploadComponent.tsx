import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const BulkUploadComponent = () => {
  const [files, setFiles] = useState([])

  const onDrop = (acceptedFiles) => {
    const combinedFiles = [...files, ...acceptedFiles].slice(0, 15)
    setFiles(combinedFiles)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
    },
  })

  const handleDeleteFile = (filePath) => {
    setFiles(files.filter((file) => file.path !== filePath))
  }
  const handleSubmit = () => {
    // Sending files to backend
    console.log('Sending files to backend:', files)
    // we can use fetch or axios to send files to your backend here
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        marginTop: '2rem',
      }}
    >
      <Paper
        elevation={3}
        {...getRootProps()}
        style={{
          width: '50%',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <p>Only CSV and PDF files are accepted. Up to 15 files.</p>
        <List>
          {files.map((file, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteFile(file.path)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={files.length === 0}
        style={{ marginTop: '2rem' }}
      >
        Submit
      </Button>
    </div>
  )
}

export default BulkUploadComponent
