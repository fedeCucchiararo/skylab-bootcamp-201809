import React from 'react'
import './Card.css'
import { CSSTransition } from 'react-transition-group'



const Card = (props) => {

    let fromOwned = props.fromOwned

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={1000}
            classNames='fade'
        >
            <div className='card-container'>
                <div className="card bg-dark text-white">
                    <div >
                        <img className="front" src={props.game.thumbnail} alt="Card image" />
                    </div>
                    <div className="back">
                        <h5 className="back__title">{props.game.name}</h5>
                        <p className="back__text">({props.game.yearPublished})</p>
                        <button className='button card-button card-button-moreInfo' onClick={() => props.onMoreInfoClick(props.game)}>
                            More Info
                    </button>
                        <button className='button card-button card-button-addRemove' onClick={fromOwned ? () => props.onAddOrRemoveClick(fromOwned, props.game._id) : () => props.onAddOrRemoveClick(fromOwned, props.game._id)}>
                            <i className="fas fa-plus-circle"></i>{props.buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Card