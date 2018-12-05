import React, { Component } from 'react'
import logic from '../../logic'
import './GameInfoModal.css'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"

const GameInfoModal = (props) => {
    // https://boardgamegeek.com/boardgame/31260/agricola
    if (props.show) {

        let designersCount = props.game.designers.length

        return (
            <div className='gameInfoModal-container'>
                <section className="gameInfoModal-main">
                    <div className="gameInfoModal-main__image-container">
                        <img className="gameInfoModal-main__image" src={props.game.image}></img>
                    </div>
                    <div>
                        <h1 className='gameInfoModal-main__title'>{props.game.name}</h1>
                        <p>Designed by:</p>
                        {
                            props.game.designers.map((designer, index) =>
                                designersCount === 1 ?
                                    <span>{designer}</span> :
                                    (index !== designersCount - 1) ?
                                        <span>{designer}, </span> :
                                        <span>and {designer}</span>
                            )

                        }
                        <p className='gameInfoModal-main__description'>{props.game.description}</p>
                    </div>
                    <div>
                        <p className='gameInfoModal-subtitle'>Mechanics:</p>
                        {props.game.mechanics.map(mechanic => <div onClick={() => { props.onMechanicsClick(mechanic) }} className='gameInfoModal-mechanics'>{mechanic}</div>)}
                    </div>
                    <p className="gameInfoModal__bggRating">BGG Rating: {props.game.bggRating}</p>
                    <div>
                        <i class="fa fa-clock-o" aria-hidden="true"></i>
                        <span>{props.game.playingTime}</span>
                    </div>
                    <div>
                        <i class="fa fa-users" aria-hidden="true"></i>
                        <span>{props.game.minPlayers} - {props.game.maxPlayers}</span>
                    </div>
                    <a target="_blank" rel="noopener noreferrer" href={`https://boardgamegeek.com/boardgame/${props.game.bggId}/`}>More info on BoardGameGeek</a>
                    <button className="gameInfoModal-close" onClick={props.onClose}>X</button>
                </section>
            </div>
        )
    } else {
        return null
    }
}

export default withRouter(GameInfoModal)