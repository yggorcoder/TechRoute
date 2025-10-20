import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import './WeeklyDashboard.css';
import VisitDetailsModal from './VisitDetailsModal'; // Assuming this modal will be created
import { fetchDashboardVisits } from '../services/visitService';

function WeeklyDashboard({ allTechnicians, allStatuses }) {
    const { token } = useAuth();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        technicians: [],
        statuses: [],
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);


    // Fetch filtered visits when filters change
    useEffect(() => {
        const fetchVisits = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                filters.technicians.forEach(t => params.append('technicians', t));
                filters.statuses.forEach(s => params.append('statuses', s));

                const today = new Date();
                const futureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
                params.append('start_date', today.toISOString().split('T')[0]);
                params.append('end_date', futureDate.toISOString().split('T')[0]);

                const data = await fetchDashboardVisits(params);
                setVisits(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchVisits();
    }, [filters, token]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => {
            const currentValues = prevFilters[filterName];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value)
                : [...currentValues, value];
            return { ...prevFilters, [filterName]: newValues };
        });
    };

    const handleVisitClick = (visit) => {
        setSelectedVisit(visit);
        setIsModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SCHEDULED': return '#3a86ff';
            case 'IN_PROGRESS': return '#ffbe0b';
            case 'COMPLETED': return '#5cb85c';
            case 'CANCELLED': return '#d9534f';
            case 'RESCHEDULED': return '#f0ad4e';
            default: return '#8d99ae';
        }
    };

    const renderCalendar = () => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
            days.push(day);
        }

        const visitsByDate = visits.reduce((acc, visit) => {
            const date = visit.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(visit);
            return acc;
        }, {});

        return (
            <div className="calendar-grid">
                {days.map(day => {
                    const dayString = day.toISOString().split('T')[0];
                    const dayVisits = visitsByDate[dayString] || [];
                    return (
                        <div key={dayString} className="calendar-day">
                            <div className="day-header">
                                {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </div>
                            <div className="day-body">
                                {dayVisits.map(visit => (
                                    <div 
                                        key={visit.id} 
                                        className="visit-event" 
                                        style={{ borderLeft: `5px solid ${getStatusColor(visit.status)}` }}
                                        onClick={() => handleVisitClick(visit)}
                                    >
                                        <p><strong>{visit.service_type}</strong></p>
                                        <p>{visit.technician}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="weekly-dashboard">
            <h1>Weekly Dashboard</h1>
            <div className="filters">
                <div className="filter-group">
                    <label>Filter by Technician</label>
                    <div className="checkbox-group">
                        {allTechnicians.map(tech => (
                            <div key={tech} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`tech-${tech}`}
                                    value={tech}
                                    checked={filters.technicians.includes(tech)}
                                    onChange={() => handleFilterChange('technicians', tech)}
                                />
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
                                <input
                                    type="checkbox"
                                    id={`status-${status}`}
                                    value={status}
                                    checked={filters.statuses.includes(status)}
                                    onChange={() => handleFilterChange('statuses', status)}
                                />
                                <label htmlFor={`status-${status}`}>{status}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && renderCalendar()}
            {isModalOpen && <VisitDetailsModal visit={selectedVisit} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}

export default WeeklyDashboard;