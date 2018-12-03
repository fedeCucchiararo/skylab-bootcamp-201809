import React from 'react'
import './Play.css'
import { CSSTransition } from 'react-transition-group'


const Play = (props) => {

    let count = 1;
    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={1000}
            classNames='fade'
        >
            <div className='play-card'>
                <img className='play-card__image' src={props.play.game.thumbnail}></img>
                <h4>{props.play.game.name}</h4>
                <ul>
                    {props.play.players.map(player => <li>Player {count++}: {player.name}</li>)}
                </ul>
                <p>{props.play.notes}</p>
                <p className="play-card__delete" onClick={() => props.onPlayDelete(props.play.id)}> Delete Play </p>
            </div>
        </CSSTransition>
    )
}

export default Play