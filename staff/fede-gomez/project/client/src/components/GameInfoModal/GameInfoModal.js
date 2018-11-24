import React, { Component } from 'react'
import Card from '../Card/Card'
import logic from '../../logic'
import './GameInfoModal.css'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"

const GameInfoModal = (props) => {

    // const showHideClassName = props.show ? "modal display-block" : "modal display-none"

    if (props.show) {
        return (
            <div className='gameInfoModal'>

                <section className="gameInfoModal-main">
                    <h1 className='gameInfoModal-title'>{props.game.name}</h1>
                    <p className='gameInfoModal-description'>{props.game.description}</p>
                    <div>
                        <p className='gameInfoModal-subtitle'>Mechanics:</p>
                        {props.game.mechanics.map(mechanic => <div className='gameInfoModal-mechanics'>{mechanic}</div>)}
                    </div>
                    <button className="gameInfoModal-close" onClick={props.onClick}>X</button>
                </section>
            </div>
        )
    } else {
        return null
    }



}

export default withRouter(GameInfoModal)