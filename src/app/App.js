import React, { Component  } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect} from "react-router-dom";

import Home from "./components/home";
import CrearProducto from './components/crearProducto';
import EditarProducto from './components/editarProducto';
import Axios from 'axios';
import Login from './components/login';
import Register from './components/register';
import context from './context';
import CrearCategoria from './components/crearCategoria';
import EditarCategoria from './components/editarCategoria';
import Nav from './components/Nav';
import PrivateRoute from './components/privateRoute';

class App extends Component {
  state = {
    isLoggedIn : false,
    usuario : {
      token: undefined,
      nombre: undefined,
    }
  }
  updateValue = (key, val) => {
    this.setState({[key]: val});
  }
  render() {
    return ( 
      <Router>
        <context.Provider value={{usuario:this.state.usuario,isLoggedIn:this.state.isLoggedIn, updateValue: this.updateValue}}>
          <div className="container-fluid">
            <Nav exact path='/'/>
            <main className="col p-3">
            {/*rutas*/}
            <Switch>
              <PrivateRoute path="/" exact={true} component={Home}/>
              <PrivateRoute path="/producto/crear" component={CrearProducto}/>
              <PrivateRoute path="/producto/editar/:id" component={EditarProducto}/>
              <PrivateRoute path="/categoria/crear" component={CrearCategoria}/>
              <PrivateRoute path="/categoria/editar/:id" component={EditarCategoria}/>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
            </Switch>
            </main>
          </div>
        </context.Provider>
      </Router>
    )
  }
}

export default App;