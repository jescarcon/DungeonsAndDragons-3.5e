import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_API_URL } from '../../../constants';
import Añadir from '/Common/añadir_negro.png';
import './Notes.css';

export default function Notes() {
  const [activeTab, setActiveTab] = useState('principal');
  const { pk } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    noteId: null, // Identificador de la nota asociada
  });

  const [page, setPage] = useState({
    principal: 1,
    secundaria: 1,
    personajes: 1,
    bestiario: 1,
    notas: 1,
  });
  const itemsPerPage = 5;

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

  const handleContextMenu = (event, noteId) => {
    event.preventDefault(); // Evitar el menú contextual predeterminado del navegador
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      noteId, // Guarda el ID de la nota asociada
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, noteId: null });
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
        ) : (
          <div>
            <div className="entries-header">
              <button
                className="entries-add-button"
                onClick={() => setShowModal(true)}
                title="Añadir una nota"
              >
                <img src={Añadir} alt="Añadir" className="add-icon" />
              </button>
            </div>
            {paginatedNotes.length === 0 ? (
              <p className='noEntriesList'>Aún no tienes ninguna entrada. ¡Empieza creando una!</p>
            ) : (
              paginatedNotes.map((note) => (
                <div
                  key={note.id}
                  className="note-card"
                  onContextMenu={(event) => handleContextMenu(event, note.id)} // Maneja el menú contextual aquí
                >
                  <h3>{note.name}</h3>
                  <p>{note.description}</p>
                </div>
              ))
            )}
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
            )}
          </div>
        )}
      </div>
    );
  };


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


  //#endregion 


  return (
    <div
      className="notes-container"
      onClick={handleCloseContextMenu} // Cierra el menú contextual al hacer clic fuera
    >
      <div className="tab-container">
        <div
          className={`tab ${activeTab === 'principal' ? 'active' : ''}`}
          onClick={() => handleTabClick('principal')}
          style={{ backgroundColor: 'rgb(255, 242, 157)' }}
        >
          Principal
        </div>
        <div
          className={`tab ${activeTab === 'secundaria' ? 'active' : ''}`}
          onClick={() => handleTabClick('secundaria')}
          style={{ backgroundColor: 'rgb(173, 199, 255)' }}
        >
          Secundarias
        </div>
        <div
          className={`tab ${activeTab === 'personajes' ? 'active' : ''}`}
          onClick={() => handleTabClick('personajes')}
          style={{ backgroundColor: 'rgb(186, 156, 255)' }}
        >
          Personajes
        </div>
        <div
          className={`tab ${activeTab === 'bestiario' ? 'active' : ''}`}
          onClick={() => handleTabClick('bestiario')}
          style={{ backgroundColor: 'rgb(170, 211, 126)' }}
        >
          Bestiario
        </div>
        <div
          className={`tab ${activeTab === 'notas' ? 'active' : ''}`}
          onClick={() => handleTabClick('notas')}
          style={{ backgroundColor: 'rgb(205, 205, 205)' }}
        >
          Notas
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'principal' && renderTabContent('Misión Principal', 'rgb(255, 242, 157)')}
        {activeTab === 'secundaria' && renderTabContent('Misión Secundaria', 'rgb(173, 199, 255)')}
        {activeTab === 'personajes' && renderTabContent('Personaje', 'rgb(186, 156, 255)')}
        {activeTab === 'bestiario' && renderTabContent('Bestiario', 'rgb(170, 211, 126)')}
        {activeTab === 'notas' && renderTabContent('Nota', 'rgb(205, 205, 205)')}
      </div>

      {contextMenu && contextMenu.visible && (
        <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button>Editar</button>
          <button onClick={() => handleDelete(contextMenu.noteId)}>Eliminar</button>
        </div>
      )}
    </div>
  );
}
