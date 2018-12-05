import React, { Component } from 'react'
import './PlayPicturesModal.css'
import Picture from '../Picture/Picture'
import Carousel from '../Carousel/Carousel'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"

const PlayPicturesModal = (props) => {
    if (props.show) {
        return (
            <div className='playPicturesModal-container'>
                <Carousel onClose={props.onClose} images={props.playPictures} />
            </div>
        )
    } else {
        return null
    }
}

export default withRouter(PlayPicturesModal)