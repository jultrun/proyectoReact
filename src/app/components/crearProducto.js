import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import context from '../context';
export default class CrearProducto extends Component {
    static contextType = context;
    constructor() {
        super();
        this.state = {
            redirect: null,
            nombre : '',
            precio : '',
            categoria : null,
            categorias:[]
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
      }
      componentDidMount(){
        const res = axios.get(`/api/categorias`,{ headers: { "auth-token":  localStorage.getItem("auth-token")  } });
        res.then(function (response) {
            this.setState({
                categorias: response.data,
            });
        }.bind(this))
        .catch(function (error) {
        }
        );
}
    onSubmit (e)  {
        e.preventDefault();
        axios.post('/api/productos', {
            nombre: this.state.nombre,
            precio: this.state.precio,
            stock:0,
            categoria:this.state.categoria,
        },
        { headers: { "auth-token":  localStorage.getItem("auth-token")  } }).then(()=>{
            this.setState({ redirect: "/" });
        }).catch((error)=>{
        })
        
    }
    onChange (e) {
        const {name,value} = e.target;
        this.setState({
            [name]:value
        })
    }
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <form onSubmit={this.onSubmit}>
                <h3>Crear producto</h3>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" onChange={this.onChange} className="form-control" name="nombre" placeholder="ingrese el nombre del producto"></input>
                </div>
                <div className="form-group">
                    <label>precio</label>
                    <input type="number" onChange={this.onChange} className="form-control" name="precio" placeholder="ingrese el precio del producto"></input>
                </div>
                <div className="form-group">
                    <label>Categoria</label>
                    <select onChange={this.onChange} name="categoria" className="form-control">
                        <option value="">Seleccione la categoría</option>
                        {
                        this.state.categorias.map(categoria => {
                            return(
                                <option key={categoria._id} value={categoria._id}>{categoria.nombre}</option>
                            )
                        })
                        }
                        
                    </select>
                </div>
                <button type="submit">Crear</button> 
            </form>
        )
     }
}