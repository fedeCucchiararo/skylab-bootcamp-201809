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
                        <i className="fas fa-info"></i>
                        <h5 className="back__title">{props.game.name}</h5>
                        <p className="back__text">({props.game.yearPublished})</p>
                        <button
                            className='button card-button card-button-moreInfo'
                            onClick={() => props.onMoreInfoClick(props.game)}>
                            <i className="fas fa-plus-circle"></i>
                            More Info
                        </button>
                        {props.loggedIn ?
                            <button
                                className='button card-button card-button-savePlay'
                                onClick={() => props.onSavePlayClick(props.game)}>
                                <i className="fas fa-plus-circle"></i>
                                Play
                            </button>
                            : null
                        }
                        {props.loggedIn ?
                            <button
                                className='button card-button card-button-addRemove'
                                onClick={() => props.onAddOrRemoveClick(fromOwned, props.game.id)}>
                                <i className="fas fa-plus-circle"></i>
                                {props.buttonText}
                            </button>
                            : null
                        }
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Card