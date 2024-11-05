import React, { useState } from "react";
import tokenApi from "../js/tokenApi";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, USERNAME } from "../../constants";
import logopng from '/Main/logo.png';
import "./Form.css"; // Importa los estilos CSS del formulario

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const name = method === "login" ? "Inicia Sesión" : "Crea una Cuenta";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const data = method === "register" ? { username, password, email } : { username, password };

      const res = await tokenApi.post(route, data);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem(USERNAME, username);
        navigate("/home"); // Cambia la redirección a la ruta deseada
      } else {
        navigate("/login");
      }
    } catch (error) {
      const errorMessage = error.response && error.response.data
        ? error.response.data.detail || "Ha ocurrido un error"
        : "Ha ocurrido un error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-form-container">

      <div className="form-header" >
        <h1>{name}</h1>
        <h3>{name === "Inicia Sesión" ? 'Coge una silla y arrímate al fuego' : '¿Nuevo en estas tierras? ¡Únete a que esperas!'}</h3>
        <Link to="/" title="Ir a la página principal">
          <img className="logo-form" src={logopng} alt="DnD Logo" />
        </Link>
      </div>

      <div className="form-container">

        <form onSubmit={handleSubmit} >
          <div className="etiqueta"><label>Nombre de usuario:</label></div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ej: El Noveno"
            required
          />
          {name === "Crea una Cuenta" ? (
            <div className="etiqueta">
              <label>Correo electrónico:</label>
              <input
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dullanhorse@querabia.pec"
                required
              />
            </div>
          ) : null}

          <div className="etiqueta"><label>Contraseña:</label></div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ej: SillaDe3Patas"
            required
          />
          <button type="submit" disabled={loading}>
            {name === "Inicia Sesión" ? 'Entrar' : 'Unirse'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>

  );
}

export default Form;
