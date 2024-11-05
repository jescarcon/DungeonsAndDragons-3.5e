import './NotFound.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function NotFound() {
    const navigate = useNavigate();
    const [animationClass, setAnimationClass] = useState("");

    useEffect(() => {
        setAnimationClass("animate");
    }, []);

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className={`NotFoundPage-container ${animationClass}`}>
            <h1>🧙‍♂️ ¡Portal Equivocado! 404 🧙‍♂️</h1>
            <p className="NotFoundPage-text">Si has llegado hasta aquí, significa que has lanzado un colgante a un portal o has usado el que no era.</p>
            <div className="NotFoundPage-emoji">🎲🔥🐉</div>
            <p>Has acabado entrando en el universo de bolsillo de cierto mago loco aunque remilgado con acento Galo.</p>
            <p>Te abre un portal de vuelta mientras no deja de gritar cosas sin sentido: </p>
            La Çilla d' Três Patas! ¡Ixvalis me da muxo miedo! GRIHALNI
            <button onClick={handleGoHome} className="NotFoundPage-button">Página de Inicio</button>
        
        </div>
    );
}

export default NotFound;
