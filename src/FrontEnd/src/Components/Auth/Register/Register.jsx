import React from 'react';
import Form from "../Form/Form";
import "./Register.css"; // Importa los estilos CSS del RegisterPage

function Register() {
    return (
        <div className="RegisterPage-Container">
           <Form route="/api/authApp/register/" method="register" />
            <p>¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a></p>
        </div>
    );
}

export default Register;
