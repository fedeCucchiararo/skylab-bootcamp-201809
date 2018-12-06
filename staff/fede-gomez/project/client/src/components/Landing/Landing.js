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

                {!this.state.showLoginModal && !this.state.showRegisterModal ? <div className="landing-container">
                    <div className="action-box">
                        <div className="content">
                            <div className="content__title">
                                Boardgame Hub
                            </div>
                            <div className="content__text">
                                Discover new games, manage your collection, and register your play sessions.
                            </div>
                            <div className='content__button' onClick={this.loginClickHandler}> Login </div>
                            <div className='content__button' onClick={this.registerClickHandler}> Register </div>
                        </div>
                    </div>
                </div> :
                null}
            </div>
        )

    }
}

export default Landing