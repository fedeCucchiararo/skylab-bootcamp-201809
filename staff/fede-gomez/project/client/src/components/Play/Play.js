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
                <div className="play-card__image" style={{ backgroundImage: `url('${props.play.game.image}')` }} ></div>
                <div>
                    <h4 className='play-card__title'>{props.play.game.name}</h4>
                    <div className='play-card__players-container'>
                        <h5 className='play-card__players-title'>Players:</h5>
                        {props.play.players.map(player => <div>{player.name}</div>)}
                    </div>
                    <div className='play-card__players-container'>
                        <h5 className='play-card__players-title'>Session Notes:</h5>
                        <p>{props.play.notes}</p>
                    </div>

                    <div className='play-card__players-container'>
                        <h5 className="showPlayPictures" onClick={() => props.onShowPlayPictures(props.play.id)}>Show Pictures</h5>
                        <form encType="multipart/form-data" onSubmit={(event) => { event.preventDefault(); props.onPictureUpload(event, props.play.id) }}>
                            <label className="profileImage-upload">
                                <input type="file" className="uploadImage-input" name="avatar" />
                                <button type="submit">Upload Picture</button>
                            </label>
                        </form>
                    </div>


                    <p className="play-card__delete" onClick={() => props.onPlayDelete(props.play.id)}> Delete Play </p>
                </div>

            </div>
        </CSSTransition>
    )
}

export default Play