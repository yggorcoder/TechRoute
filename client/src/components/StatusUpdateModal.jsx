import React, { useState } from 'react';
import './StatusUpdateModal.css';

const StatusUpdateModal = ({ visitId, onClose }) => {
    const [newStatus, setNewStatus] = useState('SCHEDULED');
    const [comment, setComment] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const isReschedule = newStatus === 'RESCHEDULED';
    const isCommentRequired = isReschedule || newStatus === 'CANCELLED';

    import { updateVisitStatus } from '../services/visitService';

// ... (rest of the component)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isCommentRequired && !comment.trim()) {
            alert('A comment is required for rescheduling or cancellations.');
            return;
        }
        if (isReschedule && (!newDate || !newTime)) {
            alert('New date and time are required for rescheduling.');
            return;
        }

        const payload = {
            new_status: newStatus,
            comment: comment,
        };

        if (isReschedule) {
            payload.new_date = newDate;
            payload.new_time = newTime;
        }

        try {
            await updateVisitStatus(visitId, payload);

            alert('Status updated successfully!');
            onClose();
        } catch (error) {
            console.error('Error updating status:', error);
            alert(error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Update Visit Status</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select id="status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="RESCHEDULED">Rescheduled</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    {isReschedule && (
                        <div className="reschedule-inputs">
                            <div className="form-group">
                                <label htmlFor="newDate">New Date</label>
                                <input type="date" id="newDate" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="newTime">New Time</label>
                                <input type="time" id="newTime" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
                            </div>
                        </div>
                    )}

                    {isCommentRequired && (
                        <div className="form-group">
                            <label htmlFor="comment">Comment {isReschedule ? '(Required)' : ''}</label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="3"
                                required
                            ></textarea>
                        </div>
                    )}
                    <div className="form-actions">
                        <button type="submit" className="btn-submit">Save</button>
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StatusUpdateModal;
