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
      user:{
        token: undefined,
        user: undefined
      }
    }
    this.search = this.search.bind(this);
    this.getProductos = this.getProductos.bind(this);
    
  }
  componentDidMount() {
    document.title = "Productos"
    this.getProductos();
  }
  search(e){
    const {value} = e.target;
    this.getProductos(value)
  }
  delete(id){
    console.log(id)
  }

  getProductos(nombre='') {
    Axios.get(`/api/productos?nombre=${nombre}`, { headers: { "auth-token": localStorage.getItem("auth-token")} })
      .then(res => {
        this.state.productos=res.data;
        this.setState({productos: res.data});
      });
  }
 
  render() {
    return (
      <div>
      <Link className="btn btn-primary" to="/crear">Crear producto</Link>
      <div>
      <label>Nombre</label>
        <input type="text" onChange={this.search}  placeholder="ingrese el nombre del producto"></input>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>precio</th>
              <th>en stock</th>
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
                    <Link to={`/editar/${producto._id}`}>Editar</Link>
                    <button onClick={() => this.delete(producto._id)} className="btn btn-danger">borrar</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Home;