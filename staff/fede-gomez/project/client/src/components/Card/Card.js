import React from 'react'
import './Card.css'
import styled from 'styled-components'


const Card = (props) => {

    let fromOwned = props.fromOwned

    return (
        <div className='card-container'>
            <div className="card bg-dark text-white">
                <div >
                    <img className="front" src={props.game.thumbnail} alt="Card image" />
                </div>
                <div className="back">
                    <h5 className="back__title">{props.game.name}</h5>
                    <p className="back__text">{props.game.yearPublished}</p>
                    <p className="back__text">{props.id}</p>
                    <button className='button card-button' onClick={() => props.onMoreInfoClick(props.game)}>
                        More Info
                    </button>
                    <button className='button card-button' onClick={fromOwned ? () => props.onAddOrRemoveClick(fromOwned, props.game._id) : () => props.onAddOrRemoveClick(fromOwned, props.game._id)}>
                        {props.buttonText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card