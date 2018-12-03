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

/** Pagination */

import Countries from 'countries-api';

import Pagination from '../Pagination/Pagination';
import CountryCard from '../CountryCard/CountryCard';


class Landing extends Component {

    state = {
        error: null,
        allGames: [],
        ownedGames: [],
        showGameInfo: false,
        showPlaySaveModal: false,
        game: {},
        search: '',
        plays: [],
        allCountries: [],
        currentGames: [],
        currentPage: null,
        totalPages: null
    }


    async componentDidMount() {

        let allGames = await logic.getAllGames()

        this.setState((prevState, props) => {
            return ({
                allGames: [...allGames.data],
                allCountries: [...allGames.data]
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

    onPageChanged = data => {
        const { allCountries } = this.state;
        const { currentPage, totalPages, pageLimit } = data;

        const offset = (currentPage - 1) * pageLimit;
        const currentGames = allCountries.slice(offset, offset + pageLimit);

        this.setState({ currentPage, currentGames, totalPages });
    }

    updateSearch = (event) => {
        this.setState({ search: event.target.value })
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

    playSaveErrorHandler = err => {
        this.setState(() => {
            return ({
                error: err
            })
        })
    }

    playSaveHandler = (notes, date, players, gameId) => {

        logic.registerPlay(notes, date, players, gameId)
            .then(async (res) => {
                let plays = await logic.getUserPlays(logic._userId)
                this.setState(() => {
                    return ({
                        error: res.message,
                        plays: [...plays]
                    })
                })
            })
            .catch(err => this.setState({ error: err.message }))
    }

    playDeleteHandler = (playId) => {

        logic.deletePlay(playId)
            .then(async (res) => {
                let plays = await logic.getUserPlays(logic._userId)
                this.setState(() => {
                    return ({
                        error: res.message,
                        plays: [...plays]
                    })
                })
            })
            .catch(err => this.setState({ error: err.message }))
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

        const { allCountries, currentGames, currentPage, totalPages } = this.state;
        const totalCountries = allCountries.length;

        if (totalCountries === 0) return null;

        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();

        let searchQuery = this.state.search.replace(/\s+/g, '').toLowerCase()

        return (
            <div>

                {
                    this.state.error ?
                        <Snackbar
                            onCloseSnackbar={this.closeErrorSnackbarHandler}
                            message={this.state.error}
                            className={'snackbar'}
                        />
                        : null
                }

                < GameInfoModal
                    onMechanicsClick={this.mechanicsClickHandler}
                    onClose={this.closeModalHandler}
                    show={this.state.showGameInfo}
                    onAdd={this.addHandler}
                    game={this.state.game}
                />

                <PlaySaveModal
                    onClose={this.closePlaySaveModalHandler}
                    show={this.state.showPlaySaveModal}
                    onPlaySave={this.playSaveHandler}
                    game={this.state.game}
                    onError={this.playSaveErrorHandler}
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
                                <PlayList onPlayDelete={this.playDeleteHandler} plays={this.state.plays} />
                            </Tabs.Tab>
                            : null
                        }
                    </Tabs>

                    <footer className='footer'>
                        <h1> This is the footer </h1>
                    </footer>
                </div>

                { /** Pagination */}

                <div className="container mb-5">
                    <div className="row d-flex flex-row py-5">

                        <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
                            <div className="d-flex flex-row align-items-center">

                                <h2 className={headerClass}>
                                    <strong className="text-secondary">{totalCountries}</strong> Games
                                </h2>

                                {currentPage && (
                                    <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                                        Page <span className="font-weight-bold">{currentPage}</span> / <span className="font-weight-bold">{totalPages}</span>
                                    </span>
                                )}

                            </div>

                            <div className="d-flex flex-row py-4 align-items-center">
                                <Pagination totalRecords={totalCountries} pageLimit={5} pageNeighbours={1} onPageChanged={this.onPageChanged} />
                            </div>
                        </div>

                        {currentGames.map(game => <CountryCard key={game.id} game={game} loggedIn={logic.loggedIn} fromOwned={false}/>)}

                    </div>
                </div>
            </div>
        )
    }

}


export default withRouter(Landing)