import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BASE_API_URL } from '../../../../constants';
import Añadir from '/Common/añadir_blanco.png';
import Entrada from '/Character/Diary/Entrada.jpg';
import './DiaryEntry.css';

export default function DiaryEntryList() {
  //#region States
  const [diaryName, setDiaryName] = useState('');
  const { pk, id } = useParams();
  const [showModal, setShowModal] = useState(false); // Estado para manejar la ventana emergente
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState(null); // Estado para manejar el menú contextual

  const [editEntry, setEditEntry] = useState({
    id: null,
    name: '',
    description: '',
    image1: null,
    image2: null,
    image3: null,
    imagePreview1: null,
    imagePreview2: null,
    imagePreview3: null,
  });
  const [showEditModal, setShowEditModal] = useState(false); // Estado para manejar el modal de edición

  const [newEntry, setNewEntry] = useState({ name: '', description: '', image1: null, imagePreview1: null, image2: null, imagePreview2: null, image3: null, imagePreview3: null });

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showEntryModal, setShowEntryModal] = useState(false);

  const [zoomedImage, setZoomedImage] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  //#endregion

  //#region Logic

  //#region Carga de datos
  useEffect(() => {
    const fetchDiaryName = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await fetch(`${BASE_API_URL}/api/gameApp/diaries/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const diaryData = await response.json();
        setDiaryName(diaryData.name);
      } catch (error) {
        console.error('Error fetching diary name:', error);
      }
    };

    const fetchEntries = async () => {
      const token = localStorage.getItem('access');

      try {
        const response = await fetch(`${BASE_API_URL}/api/gameApp/diaryentries/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const filteredEntries = data.filter(entry => entry.diary === parseInt(id));
        setEntries(filteredEntries);
      } catch (error) {
        console.error('Error fetching diaries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryName();
    fetchEntries();
  }, [id]);

  const handleImageChange = (e, imageKey, previewKey) => {
    const file = e.target.files[0];
    if (file) {
      setNewEntry(prevState => ({ ...prevState, [imageKey]: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEntry(prevState => ({ ...prevState, [previewKey]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };


  //#endregion

  //#region Paginación
  const handleNextPage = () => {
    if ((currentPage * itemsPerPage) < entries.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const indexOfLastEntry = currentPage * itemsPerPage;
  const indexOfFirstEntry = indexOfLastEntry - itemsPerPage;
  const currentEntries = [...entries]
    .reverse() // Ordenar primero en orden inverso (más recientes primero)
    .slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(entries.length / itemsPerPage);

  //#endregion

  //#region Menu contextual(click derecho)
  const handleContextMenu = (e, entry) => {
    e.preventDefault(); // Evita que el menú contextual del navegador aparezca
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      entry: entry, // Guarda la entrada seleccionada para las acciones
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null); // Cierra el menú contextual
  };

  const handleCancel = () => {
    setNewEntry({
      name: '',
      description: '',
      image1: null,
      imagePreview1: null,
      image2: null,
      imagePreview2: null,
      image3: null,
      imagePreview3: null
    });
    setShowModal(false);
  };
  //--------------Click fuera cierra menú contextual--------------
  useEffect(() => {
    const handleClickOutside = () => {
      closeContextMenu();
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleCloseModal = () => {
    setShowEntryModal(false);
    setSelectedEntry(null);
  };
  //#endregion

  //#region CRUD
  const handleCreateEntry = async () => {
    const token = localStorage.getItem('access');
    const formData = new FormData();

    // Añadir los datos de la entrada al FormData
    formData.append('name', newEntry.name);
    formData.append('description', newEntry.description);
    formData.append('diary', id); // Incluye el ID del diario

    // Añadir las imágenes si están disponibles
    if (newEntry.image1) formData.append('image1', newEntry.image1);
    if (newEntry.image2) formData.append('image2', newEntry.image2);
    if (newEntry.image3) formData.append('image3', newEntry.image3);

    try {
      const response = await fetch(`${BASE_API_URL}/api/gameApp/diaryentries/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // El token para la autenticación
        },
        body: formData, // Usamos FormData en lugar de JSON
      });

      if (!response.ok) {
        throw new Error('Error al crear el diario');
      }

      const createdEntry = await response.json();
      setEntries((prevState) => [...prevState, createdEntry]); // Añadir la nueva entrada al estado
    } catch (error) {
      console.error('Error al crear la entrada:', error);
    } finally {
      setShowModal(false);
      setNewEntry({ name: '', description: '', image1: null, imagePreview1: null, image2: null, imagePreview2: null, image3: null, imagePreview3: null }); // Reiniciar el formulario
    }
  };


  const handleEditEntryClick = (entry) => {
    setEditEntry({
      id: entry.id,
      name: entry.name,
      description: entry.description,
      image1: entry.image1 || null,
      image2: entry.image2 || null,
      image3: entry.image3 || null,
      imagePreview1: entry.image1 ? `${BASE_API_URL}${entry.image1}` : null,
      imagePreview2: entry.image2 ? `${BASE_API_URL}${entry.image2}` : null,
      imagePreview3: entry.image3 ? `${BASE_API_URL}${entry.image3}` : null,
    });
    setShowEditModal(true);
  };

  const handleDelete = async (entryId) => {
    const token = localStorage.getItem('access');

    try {
      const response = await fetch(`${BASE_API_URL}/api/gameApp/diaryentries/${entryId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la entrada');
      }

      // Actualizar las entradas eliminando la entrada eliminada
      setEntries(prevState => {
        const updatedEntries = prevState.filter(entry => entry.id !== entryId);

        // Verificar si la página actual queda vacía
        const totalPagesAfterDelete = Math.ceil(updatedEntries.length / itemsPerPage);
        if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
          setCurrentPage(totalPagesAfterDelete); // Ajustar a la última página válida
        }

        return updatedEntries;
      });
    } catch (error) {
      console.error('Error al eliminar la entrada:', error);
    } finally {
      setContextMenu(null);
    }
  };


  const handleEditEntry = async () => {
    const token = localStorage.getItem('access');
    const formData = new FormData();
    
    formData.append('name', editEntry.name);
    formData.append('description', editEntry.description);
    formData.append('diary', id);
  
    // Si la imagen es un archivo, la enviamos. Si no, no la agregamos a FormData.
    if (editEntry.image1 instanceof File) formData.append('image1', editEntry.image1);
    if (editEntry.image2 instanceof File) formData.append('image2', editEntry.image2);
    if (editEntry.image3 instanceof File) formData.append('image3', editEntry.image3);
  
    console.log("Datos enviados:", [...formData.entries()]);  // Verificar qué se envía
  
    try {
      const response = await fetch(`${BASE_API_URL}/api/gameApp/diaryentries/${editEntry.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el diario');
      }
  
      const updatedEntry = await response.json();
      setEntries(prevState =>
        prevState.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
      );
      setShowEditModal(false);
      setEditEntry(null);
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };
  
  

  //#endregion 

  if (loading) return <div>Loading...</div>;

  return (
    <div className='entries-container'>
      <div className="entries-header">
        <h1>Entradas del {diaryName}</h1>
        <button className='entries-add-button' onClick={() => setShowModal(true)} title="Añadir una entrada">
          <img src={Añadir} alt="Añadir" className="add-icon" />
        </button>
      </div>

      <div className='entries-list'>
        {currentEntries.length > 0 ? (
          currentEntries.map((entry) => ( // Eliminar reverse() aquí
            <div key={entry.id} className='entries-item' onContextMenu={(e) => handleContextMenu(e, entry)} onClick={() => { setSelectedEntry(entry); setShowEntryModal(true); }}>
              <img src={Entrada} alt="Entry" className="entry-icon" />

              <div className='entries-name'>{entry.name}</div>

            </div>
          ))
        ) : (
          <p className='noEntriesList'>Aún no tienes ninguna entrada. ¡Empieza creando una!</p>
        )}

        {entries.length > itemsPerPage && (
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Anterior</button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= entries.length}>Siguiente</button>
          </div>
        )}
      </div>


      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={() => handleEditEntryClick(contextMenu.entry)}>
            Editar
          </button>
          <button onClick={() => handleDelete(contextMenu.entry.id)}>Eliminar</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={handleCancel}>×</button>
            <h2>Crear una nueva entrada para {diaryName}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateEntry(); }} className="modal-form">
              <label>
                Nombre:
                <input
                  type="text"
                  value={newEntry.name}
                  onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                  required
                  placeholder='Día 1: Comienzo de la aventura'
                  maxLength="100"
                />
              </label>
              <label>
                Descripción:
                <textarea
                  className='create-diary-entry-description'
                  maxLength="500"
                  value={newEntry.description}
                  placeholder='Amanece un nuevo día en la ciudad de Escarlia...'
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                />
              </label>

              <label>
                Imagen 1:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'image1', 'imagePreview1')}
                />
                {newEntry.imagePreview1 && (
                  <div>
                    <img src={newEntry.imagePreview1} alt="Vista previa 1" className="image-preview" />
                  </div>
                )}
              </label>

              <label>
                Imagen 2:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'image2', 'imagePreview2')}
                />
                {newEntry.imagePreview2 && (
                  <div>
                    <img src={newEntry.imagePreview2} alt="Vista previa 2" className="image-preview" />
                  </div>
                )}
              </label>

              <label>
                Imagen 3:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'image3', 'imagePreview3')}
                />
                {newEntry.imagePreview3 && (
                  <div>
                    <img src={newEntry.imagePreview3} alt="Vista previa 3" className="image-preview" />
                  </div>
                )}
              </label>
              <div className="modal-buttons">
                <button type="submit">Guardar</button>
                <button type="button" onClick={handleCancel}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editEntry && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            <h2>Editar Entrada del Diario</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEditEntry(); }} className="modal-form">
              <label>
                Nombre:
                <input
                  type="text"
                  value={editEntry.name}
                  onChange={(e) => setEditEntry({ ...editEntry, name: e.target.value })}
                  required
                  maxLength="100"
                  placeholder='Día 1: Comienzo de la aventura'
                />
              </label>
              <label>
                Descripción:
                <textarea className="edit-diaryEntry-description"
                  value={editEntry.description}
                  maxLength="500"
                  placeholder='Amanece un nuevo día en la ciudad de Escarlia...'
                  onChange={(e) => setEditEntry({ ...editEntry, description: e.target.value })}
                />
              </label>

              {/* Manejo de imágenes con vista previa */}
              {[1, 2, 3].map((num) => (
                <label key={num}>
                  Imagen {num}:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditEntry((prev) => ({
                          ...prev,
                          [`image${num}`]: file,
                        }));
                      }
                    }}
                  />
                  {editEntry[`image${num}`] && (
                    <div>
                      <img className="image-preview" src={editEntry[`image${num}`] instanceof File ? URL.createObjectURL(editEntry[`image${num}`]) : editEntry[`image${num}`]} alt={`Preview ${num}`} />
                    </div>
                  )}
                </label>
              ))}

              <div className="modal-buttons">
                <button type="submit">Actualizar</button>
                <button type="button" onClick={() => setShowEditModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {showEntryModal && selectedEntry && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h2 className="entry-detail-name" >{selectedEntry.name}</h2>
            <div className="entry-detail-description"><p>{selectedEntry.description}</p></div>
            <div className="image-container">
              {selectedEntry.image1 && (
                <img
                  src={selectedEntry.image1}
                  alt="Imagen 1"
                  onClick={() => setZoomedImage(selectedEntry.image1)}
                />
              )}
              {selectedEntry.image2 && (
                <img
                  src={selectedEntry.image2}
                  alt="Imagen 2"
                  onClick={() => setZoomedImage(selectedEntry.image2)}
                />
              )}
              {selectedEntry.image3 && (
                <img
                  src={selectedEntry.image3}
                  alt="Imagen 3"
                  onClick={() => setZoomedImage(selectedEntry.image3)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {zoomedImage && (
        <div className="zoomed-image-overlay" onClick={() => setZoomedImage(null)}>
          <div className="zoomed-image-container">
            <img src={zoomedImage} alt="Imagen ampliada" className="zoomed-image" />
          </div>
        </div>
      )}


    </div>
  );
}
