import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, useParams } from "react-router-dom";
import { withRouter } from "react-router";

class EditarProducto extends Component {
    componentDidMount(){
        if(this.props.match.params.id){
            const res = axios.get(`/api/productos/${this.props.match.params.id}`,{ headers: { "auth-token":  localStorage.getItem("auth-token")  } });
            res.then(function (response) {
                this.setState({
                    id: response.data._id,
                    nombre: response.data.nombre,
                    precio: response.data.precio,
                    stock: response.data.stock,
                    descripcion: response.data.descripcion,
                    categoria: response.data.categoria
                });
              }.bind(this))
              .catch(function (error) {
                this.setState({ redirect: "../" });
              }.bind(this));
            axios.get(`/api/categorias`,{ headers: { "auth-token":  localStorage.getItem("auth-token")  } })
            then(function (response) {
                this.setState({
                    categorias: response.data,
                });
            }.bind(this))
            .catch(function (error) {}
            );
        }
    }
    constructor() {
        super();
        this.state = {
            redirect: null,
            nombre : '',
            precio : '',
            stock: '',
            descripcion: '',
            categoria : null,
            categorias:[],
            errors:[]
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
      }
    onSubmit (e)  {
        e.preventDefault();
        axios.put(`/api/productos/${this.state.id}`, {
            nombre: this.state.nombre,
            precio: this.state.precio,
            stock: this.state.stock,
            descripcion: this.state.descripcion,
            categoria: this.state.categoria
        },{ headers: { "auth-token":  localStorage.getItem("auth-token")  } }
        ).then(()=>{
            this.setState({ redirect: "/" });
        }).catch((error)=>{
            this.setState({
                errors: error.response.data.errors,
            });
        })
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
                <h3>Editar producto</h3>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={this.state.nombre} onChange={this.onChange} className="form-control" name="nombre" placeholder="ingrese el nombre del producto"></input>
                </div>
                <div className="form-group">
                    <label>precio</label>
                    <input type="number" value={this.state.precio} onChange={this.onChange} className="form-control" name="precio" placeholder="ingrese el precio del producto"></input>
                </div>
                <div className="form-group">
                    <label>Cantidad en stock</label>
                    <input type="number" value={this.state.stock} onChange={this.onChange} className="form-control" name="stock" placeholder="ingrese la cantidad de producto en stock"></input>
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <input type="text" value={this.state.descripcion} onChange={this.onChange} className="form-control" name="descripcion" placeholder="ingrese la descripción del producto"></input>
                </div>
                <div className="form-group">
                    <label>Categoria</label>
                    <select value={this.state.categoria||''} onChange={this.onChange} name="categoria" className="form-control">
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
                <button type="submit">Editar</button> 
            </form>
        );
    }
}
export default withRouter(EditarProducto);