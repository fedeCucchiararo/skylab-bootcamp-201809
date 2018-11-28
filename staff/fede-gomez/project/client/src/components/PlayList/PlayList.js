import React from 'react'
import './PlayList.css'
import { CSSTransition } from 'react-transition-group'

const PlayList = (props) => {

    return (
        <div>
            {props.plays.map(play => <p>{play.notes}</p>)}
        </div>
    )
}

export default PlayList