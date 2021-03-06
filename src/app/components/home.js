import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
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
    this.context.updateValue('title','Inicio');
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
    if(confirm('Desea borrar el producto?')) {
      Axios.delete(`/api/productos/${id}`, { headers: { "auth-token": localStorage.getItem("auth-token")} })
      .then(function(res){
        this.getProductos();
      }.bind(this));
    }
    
  }
  deleteCategoria(id){
    if(confirm('Desea borrar la categoría?')) {
      Axios.delete(`/api/categorias/${id}`, { headers: { "auth-token": localStorage.getItem("auth-token")} })
      .then(function(res){
        this.getCategorias();
      }.bind(this));
    }
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
            <div className="row">
              <div className="col-6">
                <Link className="btn btn-primary" to="/producto/crear">Crear producto</Link>
              </div>
              <div className="col-4">
                <input type="text" onChange={this.searchProductos}  placeholder="ingrese el nombre del producto" className="form-control mr-sm-2"></input>
              </div>
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
                          <Link to={`/producto/editar/${producto._id}`} title="Editar">
                            <FontAwesomeIcon icon={faPencilAlt} />
                          </Link>&nbsp;&nbsp; 
                          <FontAwesomeIcon className="text-danger" title="Borrar" onClick={() => this.deleteProducto(producto._id)} icon={faTrashAlt} />
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          <div className="tab-pane fade" id="categorias">
            <div className="row">
              <div className="col-6">
                <Link className="btn btn-primary" to="/categoria/crear">Crear categoría</Link>
              </div>
              <div className="col-4">
                <input type="text" onChange={this.searchCategorias}  placeholder="ingrese el nombre de la categoría" className="form-control mr-sm-2"></input>
              </div>
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
                          <Link to={`/categoria/editar/${categoria._id}`}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                          </Link>
                          <FontAwesomeIcon className="text-danger" onClick={() => this.deleteCategoria(categoria._id)} icon={faTrashAlt} />
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