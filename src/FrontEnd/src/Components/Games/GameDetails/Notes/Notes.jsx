import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_API_URL } from '../../../constants';
import Añadir from '/Common/añadir_negro.png';
import Pin from '/Character/Note/pin.png';
import './Notes.css';

export default function Notes() {
  //#region Consts

  const [activeTab, setActiveTab] = useState('Principal');
  const { pk } = useParams();
  const [notes, setNotes] = useState([]);
  const [editNotes, setEditNotes] = useState({
    id: null,
    name: '',
    description: '',
    image1: null,
    image2: null,
    image3: null,
    imagePreview1: null,
    imagePreview2: null,
    imagePreview3: null,
    completed: false,
  });
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    note: null, // Identificador de la nota asociada
  });

  const [page, setPage] = useState({
    Principal: 1,
    Secundaria: 1,
    Personajes: 1,
    Bestiario: 1,
    Notas: 1,
  });
  const itemsPerPage = 6;

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Estado para manejar el modal de edición

  const [newNote, setNewNote] = useState({
    name: '',
    description: '',
    type: activeTab, // Tipo de nota según la pestaña activa
    image1: null, imagePreview1: null, image2: null, imagePreview2: null, image3: null, imagePreview3: null
  });
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewNote({ name: '', description: '', type: activeTab }); // Reiniciar datos al cerrar
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote((prev) => ({ ...prev, [name]: value }));
  };
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  //#endregion 

  //#region Logica

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('access');

        if (!token) {
          console.error('Token de autenticación no encontrado');
          return;
        }

        const response = await fetch(`${BASE_API_URL}/api/gameApp/notes/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const filteredNotes = data.filter((note) => note.game === parseInt(pk));
        setNotes(filteredNotes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setLoading(false);
      }
    };

    fetchNotes(); // Llamar a la función para cargar las notas cuando la pestaña cambia
  }, [pk, activeTab]); // Se añade 'activeTab' para que se dispare al cambiar de pestaña

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handlePageChange = (tab, direction) => {
    setPage((prevPage) => ({
      ...prevPage,
      [tab]: Math.max(1, prevPage[tab] + direction),
    }));
  };

  const handleContextMenu = (event, note) => {
    event.preventDefault(); // Evitar el menú contextual predeterminado del navegador
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      note, // Guarda el ID de la nota asociada
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, note: null });
  };

  const renderTabContent = (type, bgColor) => {
    const currentPage = page[activeTab];
    const filteredNotes = notes.filter((note) => note.type === type);

    // Invertir el orden de las notas para mostrar las más recientes primero
    const sortedNotes = filteredNotes.reverse();

    const totalPages = Math.ceil(sortedNotes.length / itemsPerPage);

    const paginatedNotes = sortedNotes.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="content" style={{ backgroundColor: bgColor }}>
        {loading ? (
          <div>Cargando notas...</div>
        ) : (<>
          <div>
            {/* Botón para añadir una nota */}
            <div className="entries-header">
              <button
                className="entries-add-button"
                onClick={() => setShowModal(true)}
                title="Añadir una nota"
              >
                <div className="Notes-add-button">
                  <img src={Añadir} alt="Añadir" className="Notes-add-icon" />
                </div>
              </button>
            </div>

            {/* Contenedor para las notas */}
            <div className="noteList-container">
              {paginatedNotes.length === 0 ? (
                <p className="noEntriesList">Aún no tienes ninguna entrada. ¡Empieza creando una!</p>
              ) : (
                paginatedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="note-card"
                    onContextMenu={(event) => handleContextMenu(event, note)} // Maneja el menú contextual aquí

                  >
                    <div >
                      <img className="pin-icon" onClick={() => handleCompleteNote(note)} src={Pin} alt="Pin" />
                    </div>
                    <div className={`notename ${note.completed ? 'completed' : ''}`} onClick={() => handleOpenNoteModal(note)}><h3>{note.name}</h3></div>
                  </div>
                ))
              )}
            </div>


          </div>
          {/* Paginación */}
          {filteredNotes.length > itemsPerPage && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(activeTab, -1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(activeTab, 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}</>
        )}
      </div>
    );
  };

  const handleImageChange = (e, imageKey, previewKey) => {
    const file = e.target.files[0];
    if (file) {
      setNewNote(prevState => ({ ...prevState, [imageKey]: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewNote(prevState => ({ ...prevState, [previewKey]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };


  // Función para abrir el modal y seleccionar la nota
  const handleOpenNoteModal = (note) => {
    setSelectedNote(note);
    setShowNoteModal(true);
  };

  // Función para cerrar el modal
  const handleCloseNoteModal = () => {
    setShowNoteModal(false);
    setSelectedNote(null);
  };

  const handleCompleteNote = async (note) => {
    // Alternar el estado de 'completed'
    const updatedNote = {
      ...note,
      completed: !note.completed,
    };

    const token = localStorage.getItem('access');

    try {
      // Usar 'PATCH' para actualizar solo el campo 'completed'
      const response = await fetch(`${BASE_API_URL}/api/gameApp/notes/${note.id}/`, {
        method: 'PATCH',  // Usamos PATCH para actualización parcial
        headers: {
          'Content-Type': 'application/json',  // Indicamos que estamos enviando datos JSON
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: updatedNote.completed,  // Solo enviamos el campo 'completed'
        }),
      });

      if (response.ok) {
        const updatedNoteData = await response.json();
        // Actualiza la lista de notas para reflejar el cambio
        setNotes((prevNotes) =>
          prevNotes.map((n) =>
            n.id === updatedNoteData.id ? updatedNoteData : n
          )
        );
      } else {
        console.error('Error al actualizar la nota');
      }
    } catch (error) {
      console.error('Error al completar la nota:', error);
    }
  };


  //#endregion

  //#region CRUD
  const handleDelete = async (noteId) => {
    const token = localStorage.getItem('access');

    try {
      const response = await fetch(`${BASE_API_URL}/api/gameApp/notes/${noteId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la nota');
      }

      // Actualizar las notas eliminando la nota eliminada
      setNotes((prevState) => {
        const updatedNotes = prevState.filter((note) => note.id !== noteId);

        // Calcular el total de páginas después de la eliminación
        const totalPagesAfterDelete = Math.ceil(updatedNotes.length / itemsPerPage);
        const currentPage = page[activeTab];

        // Si la página actual queda vacía, ir a la página anterior
        if (updatedNotes.length === 0 && currentPage > 1) {
          handlePageChange(activeTab, -1); // Cambiar a la página anterior
        }

        // Si la página actual es la última y queda vacía, ajustar a la última página válida
        if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
          setPage((prevPage) => ({
            ...prevPage,
            [activeTab]: totalPagesAfterDelete, // Cambiar a la última página válida
          }));
        }

        return updatedNotes;
      });
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
    } finally {
      setContextMenu(null);
    }
  };

  const handleCreateNote = async () => {
    const token = localStorage.getItem('access');

    const typeMap = {
      Principal: 'Misión Principal',
      Secundaria: 'Misión Secundaria',
      Personajes: 'Personaje',
      Bestiario: 'Bestiario',
      Notas: 'Nota',
    };

    const formData = new FormData();
    formData.append('name', newNote.name);
    formData.append('description', newNote.description);
    formData.append('type', typeMap[activeTab]); // Asigna el tipo correcto
    formData.append('game', parseInt(pk));

    // Agregar las imágenes al FormData
    if (newNote.image1) formData.append('image1', newNote.image1);
    if (newNote.image2) formData.append('image2', newNote.image2);
    if (newNote.image3) formData.append('image3', newNote.image3);

    try {
      const response = await fetch(`${BASE_API_URL}/api/gameApp/notes/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // Usamos FormData en lugar de JSON
      });

      if (!response.ok) {
        throw new Error('Error al crear la nota');
      }

      const newNoteData = await response.json();
      setNotes((prevNotes) => [...prevNotes, newNoteData]);
      closeModal();
    } catch (error) {
      console.error('Error al guardar la nota:', error);
    } finally {
      setShowModal(false);
      setNewNote({ name: '', description: '', type: activeTab, image1: null, imagePreview1: null, image2: null, imagePreview2: null, image3: null, imagePreview3: null }); // Reiniciar el formulario
    }
  };

  const handleEditNote = async () => {
    const token = localStorage.getItem('access');
    const formData = new FormData();

    formData.append('name', editNotes.name);
    formData.append('description', editNotes.description);
    formData.append('game', pk);
    formData.append('completed', editNotes.completed);

    // Si la imagen es un archivo, la enviamos. Si no, no la agregamos a FormData.
    if (editNotes.image1 instanceof File) formData.append('image1', editNotes.image1);
    if (editNotes.image2 instanceof File) formData.append('image2', editNotes.image2);
    if (editNotes.image3 instanceof File) formData.append('image3', editNotes.image3);

    try {
      const response = await fetch(`${BASE_API_URL}/api/gameApp/notes/${editNotes.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la nota');
      }

      const updatedNote = await response.json();
      setNotes(prevState =>
        prevState.map(note => (note.id === updatedNote.id ? updatedNote : note))
      );
      setShowEditModal(false);
      setEditNotes(null);
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  const handleEditNoteClick = (note) => {
    setEditNotes({
      id: note.id,
      name: note.name,
      description: note.description,
      type: note.type,
      game: pk,
      image1: note.image1 || null,
      image2: note.image2 || null,
      image3: note.image3 || null,
      imagePreview1: note.image1 ? `${BASE_API_URL}${note.image1}` : null,
      imagePreview2: note.image2 ? `${BASE_API_URL}${note.image2}` : null,
      imagePreview3: note.image3 ? `${BASE_API_URL}${note.image3}` : null,
      completed:note.completed,
    });
    setShowEditModal(true);
  };

  //#endregion 


  return (
    <div
      className="notes-container"
      onClick={handleCloseContextMenu} // Cierra el menú contextual al hacer clic fuera
    >
      <div className="tab-container">
        <div
          className={`tab ${activeTab === 'Principal' ? 'active' : ''}`}
          onClick={() => handleTabClick('Principal')}
          style={{
            backgroundColor: activeTab === 'Principal' ? 'rgb(255, 242, 157)' : 'rgb(156, 156, 107)', // Cambiar a color más oscuro si no está activa
          }}
        >
          Principal
        </div>

        <div
          className={`tab ${activeTab === 'Secundaria' ? 'active' : ''}`}
          onClick={() => handleTabClick('Secundaria')}
          style={{
            backgroundColor: activeTab === 'Secundaria' ? 'rgb(173, 199, 255)' : 'rgb(108, 123, 144)', // Cambiar a color más oscuro si no está activa
          }}
        >
          Secundarias
        </div>

        <div
          className={`tab ${activeTab === 'Personajes' ? 'active' : ''}`}
          onClick={() => handleTabClick('Personajes')}
          style={{
            backgroundColor: activeTab === 'Personajes' ? 'rgb(186, 156, 255)' : 'rgb(116, 102, 151)', // Cambiar a color más oscuro si no está activa
          }}
        >
          Personajes
        </div>
        <div
          className={`tab ${activeTab === 'Bestiario' ? 'active' : ''}`}
          onClick={() => handleTabClick('Bestiario')}
          style={{
            backgroundColor: activeTab === 'Bestiario' ? 'rgb(170, 211, 126)' : 'rgb(100, 121, 68)', // Cambiar a color más oscuro si no está activa
          }}
        >
          Bestiario
        </div>

        <div
          className={`tab ${activeTab === 'Notas' ? 'active' : ''}`}
          onClick={() => handleTabClick('Notas')}
          style={{
            backgroundColor: activeTab === 'Notas' ? 'rgb(205, 205, 205)' : 'rgb(112, 112, 112)', // Cambiar a color más oscuro si no está activa
          }}
        >
          Notas
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'Principal' && renderTabContent('Misión Principal', 'rgb(255, 242, 157)')}
        {activeTab === 'Secundaria' && renderTabContent('Misión Secundaria', 'rgb(173, 199, 255)')}
        {activeTab === 'Personajes' && renderTabContent('Personaje', 'rgb(186, 156, 255)')}
        {activeTab === 'Bestiario' && renderTabContent('Bestiario', 'rgb(170, 211, 126)')}
        {activeTab === 'Notas' && renderTabContent('Nota', 'rgb(205, 205, 205)')}
      </div>

      {contextMenu && contextMenu.visible && (
        <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button onClick={() => handleEditNoteClick(contextMenu.note)}>Editar</button>
          <button onClick={() => handleDelete(contextMenu.note.id)}>Eliminar</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>Crear entrada para la categoría {activeTab}</h2>
            <form className="modal-form">
              <label>
                Nombre:
                <input
                  type="text"
                  name="name"
                  value={newNote.name}
                  onChange={handleInputChange}
                  required
                  placeholder='Rescatar a los civiles del incendio.'
                  maxLength={100}
                />
              </label>

              <label>
                Descripción:
                <textarea
                  className='note-description'
                  name="description"
                  value={newNote.description}
                  onChange={handleInputChange}
                  placeholder='Debemos ir a comprobar que todos estan a salvo.'

                />
              </label>
              <label>
                Imagen 1:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'image1', 'imagePreview1')}
                />
                {newNote.imagePreview1 && (
                  <div>
                    <img src={newNote.imagePreview1} alt="Vista previa 1" className="image-preview" />
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
                {newNote.imagePreview2 && (
                  <div>
                    <img src={newNote.imagePreview2} alt="Vista previa 2" className="image-preview" />
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
                {newNote.imagePreview3 && (
                  <div>
                    <img src={newNote.imagePreview3} alt="Vista previa 3" className="image-preview" />
                  </div>
                )}
              </label>
            </form>
            <div className="modal-buttons">
              <button type="submit" onClick={handleCreateNote}>Guardar</button>
              <button type="button" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editNotes && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            <h2>Editar Diario</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEditNote(); }} className="modal-form">
              <label>
                Nombre:
                <input
                  type="text"
                  value={editNotes.name}
                  onChange={(e) => setEditNotes({ ...editNotes, name: e.target.value })}
                  required
                  maxLength={100}
                  placeholder='Día 1: Comienzo de la aventura'
                />
              </label>
              <label>
                Descripción:
                <textarea
                  className='note-description'
                  value={editNotes.description}
                  placeholder='Amanece un nuevo día en la ciudad de Escarlia...'
                  onChange={(e) => setEditNotes({ ...editNotes, description: e.target.value })}
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
                        setEditNotes((prev) => ({
                          ...prev,
                          [`image${num}`]: file,
                        }));
                      }
                    }}
                  />
                  {editNotes[`image${num}`] && (
                    <div>
                      <img className="image-preview" src={editNotes[`image${num}`] instanceof File ? URL.createObjectURL(editNotes[`image${num}`]) : editNotes[`image${num}`]} alt={`Preview ${num}`} />
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

      {showNoteModal && selectedNote && (
        <div className="modal-overlay" onClick={handleCloseNoteModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseNoteModal}>×</button>
            <h2 className='note-detail-name'>{selectedNote.name}</h2>
            <div className="note-detail-description">
              <p>{selectedNote.description}</p>
            </div>
            <div className="image-container">
              {selectedNote.image1 && (
                <img
                  src={selectedNote.image1}
                  alt="Imagen 1"
                  onClick={() => setZoomedImage(selectedNote.image1)}
                />
              )}
              {selectedNote.image2 && (
                <img
                  src={selectedNote.image2}
                  alt="Imagen 2"
                  onClick={() => setZoomedImage(selectedNote.image2)}
                />
              )}
              {selectedNote.image3 && (
                <img
                  src={selectedNote.image3}
                  alt="Imagen 3"
                  onClick={() => setZoomedImage(selectedNote.image3)}
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
