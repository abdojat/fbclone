// /src/components/ConfirmDialog.js


import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

/**
 * Props:
 * - open: boolean
 * - title: string
 * - content: string
 * - onClose(answer: boolean)
 */
const ConfirmDialog = ({ open, title, content, onClose }) => {
    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => onClose(true)} color="secondary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmDialog;
