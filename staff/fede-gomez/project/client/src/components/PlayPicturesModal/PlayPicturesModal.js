import React, { Component } from 'react'
import './PlayPicturesModal.css'
import Picture from '../Picture/Picture'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"

const PlayPicturesModal = (props) => {
    if (props.show) {
        return (
            <div className='playPicturesModal-container'>
                <section className="playPicturesModal-main">
                    <button className="playPicturesModal-close" onClick={props.onClose}>X</button>
                    <div className="pictures-container">
                        {props.playPictures.map(picture => <div className="picture-container"><Picture src={picture} /></div>)}
                    </div>
                </section>
            </div>
        )
    } else {
        return null
    }
}

export default withRouter(PlayPicturesModal)