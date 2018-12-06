import React from 'react'
import './Card.css'
import { CSSTransition } from 'react-transition-group'



const Card = (props) => {

    let fromOwned = props.fromOwned

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={300}
            classNames='fade'
        >
            <div className='card-container'>
                <div className="card bg-dark text-white">
                    <div className="front" style ={ { backgroundImage: `url('${props.game.image}')` } } >
                        
                    </div>
                    <div className="back">
                        <h5 className="back__title">{props.game.name}</h5>
                        <p className="back__text">({props.game.yearPublished})</p>
                        <div className="back__buttons">
                            <button
                                className='button card-button card-button-moreInfo'
                                onClick={() => props.onMoreInfoClick(props.game)}>
                                <i class="fas fa-info"></i>
                                More Info
                            </button>
                            {props.loggedIn ?
                                <button
                                    className='button card-button card-button-savePlay'
                                    onClick={() => props.onSavePlayClick(props.game)}>
                                    <i class="fas fa-plus"></i>
                                    Session
                                </button>
                                : null
                            }
                            {props.loggedIn ?
                                <button
                                    className='button card-button card-button-addRemove'
                                    onClick={() => props.onAddOrRemoveClick(fromOwned, props.game.id)}>
                                    <i class="far fa-heart"></i>
                                    {props.buttonText}
                                </button>
                                : null
                            }
                        </div>

                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Card