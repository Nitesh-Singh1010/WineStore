import React, { useState } from 'react'
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import './FileUpload.scss'

const FileUpload = () => {
  const [files, setFiles] = useState([])

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files)
    const filteredFiles = selectedFiles.filter(
      (file) => file.type === 'text/csv' || file.type === 'application/pdf'
    )
    const combinedFiles = [...files, ...filteredFiles].slice(0, 15)
    setFiles(combinedFiles)
  }

  const handleDeleteFile = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName))
  }

  const handleSubmit = () => {
    console.log('Sending files to backend:', files)
  }

  return (
    <div className="container">
      <Paper elevation={3} className="paper">
        <input
          accept=".csv, .pdf"
          multiple
          type="file"
          hidden
          id="file-upload"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            className="upload-button"
          >
            Upload Files
          </Button>
        </label>
        <Typography variant="body2" className="file-types-info">
          Only CSV and PDF files are accepted. Up to 15 files.
        </Typography>
        <List>
          {files.map((file, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteFile(file.name)}
                  className="delete-icon"
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
    </div>
  )
}

export default FileUpload
