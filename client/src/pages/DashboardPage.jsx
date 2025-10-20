import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatusUpdateModal from '../components/StatusUpdateModal';
import NotesModal from '../components/NotesModal';
import WeeklyDashboard from '../components/WeeklyDashboard';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableVisitCard } from '../components/SortableVisitCard';
import './DashboardPage.css';
import { useAuth } from '../context/authContext';
import { fetchVisits as fetchVisitsApi } from '../services/visitService';

// Define a logical order for statuses
const statusOrder = {
    SCHEDULED: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
    RESCHEDULED: 4,
    CANCELLED: 5,
};

function DashboardPage() {
    const {token} = useAuth();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [visitFilters, setVisitFilters] = useState({ technicians: [], statuses: [] });
    const [sortOrder, setSortOrder] = useState('default');
    const [allTechnicians, setAllTechnicians] = useState([]);
    const [allStatuses, setAllStatuses] = useState([]);

    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedVisitId, setSelectedVisitId] = useState(null);

    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [selectedVisitForNotes, setSelectedVisitForNotes] = useState(null);

    const [expandedNotesVisitId, setExpandedNotesVisitId] = useState(null);

    const fetchVisits = async () => {
        try {
            const data = await fetchVisitsApi();
            setVisits(data);
            setAllTechnicians([...new Set(data.map(v => v.technician))]);
            setAllStatuses([...new Set(data.map(v => v.status))].sort((a, b) => statusOrder[a] - statusOrder[b]));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    useEffect(() => {
        if (sortOrder === 'default') return;
        const sortedVisits = [...visits];
        if (sortOrder === 'date') {
            sortedVisits.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortOrder === 'status') {
            sortedVisits.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        }
        setVisits(sortedVisits);
    }, [sortOrder]);

    const displayedVisits = useMemo(() => {
        return visits.filter(visit => {
            const techMatch = visitFilters.technicians.length === 0 || visitFilters.technicians.includes(visit.technician);
            const statusMatch = visitFilters.statuses.length === 0 || visitFilters.statuses.includes(visit.status);
            return techMatch && statusMatch;
        });
    }, [visits, visitFilters]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setVisits((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                if (oldIndex === -1 || newIndex === -1) return items;
                return arrayMove(items, oldIndex, newIndex);
            });
            setSortOrder('default');
        }
    };

    const handleFilterChange = (filterName, value) => {
        setVisitFilters(prev => {
            const currentValues = prev[filterName];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value)
                : [...currentValues, value];
            return { ...prev, [filterName]: newValues };
        });
    };

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
                <WeeklyDashboard allTechnicians={allTechnicians} allStatuses={allStatuses} />
                <div className="visits-dashboard-header">
                    <h1>Visits Dashboard</h1>
                    <div className="dashboard-controls">
                        <div className="filter-group">
                            <label>Filter by Technician</label>
                            <div className="checkbox-group">
                                {allTechnicians.map(tech => (
                                    <div key={tech} className="checkbox-item">
                                        <input type="checkbox" id={`tech-${tech}`} value={tech} checked={visitFilters.technicians.includes(tech)} onChange={() => handleFilterChange('technicians', tech)} />
                                        <label htmlFor={`tech-${tech}`}>{tech}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Filter by Status</label>
                            <div className="checkbox-group">
                                {allStatuses.map(status => (
                                    <div key={status} className="checkbox-item">
                                        <input type="checkbox" id={`status-${status}`} value={status} checked={visitFilters.statuses.includes(status)} onChange={() => handleFilterChange('statuses', status)} />
                                        <label htmlFor={`status-${status}`}>{status}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Sort by</label>
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="default">Manual Order</option>
                                <option value="date">Date</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                    </div>
                </div>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={displayedVisits.map(v => v.id)} strategy={horizontalListSortingStrategy}>
                        <div className="visits-list">
                            {displayedVisits.map((visit) => (
                                <SortableVisitCard
                                    key={visit.id}
                                    visit={visit}
                                    formatTimestamp={formatTimestamp}
                                    toggleNotesExpansion={toggleNotesExpansion}
                                    expandedNotesVisitId={expandedNotesVisitId}
                                    handleOpenStatusModal={handleOpenStatusModal}
                                    handleOpenNotesModal={handleOpenNotesModal}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
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
