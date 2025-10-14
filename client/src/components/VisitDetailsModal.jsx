import React from 'react';
import './VisitDetailsModal.css';

function VisitDetailsModal({ visit, onClose }) {
    if (!visit) return null;

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit', hour12: true 
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{visit.service_type}</h2>
                <p><strong>ID:</strong> {visit.id}</p>
                <p><strong>Technician:</strong> {visit.technician}</p>
                <p><strong>Location:</strong> {visit.location}</p>
                <p><strong>Date:</strong> {visit.date} at {visit.time}</p>
                <p><strong>Status:</strong> <span className={`status status-${visit.status.toLowerCase()}`}>{visit.status}</span></p>
                
                {visit.checklist_items && visit.checklist_items.length > 0 && (
                    <div className='checklist-display' style={{ marginTop: '15px'}}>
                        <strong>Checklist Items:</strong>
                        <ul>
                            {visit.checklist_items.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="notes-display">
                    <strong>Technician Notes:</strong>
                    {visit.notes && visit.notes.length > 0 ? (
                        <ul>
                            {visit.notes.slice().reverse().map((noteItem, index) => (
                                <li key={index}>
                                    <span>{formatTimestamp(noteItem.timestamp)}</span>
                                    <p>{noteItem.note}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No notes for this visit.</p>
                    )}
                </div>

                <div className="status-history">
                    <strong>Status History:</strong>
                    <ul>
                        {visit.status_history && visit.status_history.map((historyItem, index) => (
                            <li key={index}>
                                <span>{formatTimestamp(historyItem.timestamp)} - <strong>{historyItem.status}</strong></span>
                                {historyItem.comment && <p className="comment">- {historyItem.comment}</p>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default VisitDetailsModal;
