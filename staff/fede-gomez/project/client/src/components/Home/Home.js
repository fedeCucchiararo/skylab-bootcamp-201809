import React, { Component } from 'react'
import './Home.css'
import Card from '../Card/Card'
import logic from '../../logic'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"
import GameInfo from '../GameInfo/GameInfo';


class Home extends Component {

    state = {
        userId: '',
        ownedGames: []
    }

    async componentWillMount() {

        let res = await logic.getUserOwnedGames(logic._userId)
        
        this.setState((prevState, props) => {
            
            return ({
                ownedGames: [...res.data]
            })
        })
    }

    gameClickHandler = (id) => {
        console.log(id)
    }

    changeHandler = (event) => {
        console.log(event.target.value)
    }

    goBackHandler = () => this.props.history.push('/')

    logoutHandler = () => {

        return this.props.history.push('/register')

    }

    render() {
        return (
            <div className='Home' >
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
                            this.state.ownedGames.map(game => <Card onGameClick={this.gameClickHandler} key={game._id} id={game._id} thumbnail={game.thumbnail} name={game.name} year={game.yearPublished} />)
                        }
                    </div>
                </section>
                <footer className='footer'>

                </footer>
            </div>
        )
    }
}

export default withRouter(Home)