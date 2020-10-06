import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';
import context from '../context';
class Home extends Component {
  static contextType = context;
  productos = [];
  constructor() {
    super();
    this.state = {
      productos : [],
      categorias: [],
      user:{
        token: undefined,
        user: undefined
      }
    }
    this.searchProductos = this.searchProductos.bind(this);
    this.searchCategorias = this.searchCategorias.bind(this);
    this.getProductos = this.getProductos.bind(this);
    this.getCategorias = this.getCategorias.bind(this);
    
  }
  componentDidMount() {
    document.title = "Inicio"
    this.getProductos();
    this.getCategorias();
  }
  searchProductos(e){
    const {value} = e.target;
    this.getProductos(value)
  }
  searchCategorias(e){
    const {value} = e.target;
    this.getCategorias(value)
  }
  deleteProducto(id){
    Axios.delete(`/api/productos/${id}`, { headers: { "auth-token": localStorage.getItem("auth-token")} })
      .then(function(res){
        this.getProductos();
      }.bind(this));
  }
  deleteCategoria(id){
    Axios.delete(`/api/categorias/${id}`, { headers: { "auth-token": localStorage.getItem("auth-token")} })
      .then(function(res){
        this.getCategorias();
      }.bind(this));
  }

  getProductos(nombre='') {
    Axios.get(`/api/productos?nombre=${nombre}`, { headers: { "auth-token": localStorage.getItem("auth-token")} })
      .then(res => {
        this.setState({productos: res.data});
      });
  }
  getCategorias(nombre='') {
    Axios.get(`/api/categorias?nombre=${nombre}`, { headers: { "auth-token": localStorage.getItem("auth-token")} })
      .then(res => {
        this.setState({categorias: res.data});
      });
  }
 
  render() {
    return(
      <div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" data-toggle="tab" href="#productos">Productos</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#categorias">Categorías</a>
          </li>
        </ul>
        <div className="tab-content">
          <div className="tab-pane active" id="productos">
            <Link className="btn btn-primary" to="/producto/crear">Crear producto</Link>
            <div>
              <label>Nombre</label>
              <input type="text" onChange={this.searchProductos}  placeholder="ingrese el nombre del producto"></input>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad en stock</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.productos.map(producto => {
                    return(
                      <tr key={producto._id}>
                        <td>
                          {producto.nombre}
                        </td>
                        <td>
                          {producto.precio}
                        </td>
                        <td>
                          {producto.stock}
                        </td>
                        <td>
                          {producto.categoria}
                        </td>
                        <td>
                        <Link to={`/producto/editar/${producto._id}`}>Editar</Link>
                        <button onClick={() => this.deleteProducto(producto._id)} className="btn btn-danger">borrar</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          <div className="tab-pane fade" id="categorias">
            <Link className="btn btn-primary" to="/categoria/crear">Crear categoría</Link>
            <div>
              <label>Nombre</label>
              <input type="text" onChange={this.searchCategorias}  placeholder="ingrese el nombre de la categoría"></input>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.categorias.map(categoria => {
                    return(
                      <tr key={categoria._id}>
                        <td>
                          {categoria.nombre}
                        </td>
                        <td>
                          {categoria.descripcion}
                        </td>
                        <td>
                          <Link to={`/categoria/editar/${categoria._id}`}>Editar</Link>
                          <button onClick={() => this.deleteCategoria(categoria._id)} className="btn btn-danger">borrar</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;