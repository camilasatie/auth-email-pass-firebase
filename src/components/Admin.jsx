import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { withRouter } from 'react-router-dom';

function Admin(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      console.log('existe un usuario');
      setUser(auth.currentUser);
    } else {
      console.log('no existe usuario');
      props.history.push('./login');
    }
  }, [props.history]);

  return (
    <div>
      <h2>Ruta protegida</h2>
      {user && <h3>{user.email}</h3>}
    </div>
  );
}

export default withRouter(Admin);
