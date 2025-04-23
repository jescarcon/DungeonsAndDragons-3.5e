import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BASE_API_URL } from '../../../constants';
import Añadir from '/Common/añadir_blanco.png';
import './Tavern.css';


export default function Tavern() {
  //#region States
  const { pk } = useParams(); // GameId de Url
  const [characterList, setCharacterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    description: '',
    game: '',
    image: '',
    excel_file: null,
  });
  const [editingCharacter, setEditingCharacter] = useState(null); // Partida que está siendo editada
  const BASE_MEDIA_URL = "http://localhost:8000/media/files/rolplay/game_app/character/default";
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  //#endregion

  //#region Character List

  useEffect(() => {
    const fetchCharacters = async () => {
      const token = localStorage.getItem('access');

      try {
        const response = await fetch(`${BASE_API_URL}/api/gameApp/character/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al obtener personajes:", errorData);
        }

        const data = await response.json();
        const gameCharacters = data.filter(character => character.game === parseInt(pk));

        setCharacterList(gameCharacters);
      } catch (error) {
        console.error('Error al obtener listas de personajes:', error);
        setError('Fallo al obtener listas de personajes');
      } finally {
        setLoading(false);
      }
    };

    if (pk) {
      fetchCharacters();
    }
  }, [pk]);

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

  const handleContextMenu = (e, character) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, character });
  };

  const handleEdit = (character) => {
    setEditingCharacter({
      ...character,
      imagePreview: constructImageUrl(character.image) // Carga la imagen actual para previsualizar
    });
    setIsEditModalOpen(true);
    setContextMenu(null);
  };


  const handleDelete = async (characterId) => {
    const token = localStorage.getItem('access');

    try {
      const response = await fetch(`${BASE_API_URL}/api/gameApp/character/${characterId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar personaje');
      }

      setCharacterList(prevState => prevState.filter(character => character.id !== characterId));
    } catch (error) {
      console.error('Error al eliminar personaje:', error);
      setError('Fallo al eliminar personaje');
    }

    setContextMenu(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCharacter({ name: '', description: '', game: '', image: '', excel_file: '' }); // Limpiar los campos del formulario
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCharacter(null); // Limpiar el juego que se estaba editando
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCharacter(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCharacter(prevState => ({ ...prevState, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCharacter(prevState => ({ ...prevState, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExcelChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setEditingCharacter(prevState => ({
          ...prevState,
          excel_file: file,
          excelFileName: file.name
        }));
      } else {
        setNewCharacter(prevState => ({
          ...prevState,
          excel_file: file,
          excelFileName: file.name
        }));
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCharacter(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingCharacter(prevState => ({
        ...prevState,
        image: file, // Asigna el archivo de imagen
        imagePreview: URL.createObjectURL(file) // Actualiza la previsualización con la nueva imagen
      }));
    }
  };


  const handleDownload = (fileName) => {
    const fileUrl = `${BASE_MEDIA_URL}/${fileName}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    try {
      const formData = new FormData();
      formData.append('name', newCharacter.name);
      formData.append('description', newCharacter.description);
      formData.append('game', pk);

      if (newCharacter.image) {
        formData.append('image', newCharacter.image, newCharacter.image.name);
      }

      if (newCharacter.excel_file) {
        formData.append('excel_file', newCharacter.excel_file, newCharacter.excel_file.name);
      }

      const response = await fetch(`${BASE_API_URL}/api/gameApp/character/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al crear el personaje');
      }

      const data = await response.json();
      setCharacterList(prevState => [...prevState, data]);
      handleCloseModal();
    } catch (error) {
      console.error('Error al crear el personaje:', error);
      setError('Fallo al crear el personaje');
    }
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    try {
      const formData = new FormData();
      formData.append('name', editingCharacter.name);
      formData.append('description', editingCharacter.description);
      formData.append('game', pk);

      if (editingCharacter.image instanceof File) {
        formData.append('image', editingCharacter.image, editingCharacter.image.name);
      }

      // Manejo del archivo Excel
      if (editingCharacter.excel_file instanceof File) {
        formData.append('excel_file', editingCharacter.excel_file, editingCharacter.excel_file.name);
      }

      const response = await fetch(`${BASE_API_URL}/api/gameApp/character/${editingCharacter.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el personaje');
      }

      const data = await response.json();

      // Actualiza la lista de personajes
      setCharacterList(prevState => prevState.map(character => character.id === data.id ? data : character));
      handleCloseEditModal();
    } catch (error) {
      console.error('Error al actualizar el personaje:', error);
      setError('Fallo al actualizar el personaje');
    }
  };

  const handleCloseShowModal = () => {
    setShowCharacterModal(false);
    setSelectedCharacter(null);
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
    <div className="character-list-container">
      <div className="game-header">
        <div className='game-header-title'><h1>Mis Personajes</h1></div>
        <div className="game-header-searcher">
          <input
            type="text"
            placeholder="Buscar partidas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="game-search-input"
          />
          <button className="" onClick={handleOpenModal} title="Añadir una partida">
            + Añadir
          </button>
        </div>
      </div>

      <div className="character-list-options">
        {characterList.length > 0 ? (
          characterList
          .filter(x => x.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(character => (
            <div key={character.id} className="character-link" onContextMenu={(e) => handleContextMenu(e, character)} onClick={() => { setSelectedCharacter(character); setShowCharacterModal(true); }}>
              <div className="character-card-image">
                {character.image ? (
                  <img src={constructImageUrl(character.image)} alt="Fallo al cargar la imagen" />
                ) : (
                  <div className="character-card-placeholder"></div>
                )}
                <div className="character-card-tooltip">
                  <div className="character-card-tooltip-text">{character.description}</div>
                </div>
                <div className="character-card-title">{character.name}</div>
              </div>
            </div>
          ))
        ) : (
          <p className='noCharacterList'>Aún no tienes ningún personaje. ¡Empieza creando uno!</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h2>Crear Nuevo Personaje</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Nombre:
                <input
                  type="text"
                  name="name"
                  value={newCharacter.name}
                  onChange={handleInputChange}
                  required
                  maxLength="50"
                  placeholder='Nathaniel'
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="description"
                  value={newCharacter.description}
                  onChange={handleInputChange}
                  maxLength="300"
                  placeholder='Paladín caído y algo engreído, inicia su venganza junto a un extraño grupo de héroes.'
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
                {newCharacter.imagePreview && (
                  <div>
                    <img src={newCharacter.imagePreview} alt="Vista previa" className="image-preview" />

                  </div>
                )}
              </label>
              <label>
                Ficha (Excel):
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  title=""
                  onChange={(e) => handleExcelChange(e, false)} // false = modo creación
                />
                {newCharacter.excelFileName && (
                  <div>
                    <span>{newCharacter.excelFileName}</span>
                  </div>
                )}
              </label>
              <div className="modal-buttons">
                <button onClick={() => handleDownload("Ficha_Rol-Plana.xlsx")}>Descargar Ficha Vacía</button>
                <button onClick={() => handleDownload("Ficha_Rol.xlsx")}>Descargar Ficha Con Fórmulas</button>
              </div>
              <div className="modal-buttons">
                <button type="submit">Crear</button>
                <button type="button" onClick={handleCloseModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editingCharacter && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={handleCloseEditModal}>×</button>
            <h2>Editar Personaje</h2>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <label>
                Nombre:
                <input
                  type="text"
                  name="name"
                  value={editingCharacter.name}
                  onChange={handleEditChange}
                  required
                  maxLength="50"
                  placeholder='Nathaniel'
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="description"
                  value={editingCharacter.description}
                  onChange={handleEditChange}
                  maxLength="300"
                  placeholder='Paladín caído y algo engreído, inicia su venganza junto a un extraño grupo de héroes.'

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
                {editingCharacter.imagePreview && (
                  <div>
                    <img src={editingCharacter.imagePreview} alt="Vista previa" className="image-preview" />
                  </div>
                )}
              </label>

              <label>
                Ficha (Excel):
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  title=""
                  onChange={(e) => handleExcelChange(e, true)} // true = modo edición
                />
                {(editingCharacter.excelFileName || editingCharacter.excel_file) && (
                  <div>
                    <span>
                      {editingCharacter.excelFileName
                        ? editingCharacter.excelFileName
                        : editingCharacter.excel_file.replace(`${BASE_API_URL}/media/files/rolplay/game_app/character/`, "")}
                    </span>
                  </div>
                )}
              </label>
              <div className="modal-buttons">
                <button onClick={() => handleDownload("Ficha_Rol-Plana.xlsx")}>Descargar Ficha Vacía</button>
                <button onClick={() => handleDownload("Ficha_Rol.xlsx")}>Descargar Ficha Con Fórmulas</button>
              </div>
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
          <button onClick={() => handleEdit(contextMenu.character)}>Editar</button>
          <button onClick={() => handleDelete(contextMenu.character.id)}>Eliminar</button>
        </div>
      )}

      {showCharacterModal && selectedCharacter && (
        <div className="modal-overlay" onClick={handleCloseShowModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseShowModal}>×</button>
            <h2 className="character-detail-name">{selectedCharacter.name}</h2>
            <div className="character-detail-description">
              <p>{selectedCharacter.description}</p>
            </div>
            <hr className='separador'></hr>
            {selectedCharacter.excel_file ? (
              <div className="download-button">
                <a href={selectedCharacter.excel_file} download >
                  Descargar ficha
                </a>
              </div>
            ) : (
              <p>El personaje no tiene ficha disponible.</p>
            )}

          </div>
        </div>
      )}


    </div>
  );
}
