import React, { useState, useContext } from 'react'
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
import './BulkUploadComponent.scss'
import { AppLangContext, AppStateContext, IAppStateContext } from '@Contexts'

const BulkUploadComponent = () => {
  const { appConfig } = useContext<IAppStateContext>(AppStateContext)
  const { appLang } = useContext(AppLangContext)
  const [fileItems, setFileItems] = useState([])

  const handleFileChange = (event) => {
    handleFilesChange(event.target.files)
  }

  const handleDeleteFile = (fileName) => {
    setFileItems(fileItems.filter((fileItem) => fileItem.label !== fileName))
  }

  const handleSubmit = () => {
    console.log('Sending files to backend:', fileItems)
  }

  const handleFilesChange = (files) => {
    const oldFileLabels = fileItems.map((fileItem) => fileItem.label)
    const newFileItems = []
    let errorOccurred = false

    for (const file of files) {
      const fileExtension = file.name.split('.').pop()
      const allowedExtensions =
        appConfig['feature.fileUpload.allowedFileFormat.names']
      const maxFileSizeInMB =
        appConfig['feature.fileUpload.allowedFilesCount.max']

      if (!allowedExtensions.includes(`.${fileExtension.toLowerCase()}`)) {
        errorOccurred = true
        //  error handling and showing message for invalid file type
        continue
      }

      if (file.size > maxFileSizeInMB * 1024 * 1024) {
        errorOccurred = true
        // error handling and showing message for exceeding file size limit
        continue
      }

      if (oldFileLabels.includes(file.name)) {
        errorOccurred = true
        //  error handling and showing message for duplicate file name
        continue
      }

      if (
        fileItems.length >=
        appConfig['feature.fileUpload.allowedFilesCount.max']
      ) {
        errorOccurred = true
        //  error handling and showing message for exceeding file count limit
        continue
      }

      if (!errorOccurred) {
        newFileItems.push({
          name: file.name,
          nativeFile: file,
          label: file.name,
          type: file.type,
          status: 'completed',
        })
      }
    }

    setFileItems([...newFileItems, ...fileItems])
  }

  return (
    <>
      <div className="container">
        <Paper elevation={3} className="paper">
          <input
            accept={appConfig['feature.fileUpload.allowedFileFormat.names']}
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
              {appLang['feature.common.templates.uploadFiles.txt']}
            </Button>
          </label>
          <Typography variant="body2" className="file-types-info">
            {appLang['feature.common.templates.uploadFileInstructions.txt']}
          </Typography>
          <List>
            {fileItems.map((fileItem) => (
              <ListItem
                key={fileItem.name}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteFile(fileItem.label)}
                    className="delete-icon"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={fileItem.label} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={fileItems.length === 0}
        className="submit-button"
      >
        {appLang['feature.common.templates.popups.general.save.button']}
      </Button>
    </>
  )
}

export default BulkUploadComponent
