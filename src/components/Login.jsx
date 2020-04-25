import React, { useState, useCallback } from 'react';
import { auth, db } from '../firebase.js';
import { withRouter } from 'react-router-dom';

const Login = (props) => {
  // Validação de input
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(null);

  const [esRegistro, setEsRegistro] = useState(true); // Para o botao que muda a tela de login para registro

  const procesarDatos = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      //console.log('Ingrese Email');
      setError('Ingrese Email');
      return;
    }

    if (!pass.trim()) {
      //console.log('Ingrese Password');
      setError('Ingrese Password');

      return;
    }
    if (pass.length < 6) {
      //console.log('Password de 6 carácteres o más');
      setError('Password de 6 carácteres o más');

      return;
    }

    setError(null);
    console.log('Pasando todas las validaciones');

    if (esRegistro) {
      registrar();
    } else {
      login();
    }
  };

  const login = useCallback(async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, pass);
      console.log(res.user);
      setEmail('');
      setPass('');
      setError(null);
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/invalid-email') {
        setError('Email no válido');
      }

      if (error.code === 'auth/user-not-found') {
        setError('Usuario no está cadastrado');
      }

      if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta');
      }
    }
  }, [email, pass]);

  const registrar = useCallback(async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, pass);
      console.log(res.user);
      await db.collection('usuarios').doc(res.user.email).set({
        email: res.user.email,
        uid: res.user.uid,
      });

      setEmail('');
      setPass('');
      setError(null);
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/invalid-email') {
        setError('Email no válido');
      }
      if (error.code === 'auth/email-already-in-use') {
        setError('Email ya cadastrado');
      }
    }
  }, [email, pass]);

  return (
    <div className="mt-5">
      <h3 className="text-center">
        {esRegistro ? 'Registro de usuarios' : 'Login de acceso'}
      </h3>
      <hr />
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-xl-4">
          <form onSubmit={procesarDatos}>
            {error && <div className="alert alert-danger">{error}</div>}
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Ingrese un email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Ingrese un password"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
            />
            <button className="btn btn-dark btn-lg btn-block" type="submit">
              {esRegistro ? 'Registrarse' : 'Acceder'}
            </button>
            <button
              className="btn btn-info btn-sm btn-block"
              type="button"
              onClick={() => setEsRegistro(!esRegistro)}
            >
              {esRegistro ? 'Ya estas registrado?' : 'No tienes cuenta?'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
