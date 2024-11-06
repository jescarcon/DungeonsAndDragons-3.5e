import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_API_URL } from '../../../../constants';
import Añadir from "/Common/añadir_negro.png";
import Entrada from "/Character/Diary/Entrada.jpg";
import './DiaryEntry.css';

export default function DiaryEntry() {
  const { id } = useParams();
  const [entries, setEntries] = useState([]);
  const [diaryName, setDiaryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: '',
    description: '',
    image1: null,
    image2: null,
    image3: null,
  });
  const [editingEntry, setEditingEntry] = useState({
    id: null,
    name: '',
    description: '',
    image1: null,
    image2: null,
    image3: null,
    imagePreview1: null,
    imagePreview2: null,
    imagePreview3: null
  });
  const [contextMenu, setContextMenu] = useState(null);

  const entriesPerPage = 5;

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}api/characterApp/diaryentries/`);
        const data = await response.json();
        
        const filteredEntries = data.filter(entry => entry.diary === parseInt(id));
        setEntries(filteredEntries);
        
        const diaryResponse = await fetch(`${BASE_API_URL}api/characterApp/diaries/${id}/`);
        const diaryData = await diaryResponse.json();
        setDiaryName(diaryData.name);
        
      } catch (error) {
        console.error('Error fetching diary entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [id]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(entries.length / entriesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewEntry({ ...newEntry, [name]: files[0] });
  };

  const handleCreateEntry = async () => {
    const formData = new FormData();
    formData.append('name', newEntry.name);
    formData.append('description', newEntry.description);
    formData.append('diary', id);
  
    if (newEntry.image1) formData.append('image1', newEntry.image1);
    if (newEntry.image2) formData.append('image2', newEntry.image2);
    if (newEntry.image3) formData.append('image3', newEntry.image3);
  
    try {
      const response = await fetch(`${BASE_API_URL}api/characterApp/diaryentries/`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const createdEntry = await response.json();
        setEntries([createdEntry, ...entries]);
        setNewEntry({
          name: '',
          description: '',
          image1: null,
          image2: null,
          image3: null,
        });
        setShowModal(false);
      } else {
        console.error('Error creating entry:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };
  

  const handleDeleteEntry = async (entryId) => {
    try {
      const response = await fetch(`${BASE_API_URL}api/characterApp/diaryentries/${entryId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEntries(entries.filter(entry => entry.id !== entryId));
        setContextMenu(null);
      } else {
        const errorText = await response.text();
        console.error('Error deleting entry:', errorText);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleUpdateEntry = async () => {
    const formData = new FormData();
    formData.append('name', editingEntry.name);
    formData.append('description', editingEntry.description);
  
    if (editingEntry.image1) formData.append('image1', editingEntry.image1);
    if (editingEntry.image2) formData.append('image2', editingEntry.image2);
    if (editingEntry.image3) formData.append('image3', editingEntry.image3);
  
    try {
      const response = await fetch(`${BASE_API_URL}/api/characterApp/diaryentries/${editingEntry.id}/`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar la entrada');
      }
  
      const updatedEntry = await response.json();
      setEntries(prevEntries =>
        prevEntries.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
      );
    } catch (error) {
      console.error('Error al actualizar la entrada:', error);
    } finally {
      setShowEditModal(false);
      setEditingEntry(null);
    }
  };
  
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const fileURL = URL.createObjectURL(files[0]);
      setEditingEntry(prevState => ({
        ...prevState,
        [name]: files[0],
        [`imagePreview${name.charAt(name.length - 1)}`]: fileURL
      }));
    }
  };
  
  const handleImageDelete = (imageKey) => {
    setEditingEntry(prevState => ({
      ...prevState,
      [imageKey]: null,
      [`imagePreview${imageKey.charAt(imageKey.length - 1)}`]: null
    }));
  };
  
  


  const handleContextMenu = (e, entry) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, entry });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEntry({
      name: '',
      description: '',
      image1: null,
      image2: null,
      image3: null,
    });
  };


  
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingEntry(null);
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="diary-entry-container">
      <div className="diary-entry-header">
        <h1>{diaryName}</h1>
        <button className="diary-entry-add-button" onClick={() => setShowModal(true)}>
          <img src={Añadir} alt="Añadir" />
        </button>
      </div>

      <div className="diary-entry-entries">
        {currentEntries.length > 0 ? (
          currentEntries.map(entry => (
            <div key={entry.id} className="diary-entry" onContextMenu={(e) => handleContextMenu(e, entry)}>
              <img src={Entrada} alt="Entrada" className="entry-image" />
              <h2 className="entry-title">{entry.name}</h2>
            </div>
          ))
        ) : (
          <p>No hay entradas para el diario aún.</p>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-button"
          >
            &laquo; Anterior
          </button>
          <span className="current-page">{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            Siguiente &raquo;
          </button>
        </div>
      )}

      {/* Modal para crear una nueva entrada */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h2>Nueva Entrada</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateEntry(); }} className="modal-form">
              <label>
                Nombre:
                <input
                  type="text"
                  name="name"
                  value={newEntry.name}
                  onChange={handleInputChange}
                  required
                  maxLength={30}
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="description"
                  value={newEntry.description}
                  onChange={handleInputChange}
                  maxLength={500}
                />
              </label>

              {/* Campos para subir imágenes */}
              <label>
                Imagen 1:
                <input
                  type="file"
                  name="image1"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {newEntry.image1 && (
                  <div>
                    <img src={URL.createObjectURL(newEntry.image1)} alt="Vista previa" className="image-preview" />
                  </div>
                )}
              </label>
              <label>
                Imagen 2:
                <input
                  type="file"
                  name="image2"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {newEntry.image2 && (
                  <div>
                    <img src={URL.createObjectURL(newEntry.image2)} alt="Vista previa" className="image-preview" />
                  </div>
                )}
              </label>
              <label>
                Imagen 3:
                <input
                  type="file"
                  name="image3"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {newEntry.image3 && (
                  <div>
                    <img src={URL.createObjectURL(newEntry.image3)} alt="Vista previa" className="image-preview" />
                  </div>
                )}
              </label>


              <div className="modal-buttons">
                <button type="submit">Crear</button>
                <button type="button" onClick={handleCloseModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar una entrada */}
      {showEditModal && editingEntry && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={handleCloseEditModal}>×</button>
            <h2>Editar Entrada</h2>
            <form className="modal-form">
              <label>
                Nombre:
                <input
                  type="text"
                  name="name"
                  value={editingEntry.name}
                  onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })}
                  required
                  maxLength={30}
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="description"
                  value={editingEntry.description}
                  onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })}
                  maxLength={500}
                />
              </label>

              {/* Campos para subir imágenes */}
              <label>
                Imagen 1:
                <input
                  type="file"
                  name="image1"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {editingEntry.imagePreview1 && (
                  <div>
                    <img src={editingEntry.imagePreview1} alt="Vista previa" className="image-preview" />
                    <button type="button" onClick={() => handleImageDelete('image1')}>Eliminar Imagen</button>
                  </div>
                )}
              </label>
              <label>
                Imagen 2:
                <input
                  type="file"
                  name="image2"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {editingEntry.imagePreview2 && (
                  <div>
                    <img src={editingEntry.imagePreview2} alt="Vista previa" className="image-preview" />
                    <button type="button" onClick={() => handleImageDelete('image2')}>Eliminar Imagen</button>
                  </div>
                )}
              </label>
              <label>
                Imagen 3:
                <input
                  type="file"
                  name="image3"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {editingEntry.imagePreview3 && (
                  <div>
                    <img src={editingEntry.imagePreview3} alt="Vista previa" className="image-preview" />
                    <button type="button" onClick={() => handleImageDelete('image3')}>Eliminar Imagen</button>
                  </div>
                )}
              </label>

              <div className="modal-buttons">
                <button type="submit" onClick={handleUpdateEntry}>Guardar Cambios</button>
                <button type="button" onClick={handleCloseEditModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menú contextual para eliminar una entrada */}
      {contextMenu && (
        <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button onClick={() => { openEditModal(contextMenu.entry); setContextMenu(null); }}>Editar</button>
          <button onClick={() => { handleDeleteEntry(contextMenu.entry.id); setContextMenu(null); }}>Eliminar</button>
        </div>
      )}
    </div>
  );
}
