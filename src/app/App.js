import React, { Component,useContext  } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  Link
} from "react-router-dom";

import Home from "./components/home";
import CrearProducto from './components/crearProducto';
import EditarProducto from './components/editarProducto';
import Axios from 'axios';
import Login from './components/login';
import Register from './components/register';
import context from './context';
import CrearCategoria from './components/crearCategoria';
import EditarCategoria from './components/editarCategoria';

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
            {/*rutas*/}
            <main className="col p-3">
            <Switch>
              <PrivateRoute path="/"
                exact={true}
                component={Home}
              />
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

function Nav({ children, ...rest }) {
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

class PrivateRoute extends React.Component {
  static contextType = context;
  constructor(props, context) {
    super(props, context);
    this.state = {
        isLoading: true,
        isLoggedIn: false
    };
  }
  componentWillMount(){
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      localStorage.setItem("auth-token", "");
      token = "";
    }
    Axios.post(
      "/api/token",
      null,
      { headers: { "auth-token": token } }
    )
    .then(function (res) {
      if (res.data) {
        this.setState({
          isLoading: false, 
          isLoggedIn: true,
        });
        this.context.updateValue('usuario', {
          token : res.data.token,
          nombre : res.data.nombre,
          id: res.data.id
        });
        this.context.updateValue('isLoggedIn',true);
      }else{
        this.setState({
          isLoading: false, 
          isLoggedIn: false,
        });
        this.context.updateValue('usuario', {
          token : undefined,
          nombre :undefined
        });
        this.context.updateValue('isLoggedIn',false);
        
      }
    }.bind(this))
    .catch(function (error) {
    });
  }
  render() {
    return this.state.isLoading ? null:
      this.state.isLoggedIn ?
      <Route path={this.props.path} component={this.props.component} exact={this.props.exact}/> :
      <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />
  }
}

export default App;