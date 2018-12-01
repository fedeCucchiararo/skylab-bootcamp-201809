import React, { Component } from 'react'
import './Landing.css'
import Snackbar from '../Snackbar/Snackbar'
import GameList from '../GameList/GameList'
import logic from '../../logic'
import PlayList from '../PlayList/PlayList'
import PlaySaveModal from '../PlaySaveModal/PlaySaveModal'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"
import GameInfoModal from '../GameInfoModal/GameInfoModal'
import { CSSTransition } from 'react-transition-group'
import { Tabs } from "@yazanaabed/react-tabs";

class Landing extends Component {

    state = {
        error: null,
        allGames: [],
        ownedGames: [],
        showGameInfo: false,
        showPlaySaveModal: false,
        game: {},
        search: '',
        plays: []
    }

    updateSearch = (event) => {
        this.setState({ search: event.target.value })
    }

    async componentDidMount() {

        let allGames = await logic.getAllGames()

        this.setState((prevState, props) => {
            return ({
                allGames: [...allGames.data]
            })
        })

        if (logic.loggedIn) {
            let ownedGames = await logic.getUserOwnedGames(logic._userId)
            let plays = await logic.getUserPlays(logic._userId)
            
            this.setState(() => {
                return ({
                    ownedGames: [...ownedGames.data],
                    plays: [...plays]
                })
            })
        }
    }

    changeHandler = (event) => {
        console.log(event.target.value)
    }

    moreInfoHandler = (game) => {
        this.setState(() => {
            return ({
                game: { ...game },
                showGameInfo: !this.state.showGameInfo
            })
        })
    }

    savePlayClickHandler = (game) => {
        this.setState(() => {
            return ({
                game: { ...game },
                showPlaySaveModal: !this.state.showPlaySaveModal
            })
        })
    }

    closePlaySaveModalHandler = () => {
        this.setState(() => {
            return ({
                showPlaySaveModal: !this.state.showPlaySaveModal
            })
        })
    }

    closeModalHandler = () => {
        this.setState(() => {
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

    savePlayHandler = (notes, date, players, gameId) => {
        // try {
        //     logic.registerUser(name, surname, username, password, email)
        //         .then(() => {
        //             this.setState({ error: null }, () => this.props.history.push('/login'))
        //         })
        //         .catch(err => this.setState({ error: err.message }))
        // } catch (err) {
        //     this.setState({ error: err.message })
        // }
        console.log(notes, date, players, gameId)
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

        let searchQuery = this.state.search.replace(/\s+/g, '').toLowerCase()

        return (
            <div>

                {this.state.error ?
                    <Snackbar
                        onCloseSnackbar={this.closeErrorSnackbarHandler}
                        message={this.state.error}
                        className={'snackbar'}
                    />
                    : null}

                <GameInfoModal
                    onMechanicsClick={this.mechanicsClickHandler}
                    onClose={this.closeModalHandler}
                    show={this.state.showGameInfo}
                    onAdd={this.addHandler}
                    game={this.state.game}
                />

                <PlaySaveModal
                    onClose={this.closePlaySaveModalHandler}
                    show={this.state.showPlaySaveModal}
                    onSavePlay={this.savePlayHandler}
                    game={this.state.game}
                />

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
                                            <p className="nav-link" onClick={this.handleSignInClick}>Sing In</p>
                                        </li>
                                    }

                                    {logic.loggedIn ?
                                        null :
                                        <li className="nav-item">
                                            <p className="nav-link" onClick={this.handleSignUpClick}>Sign Up</p>
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

                    <Tabs
                        activeTab={{
                            id: "tab1"
                        }}
                    >
                        <Tabs.Tab id="tab1" title='All Games'>
                            {/** Show all games */}
                            <GameList
                                onSavePlayClick={this.savePlayClickHandler}
                                onAddOrRemoveClick={this.addOrRemoveHandler}
                                onMoreInfoClick={this.moreInfoHandler}
                                games={this.state.allGames}
                                searchQuery={searchQuery} 
                                loggedIn={logic.loggedIn}
                                title={'All Games'}
                                fromOwned={false}
                            />
                        </Tabs.Tab>

                        {logic.loggedIn ?
                            <Tabs.Tab id="tab2" title='My Games'>
                                {/** If logged in, then show "my Games" */}
                                <GameList
                                    onSavePlayClick={this.savePlayClickHandler}
                                    onAddOrRemoveClick={this.addOrRemoveHandler}
                                    onMoreInfoClick={this.moreInfoHandler}
                                    games={this.state.ownedGames}
                                    searchQuery={searchQuery}
                                    loggedIn={logic.loggedIn}
                                    title={'My Games'}
                                    fromOwned={true}
                                />
                            </Tabs.Tab>
                            : null
                        }
                        {logic.loggedIn ?
                            <Tabs.Tab id="tab3" title="My Plays">
                                <PlayList plays={this.state.plays} />
                            </Tabs.Tab>
                            : null
                        }
                    </Tabs>

                    <footer className='footer'>
                        <h1> This is the footer </h1>
                    </footer>
                </div>
            </div>
        )
    }

}


export default withRouter(Landing)