import React, { useState, useEffect } from 'react';
import './Profile.css';
import { BASE_API_URL } from '../constants';

export default function Profile() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const token = localStorage.getItem('access');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/authApp/me/update/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                setFormData({
                    username: data.username,
                    email: data.email,
                    password: '', // Por seguridad
                });
            })
            .catch(err => {
                console.error(err);
                setError("Error al cargar el perfil");
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setPasswordError('');

        // Verificar si el campo de la contraseña está vacío
        if (!formData.password) {
            setPasswordError('La contraseña es obligatoria');
            setIsLoading(false);
            return;
        }

        const dataToSend = { ...formData };
        if (!dataToSend.password) {
            delete dataToSend.password;
        }

        fetch('http://127.0.0.1:8000/api/authApp/me/update/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData)
        })
            .then(res => {
                if (!res.ok) throw new Error("No se pudo actualizar");
                return res.json();
            })
            .then(data => {
                alert("Perfil actualizado correctamente");
                localStorage.removeItem('access'); // Borra el localStorage
                window.location.href = '/'; // Redirige al home
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Error al actualizar el perfil");
                setIsLoading(false);
            });
    };

    return (
        <div className="profile-container">
            <h2 className="profile-header">Editar Perfil</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
                <label>Usuario</label>
                <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
                <label>Email</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <label>Contraseña</label>
                <input
                    type="password"
                    value={formData.password}
                    placeholder="********"
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                {passwordError && <p className="error-message">{passwordError}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
            {error && <p className="profile-error">{error}</p>}
        </div>
    );
}
