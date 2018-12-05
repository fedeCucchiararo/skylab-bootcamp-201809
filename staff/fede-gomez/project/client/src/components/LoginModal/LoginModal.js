import React, { Component } from 'react'
import './LoginModal.css'
import logic from '../../logic'
import Snackbar from '../Snackbar/Snackbar'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"


class LoginModal extends Component {
    state = {
        username: '',
        password: '',
        error: null
    }

    changeUsernameHandler = event => {
        const username = event.target.value

        this.setState({ username })
    }

    changePasswordHandler = event => {
        const password = event.target.value

        this.setState({ password })
    }

    closeErrorSnackbarHandler = () => this.setState({ error: '' })

    onCloseHandler = () => {
        this.setState({ error: null })
        this.props.onClose()
    }

    handleSubmit = event => {
        event.preventDefault()

        const { username, password } = this.state

        this.props.onLogin(username, password)
    }

    handleSubmit = event => {
        event.preventDefault()
        const { username, password } = this.state
        logic.login(username, password)
            .then(() => {
                this.setState({
                    username: '',
                    password: '',
                    error: null
                })
                this.props.history.push('/home')
                this.props.onClose()
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
                        <h1 className="registerModal-main__title">Login</h1>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" placeholder="Username" onChange={this.changeUsernameHandler} />
                            <input type="password" placeholder="Password" onChange={this.changePasswordHandler} />
                            <button type="submit">Login</button>
                        </form>
                        <button className="registerModal-close" onClick={this.onCloseHandler}>X</button>
                    </section>
                </div>
            )
        } else {
            return null
        }
    }

}
export default withRouter(LoginModal)