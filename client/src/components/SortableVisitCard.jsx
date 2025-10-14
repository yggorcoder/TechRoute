import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { VisitPDF } from './VisitPDF';

export function SortableVisitCard({ visit, formatTimestamp, toggleNotesExpansion, expandedNotesVisitId, handleOpenStatusModal, handleOpenNotesModal }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: visit.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isNotesExpanded = expandedNotesVisitId === visit.id;
    const latestNote = visit.notes && visit.notes.length > 0 ? visit.notes[visit.notes.length - 1] : null;

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="visit-card">
            <div className="visit-card-header">
                <h3>{visit.service_type}</h3>
                <div className="drag-handle" {...listeners}>&#x2630;</div>
            </div>
            <div className="visit-card-body">
                <p><strong>Location:</strong> {visit.location}</p>
                <p><strong>Technician:</strong> {visit.technician}</p>
                <p><strong>Date:</strong> {visit.date}</p>
                <p><strong>Current Status:</strong> <span className={`status status-${visit.status.toLowerCase()}`}>{visit.status}</span></p>

                {visit.checklist_items && visit.checklist_items.length > 0 && (
                    <div className='checklist-display'>
                        <strong>Checklist Items:</strong>
                        <ul>
                            {visit.checklist_items.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
                         
                {visit.notes && visit.notes.length > 0 && (
                    <div className="notes-display expandable" onClick={() => toggleNotesExpansion(visit.id)}>
                        <strong>Technician Notes {visit.notes.length > 1 ? `(Click to ${isNotesExpanded ? 'collapse' : 'expand'})` : ''}</strong>
                        {isNotesExpanded ? (
                            <ul>
                                {visit.notes.slice().reverse().map((noteItem, index) => (
                                    <li key={index}>
                                        <span>{formatTimestamp(noteItem.timestamp)}</span>
                                        <p>{noteItem.note}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>{latestNote.note}</p>
                        )}
                    </div>
                )}

                <div className="status-history">
                    <strong>History:</strong>
                    <ul>
                        {visit.status_history && visit.status_history.map((historyItem, index) => (
                            <li key={index}>
                                <span>{formatTimestamp(historyItem.timestamp)} - <strong>{historyItem.status}</strong></span>
                                {historyItem.comment && <p className="comment">- {historyItem.comment}</p>}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card-actions">
                    <button onClick={() => handleOpenStatusModal(visit.id)}>
                        Update Status
                    </button>
                    <button 
                        onClick={() => handleOpenNotesModal(visit)}
                        disabled={!['IN_PROGRESS', 'COMPLETED'].includes(visit.status)}
                    >
                        Add/Edit Notes
                    </button>
                    {visit.status === 'COMPLETED' && (
                        <PDFDownloadLink document={<VisitPDF visit={visit} />} fileName={`visit-report-${visit.id}.pdf`}>
                            {({ loading }) => 
                                <button>{loading ? 'Generating...' : 'Generate PDF'}</button>
                            }
                        </PDFDownloadLink>
                    )}
                </div>
            </div>
        </div>
    );
}
