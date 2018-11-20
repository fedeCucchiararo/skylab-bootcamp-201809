import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"

class Register extends Component {

    state = {
        name: '',
        surname: '',
        username: '',
        password: '',
        email: ''
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

    handleSubmit = event => {
        event.preventDefault()

        const { name, surname, username, password, email } = this.state

        this.props.onRegister(name, surname, username, password, email)
    }

    render() {
        return (
                <div>
                    <h1>Register</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" placeholder="Name" onChange={this.handleNameChange} />
                        <input type="text" placeholder="Surname" onChange={this.handleSurnameChange} />
                        <input type="text" placeholder="Username" onChange={this.handleUsernameChange} />
                        <input type="password" placeholder="Password" onChange={this.handlePasswordChange} />
                        <input type="text" placeholder="eMail" onChange={this.handleEmailChange} />
                        <button type="submit">Register</button> <a href="#" onClick={this.props.onGoBack}>back</a>
                    </form>
                </div>
        )
    }
}

export default withRouter(Register)