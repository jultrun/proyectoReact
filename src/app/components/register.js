import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, withRouter } from "react-router-dom";
import context from '../context';

class Register extends Component {
    static contextType = context;
    constructor() {
        super();
        this.state = {
            redirect: null,
            email: '',
            password: '',
            nombre: '',
            passwordCheck: '',
            errors: []
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount(){
        this.context.updateValue('title','Registro');
    }
    onSubmit(e) {
        e.preventDefault();
        axios.post(`/api/register`, {
            email: this.state.email,
            password: this.state.password,
            nombre: this.state.nombre,
            passwordCheck: this.state.passwordCheck,
        }).then(function (res) {
            this.props.history.push('/login');
        }.bind(this))
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors,
                });
            });
    }
    onChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <form onSubmit={this.onSubmit}>
                {this.state.errors.length > 0 && (
                    <div className="alert alert-danger">
                        <ul>
                            {
                                this.state.errors.map(error => {
                                    return (
                                        <li key={error}>{error}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                )}
                <h3>Registro</h3>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" onChange={this.onChange} className="form-control" name="email" placeholder="ingrese el email"></input>
                </div>
                <div className="form-group">
                    <label>nombre</label>
                    <input type="text" onChange={this.onChange} className="form-control" name="nombre" placeholder="ingrese el email"></input>
                </div>
                <div className="form-group">
                    <label>password</label>
                    <input type="password" onChange={this.onChange} className="form-control" name="password" placeholder="ingrese la contraseña"></input>
                </div>
                <div className="form-group">
                    <label>confirme la password</label>
                    <input type="password" onChange={this.onChange} className="form-control" name="passwordCheck" placeholder="ingrese la contraseña"></input>
                </div>
                <button type="submit">Inicia Sección</button>
            </form>
        )
    }
}
export default withRouter(Register);