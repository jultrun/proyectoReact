import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, useParams } from "react-router-dom";
import { withRouter } from "react-router";

class EditarProducto extends Component {
     componentDidMount(){
       
        if(this.props.match.params.id){
            const res = axios.get(`/api/productos/${this.props.match.params.id}`);
            res.then(function (response) {
                this.setState({
                    id: response.data._id,
                    nombre: response.data.nombre,
                    precio: response.data.precio,
                });
              }.bind(this))
              .catch(function (error) {
                // handle error
                console.log(error);
              })
              .then(function () {
                // always executed
              });
        }
    }
    constructor() {
        super();
       
        this.state = {
            redirect: null,
            nombre : '',
            precio : '',
            _id: ''
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
            
                <h3>Editar producto</h3>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={this.state.nombre} onChange={this.onChange} className="form-control" name="nombre" placeholder="ingrese el nombre del producto"></input>
                </div>
                <div className="form-group">
                    <label>precio</label>
                    <input type="number" value={this.state.precio} onChange={this.onChange} className="form-control" name="precio" placeholder="ingrese el precio del producto"></input>
                </div>
                <button type="submit">Editar</button> 
            </form>
        )
     }
}
export default withRouter(EditarProducto);