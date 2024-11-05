import React, { useState } from "react";
import Form from "../Form/Form";
import "./Login.css"; // Asegúrate de importar tus estilos CSS aquí
import { BASE_API_URL, ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function Login() {
  const [error, setError] = useState("");

  const handleFormSubmit = async (formData) => {
    const { username, password } = formData;

    try {
      const response = await fetch(`${BASE_API_URL}/api/authApp/token/get/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      const data = await response.json();

      // Guarda los tokens en el almacenamiento local
      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);

      // Puedes redirigir al usuario a la página principal o a otra página
      window.location.href = "/"; // Redirige a la página principal después del inicio de sesión

    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="LoginPage-Container">
      <Form route="/api/authApp/token/get/" method="login" onSubmit={handleFormSubmit} />
      {error && <p>{error}</p>}

      <div>
        ¿No tienes una cuenta? <a href="/register">Regístrate</a>
      </div>
    </div>
  );
}

export default Login;
