import React, { Component } from 'react'
import './PlaySaveModal.css'
import SelectPlayer from '../SelectPlayer/SelectPlayer'
import logic from '../../logic'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"

class PlaySaveModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notes: '',
            date: null,
            users: [],
            gameId: '',
            players: [],
            playerCount: 0,
            picture: ''
        }
    }

    playerSelectHandler = (event) => {


        let index = event.target.id
        let userId = event.target.value

        let players = this.state.players
        players[index] = userId

        this.setState(() => {
            return ({
                players: players
            })
        })
    }

    playerCountChangeHandler = async (event) => {


        let playerCount = parseInt(event.target.value)
        let players = this.state.players

        if (playerCount > players.length) {
            let diff = playerCount - players.length
            for (let i = 1; i <= diff; i++) {
                players.push(1)
            }
        } else if (players.length > playerCount) {

            players.splice(players.length - (players.length - playerCount))
        }

        players[0] = logic._userId

        this.setState({
            players: players
        })
    }

    componentWillReceiveProps(props) {
        logic.getAllUsers()
            .then(users => {
                this.setState(() => {
                    return (
                        {
                            users: users
                        }
                    )
                })
            })
        this.setState({ gameId: props.game.id })
    }

    handleNotesChange = event => {
        const notes = event.target.value

        this.setState({ notes })
    }

    handleDateChange = event => {
        const date = event.target.value

        this.setState({ date })
    }

    handlePictureChange = event => {
        const picture = event.target.value

        this.setState({ picture })
    }

    handlePlayersChange = event => {
        const players = event.target.value

        this.setState({ players })
    }

    checkDuplicity = array => {
        let counts = [];
        for (var i = 0; i <= array.length; i++) {
            if (counts[array[i]] === undefined) {
                counts[array[i]] = 1
            } else {
                return true;
            }
        }
        return false;
    }

    equalsOne = (elem) => {
        return elem === 1
    }

    onCloseHandler = () => {
        this.setState(({
            notes: '',
            date: null,
            gameId: '',
            players: [],
            users: [],
            playerCount: 0
        }))
        this.props.onClose()
    }

    handleSubmit = event => {
        event.preventDefault()

        const { notes, date, players, gameId } = this.state

        if (!date) {
            this.props.onError('Please insert a valid date')
        } else if (notes.length === 0) {
            this.props.onError('Please insert some notes')
        } else if (!players.length || players.some(this.equalsOne)) {
            this.props.onError('Please choose valid players')
        } else if (this.checkDuplicity(players)) {
            this.props.onError('You cannot choose the same player more than once')
        } else {
            this.props.onPlaySave(notes, date, players, gameId)
            // this.props.onError('Play succesfully registered')
            this.props.onClose()
            this.setState(() => {
                return ({
                    notes: '',
                    date: null,
                    users: [],
                    gameId: '',
                    players: [],
                    playerCount: 0,
                    picture: ''
                })
            })
        }
    }

    render() {
        if (this.props.show) {

            /** before the return we set the min and max number of players based on the game itself.
             *  This will affect the selectable number of players below
             */
            let num = 1
            const maxPlayerCount = []
            for (let i = this.props.game.minPlayers; i <= this.props.game.maxPlayers; i++) {
                maxPlayerCount.push(i)
            }

            return (
                <div className='playSaveModal-container'>
                    <section className="playSaveModal-head">

                        <button className="playSaveModal-close" onClick={this.onCloseHandler}>X</button>
                        <div className='playSaveModal__title'>{this.props.game.name}</div>
                        
                            <form className="playSaveModal__form" id='form' onSubmit={this.handleSubmit}>
                                <label>
                                <span>Select Date:</span>
                                    <input type="date" placeholder="Date" onChange={this.handleDateChange} />
                                </label>
                                <textarea rows="10" type="text" placeholder="Notes" onChange={this.handleNotesChange} />
                                <select onChange={this.playerCountChangeHandler}>
                                    <option default={true} value={0}>Number of players</option>
                                    {maxPlayerCount.map((value, index) => <option value={value}>{value}</option>)}
                                </select>
                                <SelectPlayer
                                    players={this.state.players}
                                    playerCount={this.state.playerCount}
                                    users={this.state.users}
                                    onChange={this.playerSelectHandler}
                                    thisPlayer={logic._userId}
                                />
                                <button type="submit">Save Play</button>
                            </form>

                    </section>
                </div>
            )
        } else {
            return null
        }
    }
}

export default withRouter(PlaySaveModal)