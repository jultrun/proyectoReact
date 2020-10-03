import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";

export default class CrearProducto extends Component {
    constructor() {
        super();
        this.state = {
            redirect: null,
            nombre : '',
            precio : '',
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
      }
    onSubmit (e)  {
        e.preventDefault();
        axios.post('/api/productos', {
            nombre: this.state.nombre,
            precio: this.state.precio,
            stock:0
        }).then(()=>{
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
                <button type="submit">Crear</button> 
            </form>
        )
     }
}