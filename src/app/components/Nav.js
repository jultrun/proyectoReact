import {
    useHistory,
    Link
  } from "react-router-dom";
import React, { useContext  } from 'react';
import context from '../context';

export default function Nav({ children }) {
    const { usuario,isLoggedIn,updateValue } = useContext(context);
    const history = useHistory();
    const logout = () => {
      updateValue('usuario',{
        token: undefined,
        nombres: undefined,
      });
      updateValue('isLoggedIn',true);
      localStorage.setItem("auth-token", "");
      history.push('/login')
    };
    return(
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <div className="mx-auto order-0">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
                <span className="navbar-toggler-icon"></span>
            </button>
        </div>
        <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
            <ul className="navbar-nav ml-auto">
            {!isLoggedIn ? (
              <>
              <li className="nav-item">
                    <Link className="nav-link" to="/register">Registro</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Iniciar session</Link>
                </li></>
            ):<>
            
                <li className="nav-item">
                    <span className="nav-link" to="/login">{usuario.nombre}</span>
                </li>
                <li className="nav-item">
                    <span className="nav-link" onClick={logout}>salir</span>
                </li>
                </>
            }              
            </ul>
        </div>
      </nav>
    )
  }