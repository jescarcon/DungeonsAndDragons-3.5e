import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BASE_API_URL } from '../../../constants';
import Añadir from '/Common/añadir_blanco.png';
import './Diary.css';
import Modal from '../../../Modal/Modal';

export default function Diary() {
  //#region States
  const [diaries, setDiaries] = useState([]);
  const [gameName, setGameName] = useState('');
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState(null); // Estado para manejar el menú contextual
  const [showModal, setShowModal] = useState(false); // Estado para manejar la ventana emergente
  const [newDiary, setNewDiary] = useState({ name: '', description: '', image: null, imagePreview: null }); // Estado para el nuevo diario
  const [editDiary, setEditDiary] = useState(null); // Estado para el diario en edición
  const [showEditModal, setShowEditModal] = useState(false); // Estado para manejar el modal de edición
  const [editingDiary, setEditingDiary] = useState(null); // Diario que está siendo editado
  const { pk } = useParams();
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  //#endregion

  //#region Logic

  useEffect(() => {
    const fetchGameName = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await fetch(`${BASE_API_URL}/api/gameApp/games/${pk}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const gameData = await response.json();
        setGameName(gameData.name);
      } catch (error) {
        console.error('Error fetching game name:', error);
      }
    };

    const fetchDiaries = async () => {
      const token = localStorage.getItem('access');

      try {
        const response = await fetch(`${BASE_API_URL}/api/gameApp/diaries/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
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
    const token = localStorage.getItem('access');

    try {
      const response = await fetch(`${BASE_API_URL}/api/gameApp/diaries/${diaryId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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
    const token = localStorage.getItem('access');
    const formData = new FormData();

    // Añadir los datos del diario al FormData
    formData.append('name', newDiary.name);
    formData.append('description', newDiary.description);
    formData.append('game', pk); // Incluye el ID del juego
    if (newDiary.image) formData.append('image', newDiary.image); // Añade la imagen si existe

    try {
      const response = await fetch(`${BASE_API_URL}/api/gameApp/diaries/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // El token para la autenticación
        },
        body: formData, // Usamos FormData en lugar de JSON
      });

      if (!response.ok) {
        throw new Error('Error al crear el diario');
      }

      const createdDiary = await response.json();
      setDiaries((prevState) => [...prevState, createdDiary]); // Añadir el nuevo diario al estado
    } catch (error) {
      console.error('Error al crear el diario:', error);
    } finally {
      setShowModal(false);
      setNewDiary({ name: '', description: '', image: null, imagePreview: null }); // Reiniciar el formulario
    }
  };

  const handleEditDiary = async () => {
    const token = localStorage.getItem('access');

    try {
      const formData = new FormData();
      formData.append('name', editDiary.name);
      formData.append('description', editDiary.description);
      formData.append('game', editDiary.game);

      if (editDiary.image === null) {
        formData.append('image', '');
      } else if (editDiary.image instanceof File) {
        formData.append('image', editDiary.image, editDiary.image.name);
      }

      const response = await fetch(`${BASE_API_URL}/api/gameApp/diaries/${editDiary.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el diario');
      }

      const updatedDiary = await response.json();
      setDiaries(prevState =>
        prevState.map(diary => (diary.id === updatedDiary.id ? updatedDiary : diary))
      );
      setShowEditModal(false);
      setEditDiary(null);  // Limpiar el estado después de la actualización
    } catch (error) {
      console.error('Error al actualizar el diario:', error);
    }
  };

  const handleCancel = () => {
    setNewDiary({ name: '', description: '', image: null, imagePreview: null });
    setShowModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDiary(prevState => ({ ...prevState, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDiary(prevState => ({ ...prevState, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditDiary(prevState => ({
        ...prevState,
        image: file, // Asigna el archivo de imagen
        imagePreview: URL.createObjectURL(file), // Actualiza la previsualización con la nueva imagen
      }));
    }
  };

  const handleEditDiaryClick = (diary) => {
    setEditDiary({
      ...diary,
      imagePreview: diary.image, // Asignar la imagen actual para mostrarla en el modal de edición
    });
    setShowEditModal(true);
  };

  if (loading) return <div>Loading...</div>;
  //#endregion

  return (
    <div className='diary-container'>
      <div className="game-header">
        <div className='game-header-title'><h1>Diarios de la partida: {gameName}</h1></div>
        <div className="game-header-searcher">
          <input
            type="text"
            placeholder="Buscar partidas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="game-search-input"
          />
          <button className="" onClick={() => setShowModal(true)} title="Añadir una partida">
            + Añadir
          </button>
        </div>
      </div>
      <div className='diary-list'>
        {diaries.length > 0 ? (
          diaries
            .filter(diary => diary.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((diary) => (
              <div
                key={diary.id}
                className='diary-item'
                onContextMenu={(e) => handleContextMenu(e, diary)} // Add context menu handler here
              >
                <Link to={`/games/${pk}/diaries/${diary.id}/entries`}>
                  <img src={diary.image} alt="Diario" className='diary-image' />
                  <div className='diary-name'>{diary.name}</div>
                  <div className='diary-overlay'>
                    <div className='diary-description'>
                      <div className='diary-description-text'>
                        {diary.description}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
        ) : (
          <p className='noGameList'>Aún no tienes ningún diario. ¡Empieza creando uno!</p>
        )}
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={() => handleEditDiaryClick(contextMenu.diary)}>
            Editar
          </button>
          <button onClick={() => handleDelete(contextMenu.diary.id)}>Eliminar</button>
        </div>
      )}



      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>

        <h2>Crear nuevo diario para {gameName}</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateDiary(); }} className="modal-form">
          <label>
            Nombre:
            <input
              type="text"
              value={newDiary.name}
              onChange={(e) => setNewDiary({ ...newDiary, name: e.target.value })}
              required
              placeholder='Diario de Nathaniel'
              maxLength="30"
            />
          </label>
          <label>
            Descripción:
            <textarea
              maxLength="60"
              value={newDiary.description}
              placeholder='Viejo cuaderno de cuero algo raído, contiene dibujos y anotaciones...'
              onChange={(e) => setNewDiary({ ...newDiary, description: e.target.value })}
            />
          </label>
          <label>
            Imagen:
            <input
              type="file"
              accept="image/*"
              title=""
              onChange={handleImageChange}
            />
            {newDiary.imagePreview && (
              <div>
                <img src={newDiary.imagePreview} alt="Vista previa" className="image-preview" />
              </div>
            )}
          </label>
          <div className="modal-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={handleCancel}>Cancelar</button>
          </div>
        </form>

      </Modal>



      {editDiary && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <h2>Editar Diario</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleEditDiary(); }} className="modal-form">
            <label>
              Nombre:
              <input
                type="text"
                value={editDiary.name}
                onChange={(e) => setEditDiary({ ...editDiary, name: e.target.value })}
                required
                placeholder='Diario de Nathaniel'
                maxLength="30"
              />
            </label>
            <label>
              Descripción:
              <textarea
                value={editDiary.description}
                placeholder='Viejo cuaderno de cuero algo raído, contiene dibujos y anotaciones...'
                onChange={(e) => setEditDiary({ ...editDiary, description: e.target.value })}
                maxLength="60"

              />
            </label>
            <label>
              Imagen:
              <input
                title=""
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
              />
              {editDiary.imagePreview && (
                <div>
                  <img src={editDiary.imagePreview} alt="Vista previa" className="image-preview" />
                </div>
              )}
            </label>
            <div className="modal-buttons">
              <button type="submit">Actualizar</button>
              <button type="button" onClick={() => setShowEditModal(false)}>Cancelar</button>
            </div>
          </form>
        </Modal>

      )}

    </div>
  );
}
