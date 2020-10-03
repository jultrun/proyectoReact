import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from "./components/home";
import CrearProducto from './components/crearProducto';
import EditarProducto from './components/editarPorducto';

class App extends Component {

  render() {
    return (
      <Router>
        <div className="container-fluid">
        <nav className="navbar navbar-dark bg-dark">

        </nav>
          {/*rutas*/}
          <Switch>
            <Route exact path="/">
             <Home />
            </Route>
            <Route path="/crear">
              <CrearProducto />
            </Route>
            <Route path="/editar/:id">
              <EditarProducto />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}
export default App;