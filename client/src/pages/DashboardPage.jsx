import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatusUpdateModal from '../components/StatusUpdateModal';
import NotesModal from '../components/NotesModal';
import './DashboardPage.css';

function DashboardPage() {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedVisitId, setSelectedVisitId] = useState(null);

    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [selectedVisitForNotes, setSelectedVisitForNotes] = useState(null);

    const [expandedNotesVisitId, setExpandedNotesVisitId] = useState(null);

    const fetchVisits = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/visits');
            if (!response.ok) {
                throw new Error('Failed to fetch visits.');
            }
            const data = await response.json();
            setVisits(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const handleOpenStatusModal = (visitId) => {
        setSelectedVisitId(visitId);
        setIsStatusModalOpen(true);
    };

    const handleCloseStatusModal = () => {
        setIsStatusModalOpen(false);
        setSelectedVisitId(null);
        fetchVisits();
    };

    const handleOpenNotesModal = (visit) => {
        setSelectedVisitForNotes(visit);
        setIsNotesModalOpen(true);
    };

    const handleCloseNotesModal = () => {
        setIsNotesModalOpen(false);
        setSelectedVisitForNotes(null);
        fetchVisits();
    };

    const toggleNotesExpansion = (visitId) => {
        setExpandedNotesVisitId(prevId => (prevId === visitId ? null : visitId));
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit', hour12: true 
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <Header />
            <main className="dashboard-container">
                <h1>Visits Dashboard</h1>
                <div className="visits-list">
                    {visits.map((visit) => {
                        const isNotesExpanded = expandedNotesVisitId === visit.id;
                        const latestNote = visit.notes && visit.notes.length > 0 ? visit.notes[visit.notes.length - 1] : null;

                        return (
                            <div key={visit.id} className="visit-card">
                                <h3>{visit.service_type}</h3>
                                <p><strong>Location:</strong> {visit.location}</p>
                                <p><strong>Technician:</strong> {visit.technician}</p>
                                <p><strong>Date:</strong> {visit.date}</p>
                                <p><strong>Current Status:</strong> <span className={`status status-${visit.status.toLowerCase()}`}>{visit.status}</span></p>
                                
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
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
            {isStatusModalOpen && (
                <StatusUpdateModal
                    visitId={selectedVisitId}
                    onClose={handleCloseStatusModal}
                />
            )}
            {isNotesModalOpen && (
                <NotesModal
                    visit={selectedVisitForNotes}
                    onClose={handleCloseNotesModal}
                />
            )}
            <Footer />
        </>
    );
}

export default DashboardPage;
