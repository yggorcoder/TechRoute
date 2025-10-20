import React, { useState } from 'react';
import './StatusUpdateModal.css'; // Reusing the same CSS for modals

const NotesModal = ({ visit, onClose }) => {
    const [notes, setNotes] = useState('');

    import { addNoteToVisit } from '../services/visitService';

// ... (rest of the component)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!notes.trim()) {
            alert('Notes cannot be empty.');
            return;
        }

        const payload = {
            visita_id: visit.id,
            observacoes_tecnico: notes,
        };

        try {
            await addNoteToVisit(visit.id, payload);

            alert('New note added successfully!');
            onClose();
        } catch (error) {
            console.error('Error saving notes:', error);
            alert(error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Post-Visit Note</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="notes">Technician Note</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="8"
                            placeholder="Enter your new observation..."
                        ></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-submit">Add Note</button>
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotesModal;
