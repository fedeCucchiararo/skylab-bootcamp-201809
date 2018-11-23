import React from 'react'
import './Card.css'
import styled from 'styled-components'


const Card = (props) => {

    return (
        <div className='card-container'>
            <div className="card bg-dark text-white">
                <div >
                    <img className="front" src={props.thumbnail} alt="Card image" />
                </div>
                <div className="back">
                    <h5 className="back__title">{props.name}</h5>
                    <p className="back__text">{props.year}</p>
                    <p className="back__text">{props.id}</p>
                    <button onClick={() => props.onGameClick(props.id)}>
                        More Info
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card