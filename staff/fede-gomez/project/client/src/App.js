import React, { Component } from 'react'
// import Register from './components/Register'
// import Login from './components/Login'
import Landing from './components/Landing/Landing'
import Home from './components/Home/Home'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
// import logic from './logic'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom";

class App extends Component {

  registerClickHandler = () => this.props.history.push('/register')

  loginClickHandler = () => this.props.history.push('/login')

  goBackHandler = () => this.props.history.push('/')

  registerHandler = (name, surname, username, password, email) => {
    try {
      console.log(name, surname, username, password, email)
    } catch (err) {
      console.log(err.message)
    }
  }

  loginHandler = (username, password) => {
    try {
      console.log(username, password)
    } catch (err) {
      console.log(err.message)
    }
  }

  logoutClickHandler = () => {
    // TODO
    this.props.history.push('/')
}

  render() {
    return (
      <div className='App'>
        <Route exact path="/" render={() => <Landing onRegisterClick={this.registerClickHandler} onLoginClick={this.loginClickHandler} />} />
        <Route exact path="/home" render={() => <Home />} />
        <Route exact path="/register" render={() => <Register onRegister={this.registerHandler} onGoBack={this.goBackHandler} />} />
        <Route exact path="/login" render={() => <Login onLogin={this.loginHandler} onGoBack={this.goBackHandler} />} />
      </div>
    )
  }
}

export default withRouter(App)
