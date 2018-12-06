import React, { Component } from 'react'
import './Home.css'
import Snackbar from '../Snackbar/Snackbar'
import GameList from '../GameList/GameList'
import logic from '../../logic'
import PlayList from '../PlayList/PlayList'
import PlaySaveModal from '../PlaySaveModal/PlaySaveModal'
import PlayPicturesModal from '../PlayPicturesModal/PlayPicturesModal'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"
import GameInfoModal from '../GameInfoModal/GameInfoModal'
import { CSSTransition } from 'react-transition-group'


const GAMES_PER_PAGE = 5

class Home extends Component {

    state = {
        error: null,
        allGames: [],
        ownedGames: [],
        showGameInfo: false,
        showPlaySaveModal: false,
        showPlayPicturesModal: false,
        playPictures: [],
        game: {},
        search: '',
        plays: [],
        currentGames: [],
        currentPage: null,
        totalPages: null,
        page: 1,
        pages: null,
        activeTab: 'allGames'
    }

    async componentDidMount() {

        let res = await logic.getAllGamesWithPagination(1, GAMES_PER_PAGE)

        this.setState(() => {
            return ({
                page: 1,
                pages: res.data.paginationData.pages,
                allGames: [...res.data.games]
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

    showPlayPicturesHandler = async (playId) => {
        let playPictures = await logic.getPlayPictures(playId)
        if (playPictures.length) {
            this.setState(() => {
                return ({
                    playPictures: playPictures,
                    showPlayPicturesModal: !this.state.showPlayPicturesModal
                })
            })
        } else {
            this.setState(() => {
                return ({
                    error: 'There are no pictures for this gameplay'
                })
            })
        }
    }

    closePlaySaveModalHandler = () => {
        this.setState(() => {
            return ({
                showPlaySaveModal: !this.state.showPlaySaveModal
            })
        })
    }

    closePlayPicturesModalHandler = () => {
        this.setState(() => {
            return ({
                showPlayPicturesModal: !this.state.showPlayPicturesModal
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

    // pictureUploadHandler = event => {
    //     logic.addPictureToPlay(event.target.files[0], '5c069a7e25a4963363ac9e89')
    //         .then((res) => {
    //             debugger
    //         })
    //         .catch(err => this.setState({ error: err.message }))
    // }

    pictureUploadHandler = (event, playId) => {

        let file = event.target[0].files[0]
        logic.addPictureToPlay(file, playId)
            .then(res => {
                this.setState(() => {
                    return ({
                        error: res.message
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
                        // error: res.message,
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

    loadMore = async () => {

        const { page, allGames } = this.state
        let nextData = await logic.getAllGamesWithPagination(page + 1, GAMES_PER_PAGE)

        allGames.push(...nextData.data.games)

        this.setState(() => {

            return ({
                page: nextData.data.paginationData.page,
                allGames: [...allGames]
            })
        })
    }

    goBackHandler = () => this.props.history.push('/')

    handleSignUpClick = () => this.props.history.push('/register')

    handleSignInClick = () => this.props.history.push('/login')

    navbarClickHandler = (tab) => this.setState({ activeTab: tab })


    render() {

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
                    onPlaySave={this.playSaveHandler}
                    game={this.state.game}
                    onError={this.playSaveErrorHandler}
                    onPictureUpload={this.pictureUploadHandler}
                />

                <PlayPicturesModal
                    onClose={this.closePlayPicturesModalHandler}
                    show={this.state.showPlayPicturesModal}
                    playPictures={this.state.playPictures}
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
                        </div>
                    </header>

                    {/********        ********/}
                    {/******** Search ********/}
                    {/********        ********/}
                    <input
                        className="filter_input"
                        value={this.state.search}
                        type='text'
                        onChange={this.updateSearch}
                        placeholder='type here to filter...'
                    />

                    <div className="main-navbar">
                        <div className="main-navbar__item" onClick={() => this.navbarClickHandler('allGames')}>All Games</div>
                        <div className="main-navbar__item" onClick={() => this.navbarClickHandler('myGames')}>My Games</div>
                        <div className="main-navbar__item" onClick={() => this.navbarClickHandler('myPlays')}>My Plays</div>
                    </div>

                    {this.state.activeTab === 'allGames' ?
                        <CSSTransition
                            in={true}
                            appear={true}
                            timeout={300}
                            classNames='fade'
                        >
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
                        </CSSTransition> : null
                    }


                    {this.state.activeTab === 'allGames' && this.state.page < this.state.pages ?
                        <h4 className="gamelist__loadMore" onClick={this.loadMore}>Load more games...</h4>
                        : null
                    }


                    {this.state.activeTab === 'myGames' ?

                        <CSSTransition
                            in={true}
                            appear={true}
                            timeout={300}
                            classNames='fade'
                        >
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
                        </CSSTransition>
                        : null
                    }
                    {this.state.activeTab === 'myPlays' ?

                        <CSSTransition
                            in={true}
                            appear={true}
                            timeout={300}
                            classNames='fade'
                        >
                            <PlayList
                                onShowPlayPictures={this.showPlayPicturesHandler}
                                onPictureUpload={this.pictureUploadHandler}
                                onPlayDelete={this.playDeleteHandler}
                                plays={this.state.plays}
                                searchQuery={searchQuery}
                            />
                        </CSSTransition>
                        : null
                    }

                </div>

                <footer className='footer'>
                    <h1> This is the footer </h1>
                </footer>
            </div>
        )
    }

}


export default withRouter(Home)