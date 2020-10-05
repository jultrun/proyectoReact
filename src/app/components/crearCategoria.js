import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import context from '../context';
export default class CrearCategoria extends Component {
    static contextType = context;
    constructor() {
        super();
        this.state = {
            redirect: null,
            nombre : '',
            descripcion : '',
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
      }
    onSubmit (e)  {
        e.preventDefault();
        axios.post('/api/categorias', {
            nombre: this.state.nombre,
            descripcion: this.state.precio
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
                <h3>Crear categoria</h3>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" onChange={this.onChange} className="form-control" name="nombre" placeholder="ingrese el nombre del producto"></input>
                </div>
                <div className="form-group">
                    <label>descripcion</label>
                    <input type="text" onChange={this.onChange} className="form-control" name="precio" placeholder="ingrese el precio del producto"></input>
                </div>
                <button type="submit">Crear</button> 
            </form>
        )
     }
}