import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import React from 'react'

function Modal({title,content,btnAgree,btnDisagree,agreeFn,disagreeFn,loading}) {
  return (
 <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions >
           {
            loading ?    <Button >
            please wait...
          </Button> : <div>   <Button onClick={disagreeFn} autoFocus >
            {btnDisagree}
          </Button>
          <Button autoFocus  color="error"  onClick={agreeFn}>
            {btnAgree}
          </Button></div>
           }
        
        </DialogActions>
      </Dialog>
  )
}

export default Modal