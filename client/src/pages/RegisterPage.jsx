import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Para navegação
import './RegisterPage.css'; // O CSS que vamos criar

function RegisterPage() {
  // Hook para navegação programática (ex: após submeter o formulário)
  const navigate = useNavigate();

  // Estado para guardar os dados do formulário
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    technician: '',
    service_type: ''
  });

  // Estado para a lista de checklist
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, value: 'Security Check', isChecked: false },
    { id: 2, value: 'Filter Cleaning', isChecked: false }
  ]);
  
  // Estado para o campo de texto do novo item do checklist
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // Função para lidar com mudanças nos inputs normais do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Função para lidar com a mudança de estado dos checkboxes
  const handleCheckboxChange = (id) => {
    setChecklistItems(
      checklistItems.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  // Função para adicionar um novo item ao checklist
  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim() === '') return; // Não adiciona item vazio
    const newItem = {
      id: Date.now(), // ID único baseado no tempo
      value: newChecklistItem,
      isChecked: false
    };
    setChecklistItems([...checklistItems, newItem]);
    setNewChecklistItem(''); // Limpa o input
  };
  
  // Função para lidar com a submissão do formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o recarregamento da página

    const finalData = {
      ...formData,
      checklist_items: checklistItems.filter(item => item.isChecked).map(item => item.value)
    };
    
    console.log('Dados a serem enviados para a API:', finalData);
    
    // TODO: Adicionar aqui a lógica para enviar 'finalData' para sua API com axios
    // Exemplo:
    // axios.post('/api/visits', finalData)
    //   .then(response => {
    //     console.log('Visita registrada!', response.data);
    //     navigate('/'); // Redireciona para a página inicial após o sucesso
    //   })
    //   .catch(error => console.error('Erro ao registrar visita:', error));
  };

  // Aqui está seu HTML convertido para JSX
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

export default RegisterPage;