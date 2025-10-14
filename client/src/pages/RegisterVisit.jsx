import React, { useState } from 'react';
import { useAuth } from '../context/authContext'; 
import { Link, useNavigate } from 'react-router-dom'; // For navigation
import './RegisterPage.css'; // The CSS we will create

function RegisterVisit() {
  const { token } = useAuth();
  // Hook for programmatic navigation (e.g., after form submission)
  const navigate = useNavigate();

  // State to hold form data
  const [formData, setFormData] = useState({
    id: `visita_${Date.now()}`,
    date: '',
    time: '',
    location: '',
    technician: '',
    service_type: ''
  });

  // State for the checklist
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, value: 'Security Check', isChecked: false },
    { id: 2, value: 'Filter Cleaning', isChecked: false }
  ]);
  
  // State for the new checklist item text field
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // Handler for changes in normal form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Handler for checkbox state changes
  const handleCheckboxChange = (id) => {
    setChecklistItems(
      checklistItems.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  // Function to add a new item to the checklist
  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim() === '') return; // Don't add empty items
    const newItem = {
      id: Date.now(), // Unique ID based on timestamp
      value: newChecklistItem,
      isChecked: false
    };
    setChecklistItems([...checklistItems, newItem]);
    setNewChecklistItem(''); // Clear the input
  };
  
  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    const finalData = {
      ...formData,
      checklist_items: checklistItems.filter(item => item.isChecked).map(item => item.value)
    };
    
    try {
      const response = await fetch('http://127.0.0.1:8000/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to register visit.');
      }

      alert('Visit registered successfully!');
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      console.error('Error registering visit:', error);
      alert(error.message);
    }
  };

  // Here is your HTML converted to JSX
  return (
    <main className="py-5" style={{ marginTop: '60px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <Link to="/" className="navbar-brand fw-bold fs-3">
            <i className="bi bi-compass-fill me-2"></i> TechRoute
          </Link>
        </div>
        
        <h2 className="text-center mb-4">Register a New Visit</h2>
        
        <div id="message-container"></div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="date" className="form-label">Date</label>
              <input type="date" className="form-control" id="date" name="date" value={formData.date} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="time" className="form-label">Time</label>
              <input type="time" className="form-control" id="time" name="time" value={formData.time} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input type="text" className="form-control" id="location" name="location" value={formData.location} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="technician" className="form-label">Technician</label>
            <input type="text" className="form-control" id="technician" name="technician" value={formData.technician} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="service_type" className="form-label">Service Type</label>
            <input type="text" className="form-control" id="service_type" name="service_type" value={formData.service_type} onChange={handleInputChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Checklist Items:</label>
    
            <div className="input-group mb-3">
              <input 
                type="text" 
                className="form-control" 
                id="new-checklist-item-input" 
                placeholder="Add custom item"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
              />
              <button className="btn btn-secondary" type="button" onClick={handleAddChecklistItem}>Add</button>
            </div>

            <div id="checklist-container">
              {checklistItems.map(item => (
                <div className="form-check" key={item.id}>
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id={`item_${item.id}`}
                    checked={item.isChecked}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  <label className="form-check-label" htmlFor={`item_${item.id}`}>{item.value}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary btn-lg">Register Visit</button>
            <Link to="/" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default RegisterVisit;