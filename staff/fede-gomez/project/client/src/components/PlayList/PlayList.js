import React from 'react'
import './PlayList.css'
import Play from '../Play/Play'
import { CSSTransition } from 'react-transition-group'

const PlayList = (props) => {

    return (
        <div className='playlist-container'>
            {props.plays.map(play => <Play play={play}/>)}
        </div>
    )
}

export default PlayList