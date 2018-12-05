import React, { Component } from 'react'
import Landing from './components/Landing/Landing'
import Home from './components/Home/Home'
import Register from './components/Register/Register'
import Snackbar from './components/Snackbar/Snackbar'
import Login from './components/Login/Login'
import logic from './logic'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom";

logic.url = 'http://localhost:5000/api'

class App extends Component {

  logoutClickHandler = () => {
    logic.logout()
    this.props.history.push('/')
  }

  render() {

    return (
      <div className='App'>
        <Route exact path="/" render={() =>
          !logic.loggedIn ?
            <Landing
              onRegisterClick={this.registerClickHandler}
              onLoginClick={this.loginClickHandler} />
            : <Redirect to="/home" />}
        />
        <Route exact path="/home" render={() =>
          logic.loggedIn ?
            <Home
              onLogoutClick={this.logoutClickHandler}
            />
            : <Redirect to="/" />}
        />
      </div>
    )
  }
}

export default withRouter(App)
