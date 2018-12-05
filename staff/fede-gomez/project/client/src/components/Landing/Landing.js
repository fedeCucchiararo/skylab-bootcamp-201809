import React from 'react'
import './Landing.css'
import logic from '../../logic'

import Snackbar from '../Snackbar/Snackbar'
import RegisterModal from '../RegisterModal/RegisterModal'
import LoginModal from '../LoginModal/LoginModal'

class Landing extends React.Component {

    state = {
        error: '',
        showRegisterModal: false,
        showLoginModal: false
    }

    /** it should make the RegisterModal appear */
    registerClickHandler = () => this.setState({ showRegisterModal: !this.state.showRegisterModal })

    /** it should make the LoginModal appear */
    loginClickHandler = () => this.setState({ showLoginModal: !this.state.showLoginModal })

    closeRegisterModalHandler = () => this.setState({ showRegisterModal: false })

    closeLoginModalHandler = () => this.setState({ showLoginModal: false })

    succesfullyRegisteredHandler = () => this.setState({ showLoginModal: true })

    closeErrorSnackbarHandler = () => {
        this.setState(() => {
            return ({
                error: ''
            })
        })
    }

    render() {

        return (
            <div className='landing-container'>
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

                {/** Register Modal */}
                <RegisterModal
                    onClose={this.closeRegisterModalHandler}
                    show={this.state.showRegisterModal}
                    onSuccesfullyRegistered = {this.succesfullyRegisteredHandler}
                />

                {/** Login Modal */}
                <LoginModal
                    onClose={this.closeLoginModalHandler}
                    show={this.state.showLoginModal}
                />

                <heading className='landing-head'>
                    <h1> Landing Titel </h1>
                </heading>
                <main className='landing-main'>
                    <div className='landing-main__button' onClick={this.loginClickHandler}> Login </div>
                    <div className='landing-main__button' onClick={this.registerClickHandler}> Register </div>
                </main>
                <footer className='landing-footer'>
                </footer>
            </div>
        )

    }
}

export default Landing