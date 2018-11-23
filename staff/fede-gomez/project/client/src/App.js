import React, { Component } from 'react'
import Landing from './components/Landing/Landing'
import Home from './components/Home/Home'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import logic from './logic'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom";

logic.url = 'http://localhost:5000/api'

class App extends Component {

  state = { error: null }

  registerClickHandler = () => this.props.history.push('/register')

  loginClickHandler = () => this.props.history.push('/login')

  goBackHandler = () => this.props.history.push('/')

  registerHandler = (name, surname, username, password, email) => {
    try {
      logic.registerUser(name, surname, username, password, email)
        .then(() => {
          this.setState({ error: null }, () => this.props.history.push('/login'))
        })
        .catch(err => this.setState({ error: err.message }))
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  loginHandler = (username, password) => {
    try {
        logic.login(username, password)
            .then(() =>  this.props.history.push('/home'))
            .catch(err => this.setState({ error: err.message }))
    } catch (err) {
        this.setState({ error: err.message })
    }
}

  logoutClickHandler = () => {
    logic.logout()
    this.props.history.push('/')
  }
/*
return <div>
            <Route exact path="/" render={() => !logic.loggedIn ? <Landing onRegisterClick={this.handleRegisterClick} onLoginClick={this.handleLoginClick} /> : <Redirect to="/postits" />} />
            <Route path="/register" render={() => !logic.loggedIn ? <Register onRegister={this.handleRegister} onGoBack={this.handleGoBack} /> : <Redirect to="/postits" />} />
            <Route path="/login" render={() => !logic.loggedIn ? <Login onLogin={this.handleLogin} onGoBack={this.handleGoBack} /> : <Redirect to="/postits" />} />
            {error && <Error message={error} />}

            <Route path="/postits" render={() => logic.loggedIn ? <div>
                <section><button onClick={this.handleLogoutClick}>Logout</button></section>
                <Postits />
            </div> : <Redirect to="/" />} />

        </div>
*/
  render() {
    return (
      <div className='App'>
        <Route exact path="/" render={() => <Landing onRegisterClick={this.registerClickHandler} onLoginClick={this.loginClickHandler} />} />
        <Route exact path="/home" render={() => logic.loggedIn ? <Home /> : <Redirect to="/" />} />
        <Route exact path="/register" render={() => !logic.loggedIn ? <Register onRegister={this.registerHandler} onGoBack={this.goBackHandler} /> : <Redirect to="/home" />} />
        <Route exact path="/login" render={() => !logic.loggedIn ? <Login onLogin={this.loginHandler} onGoBack={this.goBackHandler} /> : <Redirect to="/home" />} />
      </div>
    )
  }
}

export default withRouter(App)
