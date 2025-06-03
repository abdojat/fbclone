// /src/hooks/useConfirm.js
import { useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';

/**
 * Custom hook: returns `askConfirm(options)` function and `ConfirmDialog` element.
 * - `askConfirm({ title, content })` returns a promise that resolves to true/false.
 * - You can then await that in your event handlers.
 */
export function useConfirm() {
    const [state, setState] = useState({
        open: false,
        title: '',
        content: '',
        resolve: null,
    });

    const askConfirm = ({ title, content }) => {
        return new Promise((resolve) => {
            setState({ open: true, title, content, resolve });
        });
    };

    const handleClose = (answer) => {
        if (state.resolve) state.resolve(answer);
        setState({ open: false, title: '', content: '', resolve: null });
    };

    const ConfirmDialogElement = (
        <ConfirmDialog
            open={state.open}
            title={state.title}
            content={state.content}
            onClose={handleClose}
        />
    );

    return { askConfirm, ConfirmDialogElement };
}
