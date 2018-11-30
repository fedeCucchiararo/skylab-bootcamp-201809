import React from 'react'
import './Play.css'

const Play = (props) => {

    let count = 1;
    return (
        <div className='play-card'>
            <img className='play-card__image' src={props.play.game.thumbnail}></img>
            <h4>{props.play.game.name}</h4>
            <ul>
                {props.play.players.map(player => <li>Player {count++}: {player.name}</li>)}
            </ul>
            <p>{props.play.notes}</p>
        </div>
    )
}

export default Play