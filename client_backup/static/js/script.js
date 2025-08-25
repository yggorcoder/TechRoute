// Aguarda o DOM ser totalmente carregado antes de anexar o listener
document.addEventListener('DOMContentLoaded', () => {
    console.log("Script.js loaded successfully!");

    // --- SELEÇÃO DE ELEMENTOS ---
    const form = document.getElementById('form-visit');
    const messageContainer = document.getElementById('message-container');
    const addItemBtn = document.getElementById('add-checklist-item-btn');
    const newItemInput = document.getElementById('new-checklist-item-input');
    const checklistContainer = document.getElementById('checklist-container');

    // --- LÓGICA DO CHECKLIST DINÂMICO ---
    // CORREÇÃO 2: Removido o aninhamento desnecessário do listener.
    if (addItemBtn && newItemInput && checklistContainer) {
        addItemBtn.addEventListener('click', () => {
            const itemText = newItemInput.value.trim();
            if (itemText === "") {
                alert("Please enter the item name.");
                return;
            }
            const itemId = `custom-item-${Date.now()}`;
            const newCheckboxHtml = `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="checklist_item" value="${itemText}" id="${itemId}">
                    <label class="form-check-label" for="${itemId}">${itemText}</label>
                </div>
            `;
            checklistContainer.insertAdjacentHTML('beforeend', newCheckboxHtml);
            newItemInput.value = "";
            newItemInput.focus();
        });
        newItemInput.addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                // Avoid form submission now
                event.preventDefault();
                addItemBtn.click();
            }
        });

    } else {
        console.error("ERROR: One or more dynamic checklist elements were not found. Check the IDs in the HTML.");
    }

    // --- LÓGICA DE SUBMISSÃO DO FORMULÁRIO ---
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (messageContainer) messageContainer.innerHTML = '';
            const formData = new FormData(form);
            const dataForm = Object.fromEntries(formData.entries());
            const checkedItems = document.querySelectorAll('input[name="checklist_item"]:checked');
            const selectedItems = Array.from(checkedItems).map(item => item.value);
            
            const payload = {
                date: dataForm.date, // (ex: "2025-08-22")
                time: dataForm.time, // (ex: "18:30")
                location: dataForm.location,
                technician: dataForm.technician,
                service_type: dataForm.service_type,
                checklist_items: selectedItems 
            };
            
            try {
                const response = await fetch('http://localhost:8000/visits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                if (response.ok) {
                    if (messageContainer) {
                        messageContainer.innerHTML = `<div class="alert alert-success">${result.message || 'Visit registered successfully!'}</div>`;
                    } else {
                        alert(result.message || 'Visit registered successfully!');
                    }
                    form.reset();
                } else {
                    throw new Error(result.detail || 'Failed to register visit.');
                }
            } catch (error) {
                if (messageContainer) {
                    messageContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
                } else {
                    alert(`An error occurred: ${error.message}`);
                }
            }
        });
    }

// CORREÇÃO 1: A chave de fechamento do DOMContentLoaded foi movida para o final do arquivo.
});