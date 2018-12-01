import React, { Component } from 'react'
import './PlaySaveModal.css'
import SelectPlayer from '../SelectPlayer/SelectPlayer'
import logic from '../../logic'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"

class PlaySaveModal extends Component {
    // https://boardgamegeek.com/boardgame/31260/agricola

    constructor(props) {
        super(props);
        this.state = {
            notes: '',
            date: new Date(),
            users: [],
            gameId: '',
            players: [],
            playerCount: []
        }
    }

    componentWillMount() {
        logic.getAllUsers()
        .then(users => {
            this.setState(() => {
                return (
                    { users: users }
                )
            })
        })
    }

    playerSelectHandler = (event) => {

        let index = event.target.id
        let userId = event.target.value

        console.log(event.target.id)
        console.log(event.target.value)

        let players = this.state.players
        players[index] = userId

        console.log('Players array (state):', players)

        this.setState(() => {
            return ({
                players: players
            })
        })
    }

    playerCountChangeHandler = event => {
        let playerCount = parseInt(event.target.value)
        let players = new Array(playerCount)
        for (let i = 0; i < players.length; i++) {
            players[i] = i
        }
        this.setState({ players: players })
    }

    componentWillReceiveProps(props) {
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

    handlePlayersChange = event => {
        const players = event.target.value

        this.setState({ players })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { notes, date, players, gameId } = this.state

        this.props.onSavePlay(notes, date, players, gameId)
    }

    render() {
        if (this.props.show) {

            const maxPlayerCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

            return (
                <div className='playSaveModal-container'>
                    <section className="playSaveModal-head">
                        <div className="playSaveModal-head__image-container">
                            <img className="playSaveModal-head__image" src={this.props.game.image}></img>
                        </div>
                        <div>
                            <h1 className='playSaveModal-head__title'>{this.props.game.name} / ID: {this.state.gameId}</h1>
                        </div>
                        <button className="playSaveModal-close" onClick={this.props.onClose}>X</button>
                        <form id='form' onSubmit={this.handleSubmit}>
                            {/* <input type="text" placeholder="Name" onChange={this.handleNameChange} /> */}
                            <input type="date" placeholder="Date" onChange={this.handleDateChange} />
                            <input type="text" placeholder="Notes" onChange={this.handleNotesChange} />

                            <select onChange={this.playerCountChangeHandler}>
                                {maxPlayerCount.map((value, index) => <option default={index === 0 ? true : false} value={value}>{value}</option>)}
                            </select>

                            {/* <SelectPlayer
                                players={this.state.players}
                                onChange={this.playerSelectHandler.bind(this)}
                                users={this.state.users}
                            /> */}

                            {this.state.players.map((elem, index) =>
                                <select id={index} onChange={this.playerSelectHandler}>
                                    <option default='true' value={0}>Choose a Player</option>
                                    {this.state.users.map(user => <option value={user.id}>{user.username}</option>)}
                                </select>
                            )}


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