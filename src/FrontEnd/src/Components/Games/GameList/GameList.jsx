import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_API_URL } from '../../constants';
import Añadir from '/Common/añadir_blanco.png';
import './GameList.css';

export default function GameList() {
//#region States

  const [userId, setUserId] = useState(null);
  const [gameLists, setGameLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { x: number, y: number, gameId: string } | null
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [editingGame, setEditingGame] = useState(null); // Partida que está siendo editada
//#endregion

//#region GameList

  useEffect(() => {
    const fetchUserId = async () => {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('access');

      try {
        const response = await fetch(`${BASE_API_URL}/api/authApp/users/${username}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener datos del usuario');
        }

        const data = await response.json();
        setUserId(data.id);
        fetchGames(data.id);
      } catch (error) {
        console.error('Error al obtener ID del usuario:', error);
        setError('Fallo al obtener datos del usuario');
        setLoading(false);
      }
    };

    const fetchGames = async (userId) => {
      const token = localStorage.getItem('access');

      try {
        const response = await fetch(`${BASE_API_URL}/api/gameApp/games/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al obtener partidas:", errorData);
        }

        const data = await response.json();
        const userGames = data.filter(game => game.user === userId);

        setGameLists(userGames);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener listas de partidas:', error);
        setError('Fallo al obtener listas de partidas');
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);
//#endregion 

//#region Modal Logic
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleContextMenu = (e, game) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, game });
  };

  const handleEdit = (game) => {
    setEditingGame({ 
      ...game, 
      imagePreview: constructImageUrl(game.image) // Carga la imagen actual para previsualizar
    });
    setIsEditModalOpen(true);
    setContextMenu(null);
  };
  

  const handleDelete = async (gameId) => {
    const token = localStorage.getItem('access');

    try {
      const response = await fetch(`${BASE_API_URL}/api/gameApp/games/${gameId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la partida');
      }

      setGameLists(prevState => prevState.filter(game => game.id !== gameId));
    } catch (error) {
      console.error('Error al eliminar la partida:', error);
      setError('Fallo al eliminar la partida');
    }

    setContextMenu(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewGame({ name: '', description: '', image: '' }); // Limpiar los campos del formulario
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingGame(null); // Limpiar el juego que se estaba editando
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGame(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewGame(prevState => ({ ...prevState, image: file }));

      // Opcional: Para previsualización
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGame(prevState => ({ ...prevState, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingGame(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingGame(prevState => ({ 
        ...prevState, 
        image: file, // Asigna el archivo de imagen
        imagePreview: URL.createObjectURL(file) // Actualiza la previsualización con la nueva imagen
      }));
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    try {
      const formData = new FormData();
      formData.append('name', newGame.name);
      formData.append('description', newGame.description);
      formData.append('user', userId);

      if (newGame.image) {
        formData.append('image', newGame.image, newGame.image.name);
      }

      const response = await fetch(`${BASE_API_URL}/api/gameApp/games/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al crear la partida');
      }

      const data = await response.json();
      setGameLists(prevState => [...prevState, data]);
      handleCloseModal();
    } catch (error) {
      console.error('Error al crear la partida:', error);
      setError('Fallo al crear la partida');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
  
    try {
      const formData = new FormData();
      formData.append('name', editingGame.name);
      formData.append('description', editingGame.description);
      formData.append('user', userId);
  
      // Si la image es null, significa que el usuario ha decidido eliminarla
      if (editingGame.image === null) {
        formData.append('image', '');
      } else if (editingGame.image instanceof File) {
        // Si hay una nueva image seleccionada, agregarla
        formData.append('image', editingGame.image, editingGame.image.name);
      }
  
      const response = await fetch(`${BASE_API_URL}/api/gameApp/games/${editingGame.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar la partida');
      }
  
      const data = await response.json();
  
      // Actualiza la lista de partidas con los datos actualizados
      setGameLists(prevState => prevState.map(game => game.id === data.id ? data : game));
      handleCloseEditModal();
    } catch (error) {
      console.error('Error al actualizar la partida:', error);
      setError('Fallo al actualizar la partida');
    }
  };
  
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const constructImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    return imagePath;
  };
//#endregion

  return (
    <div className="game-list-container">
      <div className="game-header">
        <h1>Mis Partidas</h1>
        <button className="game-add-button" onClick={handleOpenModal} title="Añadir una partida">
          <img src={Añadir} alt="Añadir" className="add-icon" />
        </button>
      </div>
        <div className="game-list-options">
        {gameLists.length > 0 ? (
            gameLists.map(game => (
            <div key={game.id} className="game-link" onContextMenu={(e) => handleContextMenu(e, game)}>
                <Link to={`/games/${game.id}`} className="game-card">
                <div className="game-card-image">
                    {game.image ? (
                    <img src={constructImageUrl(game.image)} alt="Fallo al cargar la imagen" />
                    ) : (
                    <div className="game-card-placeholder"></div>
                    )}
                    <div className="game-card-tooltip">{game.description}</div>
                </div>
                <div className="game-card-title">{game.name}</div>
                </Link>
            </div>
            ))
        ) : (
            <p className='noGameList'>Aún no tienes ninguna partida.</p>
        )}
        </div>

        {isModalOpen && (
        <div className="modal-overlay">
            <div className="modal">
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h2>Crear Nueva Partida</h2>
            <form onSubmit={handleSubmit} className="modal-form">
                <label>
                Nombre:
                <input
                    type="text"
                    name="name"
                    value={newGame.name}
                    onChange={handleInputChange}
                    required
                    maxLength="30"
                />
                </label>
                <label>
                Descripción:
                <textarea
                    name="description"
                    value={newGame.description}
                    onChange={handleInputChange}
                    maxLength="60"

                />
                </label>
                <label>
                Imagen:
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {newGame.imagePreview && (
                    <img src={newGame.imagePreview} alt="Vista previa" className="image-preview" />
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

        {isEditModalOpen && editingGame && (
        <div className="modal-overlay">
            <div className="modal">
            <button className="modal-close" onClick={handleCloseEditModal}>×</button>
            <h2>Editar Partida</h2>
            <form onSubmit={handleEditSubmit} className="modal-form">
                <label>
                Nombre:
                <input
                    type="text"
                    name="name"
                    value={editingGame.name}
                    onChange={handleEditChange}
                    required
                    maxLength="30"
                />
                </label>
                <label>
                Descripción:
                <textarea
                    name="description"
                    value={editingGame.description}
                    onChange={handleEditChange}
                    required
                    maxLength="60"
                />
                </label>
                <label>
                Imagen:
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                />
                {editingGame.imagePreview && (
                    <div>
                    <img src={editingGame.imagePreview} alt="Vista previa" className="image-preview" />
                    <button className='buttonDeleteImg'
                        type="button" 
                        onClick={(e) => {
                            e.preventDefault(); // Previene el comportamiento predeterminado del botón
                            setEditingGame(prevState => ({ ...prevState, image: null, imagePreview: null }));
                        }}
                        >
                        X
                        </button>
                    </div>
                )}
                </label>
                <div className="modal-buttons">
                <button type="submit">Actualizar</button>
                <button type="button" onClick={handleCloseEditModal}>Cancelar</button>
                </div>
            </form>
            </div>
        </div>
        )}


        {contextMenu && (
        <div 
            className="context-menu" 
            style={{ top: contextMenu.y, left: contextMenu.x }}
        >
            <button onClick={() => handleEdit(contextMenu.game)}>Editar</button>
            <button onClick={() => handleDelete(contextMenu.game.id)}>Eliminar</button>
        </div>
        )}
    </div>
  );
}
