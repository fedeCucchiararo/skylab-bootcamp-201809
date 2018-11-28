import React, { Component } from 'react'
import './Landing.css'
import Snackbar from '../Snackbar/Snackbar'
import GameList from '../GameList/GameList'
import logic from '../../logic'
import SearchList from '../SearchList/SearchList'
import PlayList from '../PlayList/PlayList'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"
import GameInfoModal from '../GameInfoModal/GameInfoModal'
import { CSSTransition } from 'react-transition-group'

class Landing extends Component {

    state = {
        error: null,
        allGames: [],
        ownedGames: [],
        showGameInfo: false,
        game: {},
        search: '',
        plays: [{
            "players": [
                "5bfeae6e09da63359f39aaae",
                "5bfeae7609da63359f39aab0"
            ],
            "_id": "5bfeb6f0aaa16a3679f68443",
            "game": "5bf6cdd86f870b28d6b5f5d7",
            "notes": "These are the notes",
            "__v": 0
        },
        {
            "players": [
                "5bfeae6e09da63359f39aaae",
                "5bfeae7609da63359f39aab0"
            ],
            "_id": "5bfeb6fdaaa16a3679f68444",
            "game": "5bf6cdd86f870b28d6b5f5d7",
            "notes": "These are the notes",
            "__v": 0
        }]
    }

    updateSearch = (event) => {
        this.setState({ search: event.target.value })
    }

    async componentWillMount() {

        let allGames = await logic.getAllGames()

        this.setState((prevState, props) => {
            return ({
                allGames: [...allGames.data]
            })
        })

        if (logic.loggedIn) {
            let ownedGames = await logic.getUserOwnedGames(logic._userId)

            this.setState((prevState, props) => {
                return ({
                    ownedGames: [...ownedGames.data]
                })
            })
        }
    }

    changeHandler = (event) => {
        console.log(event.target.value)
    }

    moreInfoHandler = (game) => {
        this.setState((prevState, props) => {
            return ({
                game: { ...game },
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

    mechanicsClickHandler = (mechanic) => {
        console.log(mechanic)
    }

    addOrRemoveHandler = (fromOwned, gameId) => {

        if (fromOwned) {

            logic.removeGameFromOwnedGames(gameId)
                .then(async () => {
                    let ownedGames = await logic.getUserOwnedGames(logic._userId)
                    this.setState(() => {
                        return ({
                            ownedGames: [...ownedGames.data]
                        })
                    })
                })
                .catch(err => {
                    this.setState(() => {
                        return ({
                            error: err.message
                        })
                    })
                })

        } else {

            logic.addGameToOwnedGames(gameId)
                .then(async () => {
                    let ownedGames = await logic.getUserOwnedGames(logic._userId)
                    this.setState(() => {
                        return ({
                            ownedGames: [...ownedGames.data]
                        })
                    })
                })
                .catch(err => {
                    this.setState(() => {
                        return ({
                            error: err.message
                        })
                    })
                })


        }
    }

    closeErrorSnackbarHandler = () => {
        this.setState(() => {
            return ({
                error: ''
            })
        })
    }

    goBackHandler = () => this.props.history.push('/')

    handleSignUpClick = () => this.props.history.push('/register')

    handleSignInClick = () => this.props.history.push('/login')


    render() {

        const { showGame } = this.state
        let searchQuery = this.state.search.replace(/\s+/g, '').toLowerCase()

        return (
            <div>

                {this.state.error ? <Snackbar className={'snackbar'} message={this.state.error} onCloseSnackbar={this.closeErrorSnackbarHandler} /> : null}
                <GameInfoModal onMechanicsClick={this.mechanicsClickHandler} game={this.state.game} onClose={this.closeModalHandler} onAdd={this.addHandler} show={this.state.showGameInfo} />
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
                                    {logic.loggedIn ?
                                        <li className="nav-item">
                                            <p className="nav-link" onClick={this.props.onLogoutClick}>Sign out</p>
                                        </li> :
                                        <li className="nav-item">
                                            <p className="nav-link" onClick={this.props.onLoginClick}>Sing In</p>
                                        </li>
                                    }

                                    {logic.loggedIn ?
                                        null :
                                        <li className="nav-item">
                                            <p className="nav-link" onClick={this.props.onRegisterClick}>Sign Up</p>
                                        </li>
                                    }

                                </ul>
                            </div>
                        </nav>
                        <div className='header__main'>


                            {/********        ********/}
                            {/******** Search ********/}
                            {/********        ********/}
                            <form className='header__form'>
                                <input value={this.state.search} type='text' onChange={this.updateSearch} placeholder='Search a game' />
                                <input type='submit' />
                            </form>
                            {/* {this.state.search ? <SearchPreview searchQuery={this.state.search} onAddOrRemoveClick={this.addOrRemoveHandler} fromOwned={false} onMoreInfoClick={this.moreInfoHandler} title={'Search result'} games={this.state.allGames} /> : null} */}

                            {/* <Search allGames={this.state.allGames} onChange={this.updateSearch}/> */}
                        </div>
                    </header>

                    <PlayList plays={this.state.plays}/>

                    {/** If search is not empty, show filtered games, */}
                    {this.state.search ? <SearchList loggedIn={logic.loggedIn} searchQuery={searchQuery} onAddOrRemoveClick={this.addOrRemoveHandler} fromOwned={false} onMoreInfoClick={this.moreInfoHandler} title={'Search result'} games={this.state.allGames} /> : null}

                    {/** If logged in, then show "my Games" */}
                    {logic.loggedIn ?

                        <GameList loggedIn={logic.loggedIn} onAddOrRemoveClick={this.addOrRemoveHandler} fromOwned={true} onMoreInfoClick={this.moreInfoHandler} title={'My Games'} games={this.state.ownedGames} />
                        : null}


                    {/** Show all games */}
                    <GameList loggedIn={logic.loggedIn} onAddOrRemoveClick={this.addOrRemoveHandler} fromOwned={false} onMoreInfoClick={this.moreInfoHandler} title={'All Games'} games={this.state.allGames} />

                    <footer className='footer'>
                        <h1> This is the footer </h1>
                    </footer>
                </div>
            </div>
        )
    }

}


export default withRouter(Landing)