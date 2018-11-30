import React, { Component } from 'react'
import './PlayRegisterModal.css'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"

class PlayRegisterModal extends Component {
    // https://boardgamegeek.com/boardgame/31260/agricola

    constructor(props) {
        super(props);
        this.state = {
            notes: '',
            date: new Date(),
            players: [],
            gameId: ''
        }
    }

    componentWillReceiveProps() {
        this.setState({ gameId: this.props.game.id })
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

    render() {
        if (this.props.show) {
            return (
                <div className='playRegisterModal-container'>
                    <section className="playRegisterModal-head">
                        <div className="playRegisterModal-head__image-container">
                            <img className="playRegisterModal-head__image" src={this.props.game.image}></img>
                        </div>
                        <div>
                            <h1 className='playRegisterModal-head__title'>{this.props.game.name} / ID: {this.state.gameId}</h1>
                        </div>
                        <button className="playRegisterModal-close" onClick={this.props.onClose}>X</button>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" placeholder="Name" onChange={this.handleNameChange} />
                            <input type="text" placeholder="Surname" onChange={this.handleSurnameChange} />
                            <input type="text" placeholder="Username" onChange={this.handleUsernameChange} />
                            <input type="password" placeholder="Password" onChange={this.handlePasswordChange} />
                            <input type="text" placeholder="eMail" onChange={this.handleEmailChange} />
                            <button type="submit">Register</button> <a href="#" onClick={this.props.onGoBack}>back</a>
                        </form>
                    </section>
                </div>
            )
        } else {
            return null
        }
    }
}

export default withRouter(PlayRegisterModal)