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

  const [editEntry, setEditEntry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // Estado para manejar el modal de edición

  const [newEntry, setNewEntry] = useState({ name: '', description: '' });

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
    setNewEntry({ name: '', description: '' });
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
  //#endregion

  //#region CRUD
  const handleCreateEntry = async () => {
    const token = localStorage.getItem('access');
    const formData = new FormData();

    // Añadir los datos de la entrada al FormData
    formData.append('name', newEntry.name);
    formData.append('description', newEntry.description);
    formData.append('diary', id); // Incluye el ID del diario

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
      setNewEntry({ name: '', description: '' }); // Reiniciar el formulario
    }
  };

  const handleEditEntryClick = (entry) => {
    setEditEntry({
      ...entry,
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

    try {
      const formData = new FormData();
      formData.append('name', editEntry.name);
      formData.append('description', editEntry.description);
      formData.append('diary', id);

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
      setEditEntry(null);  // Limpiar el estado después de la actualización
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
            <div key={entry.id} className='entries-item' onContextMenu={(e) => handleContextMenu(e, entry)}>
              <img src={Entrada} alt="Entry" className="entry-icon" />
              <Link to={`${entry.id}`}>
                <div className='entries-name'>{entry.name}</div>
              </Link>
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
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
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
                  maxLength={30}
                />
              </label>
              <label>
                Descripción:
                <textarea
                  maxLength={50}
                  value={newEntry.description}
                  placeholder='Amanece un nuevo día en la ciudad de Escarlia...'
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                />
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
            <h2>Editar Diario</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEditEntry(); }} className="modal-form">
              <label>
                Nombre:
                <input
                  type="text"
                  value={editEntry.name}
                  onChange={(e) => setEditEntry({ ...editEntry, name: e.target.value })}
                  required
                  maxLength={100}
                  placeholder='Día 1: Comienzo de la aventura'
                />
              </label>
              <label>
                Descripción:
                <textarea
                  value={editEntry.description}
                  maxLength={300}
                  placeholder='Amanece un nuevo día en la ciudad de Escarlia...'
                  onChange={(e) => setEditEntry({ ...editEntry, description: e.target.value })}
                />
              </label>

              <div className="modal-buttons">
                <button type="submit">Actualizar</button>
                <button type="button" onClick={() => setShowEditModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
