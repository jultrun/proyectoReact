import React from 'react';
import {
  Route,
  Redirect
} from "react-router-dom";
import context from '../context';
import Axios from 'axios';
export default class PrivateRoute extends React.Component {
  static contextType = context;
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: true,
      isLoggedIn: false
    };
  }
  componentWillMount() {
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      localStorage.setItem("auth-token", "");
      token = "";
    }
    Axios.post(
      "/api/token",
      null,
      { headers: { "auth-token": token } }
    )
      .then(function (res) {
        if (res.data) {
          this.setState({
            isLoading: false,
            isLoggedIn: true,
          });
          this.context.updateValue('usuario', {
            token: res.data.token,
            nombre: res.data.nombre,
            id: res.data.id
          });
          this.context.updateValue('isLoggedIn', true);
        } else {
          this.setState({
            isLoading: false,
            isLoggedIn: false,
          });
          this.context.updateValue('usuario', {
            token: undefined,
            nombre: undefined
          });
          this.context.updateValue('isLoggedIn', false);

        }
      }.bind(this))
      .catch(function () {
      });
  }
  render() {
    return this.state.isLoading ? null :
      this.state.isLoggedIn ?
        <Route path={this.props.path} component={this.props.component} exact={this.props.exact} /> :
        <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />
  }
}
