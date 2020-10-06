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
            errors:[]
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount(){
        this.context.updateValue('title','Crear Categoría');
    }
    onSubmit (e)  {
        e.preventDefault();
        axios.post('/api/categorias', {
            nombre: this.state.nombre,
            descripcion: this.state.descripcion
        },
        { headers: { "auth-token":  localStorage.getItem("auth-token")  } }).then(()=>{
            this.setState({ redirect: "/" });
        }).catch((error)=>{
            this.setState({
                errors: error.response.data.errors,
            });
        });
    }
    onChange (e) {
        const {name,value} = e.target;
        this.setState({
            [name]:value
        });
    }
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <form onSubmit={this.onSubmit}>
            {this.state.errors.length>0 &&(
                <div className="alert alert-danger">
                    <ul>
                    {
                    this.state.errors.map(error => {
                        return(
                            <li key={error}>{error}</li>
                        )
                    })
                    }
                    </ul>
                </div>
            )}
                <h3>Crear categoría</h3>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" onChange={this.onChange} className="form-control" name="nombre" placeholder="ingrese el nombre del producto"></input>
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <input type="text" onChange={this.onChange} className="form-control" name="descripcion" placeholder="ingrese el precio del producto"></input>
                </div>
                <button className="btn btn-primary" type="submit">Crear</button> 
            </form>
        );
    }
}