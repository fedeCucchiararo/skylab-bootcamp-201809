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
                <div className='loginModal-container'>
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

                    {/** Login modal */}
                    <section className="loginModal-main">
                        <h1 className="loginModal-main__title">Login</h1>
                        <form onSubmit={this.handleSubmit}>
                            <input className="loginModal-main__input" type="text" placeholder="Username" onChange={this.changeUsernameHandler} />
                            <input className="loginModal-main__input" type="password" placeholder="Password" onChange={this.changePasswordHandler} />
                            <button className='loginModal-main__button' type="submit">Login</button>
                        </form>
                        <i className="fas fa-angle-left loginModal-close" onClick={this.onCloseHandler}></i>
                        {/* <button className="loginModal-close" onClick={this.onCloseHandler}>X</button> */}
                    </section>
                </div>
            )
        } else {
            return null
        }
    }

}
export default withRouter(LoginModal)