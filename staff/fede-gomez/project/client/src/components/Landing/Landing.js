import React, { Component } from 'react'
import './Landing.css'
import Card from '../Card/Card'
import logic from '../../logic'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"
import GameInfoModal from '../GameInfoModal/GameInfoModal';

class Landing extends Component {

    state = {
        games: [],
        showGameInfo: false,
        game: {}
    }

    async componentWillMount() {

        let res = await logic.getAllGames()

        this.setState((prevState, props) => {
            return ({
                games: [...res.data]
            })
        })
    }

    changeHandler = (event) => {
        console.log(event.target.value)
    }

    moreInfoHandler = (game) => {
            this.setState((prevState, props) => {
                return ({
                    game: {...game},
                    showGameInfo: !this.state.showGameInfo
                })
            })
    }

    closeModalHandler = () => {
        this.setState((prevState, props) => {
            return ({
                showGameInfo: !this.state.showGameInfo
            })
        })
    }


    goBackHandler = () => this.props.history.push('/')

    handleSignUpClick = () => this.props.history.push('/register')

    handleSignInClick = () => this.props.history.push('/login')


    render() {
        return (
            <div>
                <GameInfoModal game={this.state.game} onClick={this.closeModalHandler} show={this.state.showGameInfo} />
                <div className='landing' >
                    <header className='header-container'>
                        <nav className="navbar navbar-expand-sm navbar-light bg-light">
                            <p className="navbar-brand">Navbar</p>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon" />
                            </button>
                            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                                <ul className="navbar-nav mr-auto mt-2 mt-sm-0">
                                    <li className="nav-item">
                                        <p className="nav-link" >BGG</p>
                                    </li>
                                    <li className="nav-item">
                                        <p className="nav-link" onClick={this.props.onLoginClick}>Sing In</p>
                                    </li>
                                    <li className="nav-item">
                                        <p className="nav-link" onClick={this.props.onRegisterClick}>Sign Up</p>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                        <div className='header__main'>
                            <form className='header__form'>
                                <input type='text' onChange={this.changeHandler} placeholder='Search a game'>
                                </input>
                                <input type='submit'>
                                </input>
                            </form>
                        </div>
                    </header>
                    <section className='main'>

                        <div className='main__cards'>
                            {
                                this.state.games.map(game => <Card onMoreInfoClick={this.moreInfoHandler} key={game._id} id={game._id} thumbnail={game.thumbnail} name={game.name} year={game.yearPublished} game={game} />)
                            }
                        </div>
                    </section>

                    <footer className='footer'>

                    </footer>
                </div>
            </div>
        )
    }

}


export default withRouter(Landing)