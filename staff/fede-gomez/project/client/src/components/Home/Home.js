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

                <header className='header-container'>
                    <div className="header__title">Boardgame Hub</div>
                    <div className="header__logout" onClick={this.props.onLogoutClick}>
                        <i class="fas fa-sign-out-alt"></i>
                    </div>
                </header>


                <main className="home-main">

                    <div className="main-navbar">
                        <div className={'main-navbar__item ' + (this.state.activeTab === 'allGames' ? 'active' : '')} onClick={() => this.navbarClickHandler('allGames')}>All Games</div>
                        <div className={'main-navbar__item ' + (this.state.activeTab === 'myGames' ? 'active' : '')} onClick={() => this.navbarClickHandler('myGames')}>My Games</div>
                        <div className={'main-navbar__item ' + (this.state.activeTab === 'myPlays' ? 'active' : '')} onClick={() => this.navbarClickHandler('myPlays')}>My Plays</div>
                    </div>


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

                    {this.state.activeTab === 'allGames' ?

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
                        : null
                    }


                    {this.state.activeTab === 'allGames' && this.state.page < this.state.pages ?
                        <h4 className="gamelist__loadMore" onClick={this.loadMore}>Load more games...</h4>
                        : null
                    }


                    {this.state.activeTab === 'myGames' ?

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
                        : null
                    }
                    {this.state.activeTab === 'myPlays' ?

                        <PlayList
                            onShowPlayPictures={this.showPlayPicturesHandler}
                            onPictureUpload={this.pictureUploadHandler}
                            onPlayDelete={this.playDeleteHandler}
                            plays={this.state.plays}
                            searchQuery={searchQuery}
                        />

                        : null
                    }

                </main>

                <footer className='footer'>
                    <div>
                        <span>Boardgame Hub Project</span>
                        <i class="far fa-copyright"></i>
                        <span>Federico Gómez</span>
                    </div>
                    <div>
                        <i class="fab fa-linkedin"></i>
                        <i class="fab fa-github-square"></i>
                        <i class="fab fa-facebook"></i>
                        <i class="fab fa-twitter-square"></i>
                    </div>
                </footer>
            </div>
        )
    }

}


export default withRouter(Home)