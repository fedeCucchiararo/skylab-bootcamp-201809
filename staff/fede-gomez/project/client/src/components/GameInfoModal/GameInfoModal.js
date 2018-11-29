import React, { Component } from 'react'
import logic from '../../logic'
import './GameInfoModal.css'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"

const GameInfoModal = (props) => {
// https://boardgamegeek.com/boardgame/31260/agricola
    if (props.show) {
        return (
            <div className='gameInfoModal-container'>
                <section className="gameInfoModal-main">
                    <div className="gameInfoModal-main__image-container">
                        <img className="gameInfoModal-main__image" src={props.game.image}></img>
                    </div>
                    <div>
                        <h1 className='gameInfoModal-main__title'>{props.game.name}</h1>
                        <p className='gameInfoModal-main__description'>{props.game.description}</p>
                    </div>
                    <div>
                        <p className='gameInfoModal-subtitle'>Mechanics:</p>
                        {props.game.mechanics.map(mechanic => <div onClick={() => { props.onMechanicsClick(mechanic) }} className='gameInfoModal-mechanics'>{mechanic}</div>)}
                    </div>
                    <button className="gameInfoModal-close" onClick={props.onClose}>X</button>
                </section>
            </div>
        )
    } else {
        return null
    }
}

export default withRouter(GameInfoModal)