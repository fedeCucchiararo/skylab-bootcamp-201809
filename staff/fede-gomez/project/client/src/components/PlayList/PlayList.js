import React from 'react'
import './PlayList.css'
import { CSSTransition } from 'react-transition-group'

const PlayList = (props) => {

    return (
        <div>
            {props.plays.map(play => {
                return (
                    <div>
                        <h4>{play.game.name}</h4>
                        <p>{play.notes}</p>
                        <ul>
                            {play.players.map(player => <li>Player1: {player.name}</li>)}
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}

export default PlayList