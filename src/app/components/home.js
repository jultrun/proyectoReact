import React, { Component } from 'react';
import { Link } from "react-router-dom";
class Home extends Component {
  constructor() {
    super();
    this.state = {
      productos : []
    }
    
  }
  componentDidMount() {
    document.title = "Productos"
    this.getProductos();
  }

  getProductos() {
    fetch('/api/productos')
      .then(res => res.json())
      .then(data => {
        this.setState({productos: data});
        console.log(this.state.productos  );
      });
  }
 
  render() {
    return (
      <div>
      <Link className="btn btn-primary" to="/crear">Crear producto</Link>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>precio</th>
              <th>stock</th>
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