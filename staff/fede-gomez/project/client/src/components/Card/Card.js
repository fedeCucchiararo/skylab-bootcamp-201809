import React from 'react'
import './Card.css'
import styled from 'styled-components'


const Card = (props) => {

    return (
        <div className='card-container'>
            <div className="card bg-dark text-white">
                <img className="front" src={props.thumbnail} alt="Card image" />
                <div className="back">
                    <h5 className="back__title">{props.name}</h5>
                    <p className="back__text">{props.year}</p>
                </div>
            </div>
        </div>
    )
}

export default Card