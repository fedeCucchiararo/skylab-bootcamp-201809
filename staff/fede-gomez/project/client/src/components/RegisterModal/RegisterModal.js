import React, { Component } from 'react'
import './RegisterModal.css'
import logic from '../../logic'
import Snackbar from '../Snackbar/Snackbar'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"



class RegisterModal extends Component {

  state = {
    name: '',
    surname: '',
    username: '',
    password: '',
    email: '',
    error: null
  }

  handleNameChange = event => {
    const name = event.target.value

    this.setState({ name })
  }

  handleSurnameChange = event => {
    const surname = event.target.value

    this.setState({ surname })
  }

  handleUsernameChange = event => {
    const username = event.target.value

    this.setState({ username })
  }

  handlePasswordChange = event => {
    const password = event.target.value

    this.setState({ password })
  }

  handleEmailChange = event => {
    const email = event.target.value

    this.setState({ email })
  }

  closeErrorSnackbarHandler = () => this.setState({ error: '' })

  handleSubmit = event => {
    event.preventDefault()
    const { name, surname, username, password, email } = this.state
    logic.registerUser(name, surname, username, password, email)
      .then(() => {
        this.setState({
          name: '',
          surname: '',
          username: '',
          password: '',
          email: ''
        })
        this.props.onSuccesfullyRegistered()
      })
      .catch(err => this.setState({ error: err.message }))
  }

  render() {

    if (this.props.show) {
      return (
        <div className='registerModal-container'>
          {/** Snackbar */}
          {
            this.state.error ?
              <Snackbar
                onCloseSnackbar={this.closeErrorSnackbarHandler}
                message={this.state.error}
                className={'snackbar'}
              />
              : null
          }

          {/** Register modal */}
          <section className="registerModal-main">
            <h1 className="registerModal-main__title">Register</h1>
            <input type="text" placeholder="Name" onChange={this.handleNameChange} />
            <input type="text" placeholder="Surname" onChange={this.handleSurnameChange} />
            <input type="text" placeholder="Username" onChange={this.handleUsernameChange} />
            <input type="password" placeholder="Password" onChange={this.handlePasswordChange} />
            <input type="text" placeholder="eMail" onChange={this.handleEmailChange} />
            <p onClick={this.handleSubmit}>Register</p>
            <button className="registerModal-close" onClick={this.props.onClose}>X</button>
          </section>
        </div>
      )
    } else {
      return null
    }
  }
}

export default withRouter(RegisterModal)