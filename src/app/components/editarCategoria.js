import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, useParams } from "react-router-dom";
import { withRouter } from "react-router";
import context from '../context';

class EditarCategoria extends Component {
    static contextType = context;
    componentDidMount(){
        this.context.updateValue('title','Editar categoría');
        if(this.props.match.params.id){
            const res = axios.get(`/api/categorias/${this.props.match.params.id}`,{ headers: { "auth-token":  localStorage.getItem("auth-token")  } });
            res.then(function (response) {
                this.setState({
                    id: response.data._id,
                    nombre: response.data.nombre,
                    descripcion: response.data.descripcion,
                });
            }.bind(this))
            .catch(function (error) {
            this.setState({ redirect: "../" });
            }.bind(this));
        }
    }
    constructor() {
        super();
        this.state = {
            redirect: null,
            nombre : '',
            descripcion : '',
            id: '',
            errors:[]
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
      }
    onSubmit (e)  {
        e.preventDefault();
        console.log(this.state.id)
        axios.put(`/api/categorias/${this.state.id}`, {
            nombre: this.state.nombre,
            descripcion: this.state.descripcion,
        },{ headers: { "auth-token":  localStorage.getItem("auth-token")  } }
        ).then(()=>{
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
        })
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
                <h3>Editar categoria</h3>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={this.state.nombre} onChange={this.onChange} className="form-control" name="nombre" placeholder="ingrese el nombre del producto"></input>
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <input type="text" value={this.state.descripcion} onChange={this.onChange} className="form-control" name="precio" placeholder="ingrese el precio del producto"></input>
                </div>
                <button className="btn btn-primary" type="submit">Editar</button> 
            </form>
        );
    }
}
export default withRouter(EditarCategoria);