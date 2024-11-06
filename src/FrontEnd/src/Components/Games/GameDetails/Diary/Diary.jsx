import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BASE_API_URL } from '../../../constants';
import Diario from '/Character/Diary/Diarios.jpg';
import Añadir from '/Common/añadir_blanco.png';
import './Diary.css';

export default function Diary() {
  const [diaries, setDiaries] = useState([]);
  const [gameName, setGameName] = useState('');
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState(null); // Estado para manejar el menú contextual
  const [showModal, setShowModal] = useState(false); // Estado para manejar la ventana emergente
  const [newDiary, setNewDiary] = useState({ name: '', description: '' }); // Estado para el nuevo diario
  const [editDiary, setEditDiary] = useState(null); // Estado para el diario en edición
  const [showEditModal, setShowEditModal] = useState(false); // Estado para manejar el modal de edición
  const { pk } = useParams();

  useEffect(() => {
    const fetchGameName = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/api/characterApp/games/${pk}/`);
        const gameData = await response.json();
        setGameName(gameData.name);
      } catch (error) {
        console.error('Error fetching game name:', error);
      }
    };

    const fetchDiaries = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/api/characterApp/diaries/`);
        const data = await response.json();
        const filteredDiaries = data.filter(diary => diary.game === parseInt(pk));
        setDiaries(filteredDiaries);
      } catch (error) {
        console.error('Error fetching diaries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameName();
    fetchDiaries();
  }, [pk]);

  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleContextMenu = (e, diary) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, diary });
  };

  const handleDelete = async (diaryId) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/characterApp/diaries/${diaryId}/`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el diario');
      }

      setDiaries(prevState => prevState.filter(diary => diary.id !== diaryId));
    } catch (error) {
      console.error('Error al eliminar el diario:', error);
    } finally {
      setContextMenu(null);
    }
  };

  const handleCreateDiary = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/characterApp/diaries/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newDiary, game: pk }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el diario');
      }

      const createdDiary = await response.json();
      setDiaries((prevState) => [...prevState, createdDiary]);
    } catch (error) {
      console.error('Error al crear el diario:', error);
    } finally {
      setShowModal(false);
      setNewDiary({ name: '', description: '' });
    }
  };

  const handleEditDiary = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/characterApp/diaries/${editDiary.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editDiary),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el diario');
      }

      const updatedDiary = await response.json();
      setDiaries(prevState =>
        prevState.map(diary => (diary.id === updatedDiary.id ? updatedDiary : diary))
      );
    } catch (error) {
      console.error('Error al actualizar el diario:', error);
    } finally {
      setShowEditModal(false);
      setEditDiary(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='diary-container'>
      <div className="diary-header">
      <h1>Diarios de {gameName}</h1>
      <button className='diary-add-button' onClick={() => setShowModal(true)} title="Añadir un diario">
          <img src={Añadir} alt="Añadir" className="add-icon" />
        </button>
      </div>

      <div className='diary-list'>
      {diaries.map((diary) => (
        <div 
          key={diary.id} 
          className='diary-item'
          onContextMenu={(e) => handleContextMenu(e, diary)} // Add context menu handler here
        >
          <Link to={`/games/${pk}/diaries/${diary.id}/entries`}>
            <img src={Diario} alt="Diario" className='diary-image' />
            <div className='diary-name'>{diary.name}</div>
            <div className='diary-overlay'>
              <div className='diary-description'>{diary.description}</div>
            </div>
          </Link>
        </div>
      ))}
      </div>

      {contextMenu && (
        <div 
          className="context-menu" 
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={() => {
            setEditDiary(contextMenu.diary);
            setShowEditModal(true);
            setContextMenu(null);
          }}>
            Editar
          </button>
          <button onClick={() => handleDelete(contextMenu.diary.id)}>Eliminar</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Crear nuevo diario para {gameName}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateDiary(); }} className="modal-form">
              <label>
                Nombre:
                <input 
                  type="text" 
                  value={newDiary.name} 
                  onChange={(e) => setNewDiary({ ...newDiary, name: e.target.value })} 
                  required 
                  maxLength={30}
                />
              </label>
              <label>
                Descripción:
                <textarea 
                  maxLength={50}
                  value={newDiary.description} 
                  onChange={(e) => setNewDiary({ ...newDiary, description: e.target.value })}
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Crear</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editDiary && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            <h2>Editar Diario</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEditDiary(); }} className="modal-form">
              <label>
                Nombre:
                <input 
                  type="text" 
                  value={editDiary.name} 
                  onChange={(e) => setEditDiary({ ...editDiary, name: e.target.value })}
                  required 
                  maxLength={30}
                />
              </label>
              <label>
                Descripción:
                <textarea 
                  maxLength={50}
                  value={editDiary.description} 
                  onChange={(e) => setEditDiary({ ...editDiary, description: e.target.value })}
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
