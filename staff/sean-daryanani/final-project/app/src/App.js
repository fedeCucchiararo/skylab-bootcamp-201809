import React, { Component } from 'react';
import './App.css';
import { Route, withRouter, Redirect, Switch } from 'react-router-dom'
import logic from './logic'
import Landing from './components/landing/Landing'
import Register from './components/register/Register'
import Login from './components/login/Login'
import Error from './components/error/Error'
import Home from './components/home/Home'
import Explore from './components/explore/Explore'
import Profile from './components/profile/Profile'
import ProjectPage from './components/project-page/ProjectPage'
import CreateMeeting from './components/create-meetings/CreateMeeting'
import Navbarpage from './components/navbar/Navbar'
import Footer from './components/footer/Footer'


logic.url = 'http://localhost:5000/api'

class App extends Component {
  state = {
    error: null,
    userId: null
  }

  componentDidMount = () => {

    this.setState({userId: logic.userId})

  }

  handleRegisterClick = () => {
    this.props.history.push('/register')
  }

  handleLoginClick = () => {
    this.props.history.push('/login')
  }

  handleSkipToLogin = () => {
    this.props.history.push('login')
    this.setState({error: null})
  }

  handleSkipToRegister = () => {
    this.props.history.push('/register')
    this.setState({error: null})
  }

  handleRegister = (name, email, username, password) => {

    try {
      logic.registerUser(name, email, username, password)

        .then(() => this.setState({ error: null }, this.props.history.push('/login')))

        .catch(err => this.setState({ error: err.message }))

    } catch (err) {

      this.setState({ error: err.message })

    }
  }

  handleLogin = (username, password) => {
    try {

      logic.authenticate(username, password)

        .then((res) => {

          this.setState({ error: null, userId: res.data.id }, this.props.history.push('/home'))
        })

        .catch(err => this.setState({ error: err.message }))

    } catch (err) {

      this.setState({ error: err.message })

    }
  }

  render() {
    const { error, userId } = this.state
    return (
      <div className="App">
      {logic.loggedIn && <Navbarpage userId={userId} />}

        <Switch>
          <Route exact path="/" render={() => !logic.loggedIn ? <Landing onRegisterClick={this.handleRegisterClick} onLoginClick={this.handleLoginClick} /> : <Redirect to="/home" />} />

          <Route path="/register" render={() => !logic.loggedIn ? <Register onRegister={this.handleRegister} onSkipToLogin={this.handleSkipToLogin} /> : <Redirect to="/home" />} />

          <Route path="/login" render={() => !logic.loggedIn ? <Login onLogin={this.handleLogin} onSkipToRegister={this.handleSkipToRegister} /> : <Redirect to="/home" />} />

          <Route path="/home" render={() => logic.loggedIn ? <Home /> : <Redirect to="/" />} />

          <Route path="/explore/:query" render={props => logic.loggedIn ? <Explore query={props.match.params.query} /> : <Redirect to="/explore" />} />

          <Route path="/explore" render={() => logic.loggedIn ? <Explore /> : <Redirect to="/" />} />

          <Route path="/project/:id" render={props => logic.loggedIn ? <ProjectPage userId={userId} id={props.match.params.id} /> : <Redirect to="/" />} />

          <Route path="/profile/:id" render={props => logic.loggedIn ? <Profile userId={userId} {...props} id={props.match.params.id} /> : <Redirect to="/" />} />

          <Route path="/create-event/:id" render={props => logic.loggedIn ? <CreateMeeting userId={userId} id={props.match.params.id} /> : <Redirect to="/" />} />
        </Switch>
        <Route path="/" render={() => <Footer />} />

        {error && <Error message={error} />}
        
      </div>
    );
  }
}

export default withRouter(App);