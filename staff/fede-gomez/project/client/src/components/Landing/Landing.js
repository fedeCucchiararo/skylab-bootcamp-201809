import React from 'react'
import './Landing.css'

const Landing = props => {
    return (
        <div className='landing-container'>
            <heading className='landing-head'>
                <h1> Landing Titel </h1>
            </heading>
            <main className='landing-main'>
                <div className='landing-main__image'><img src='https://images8.alphacoders.com/448/448821.jpg'></img></div>
                <div className='landing-main__button' onClick={props.onLoginClick}> Login </div>
                <div className='landing-main__button' onClick={props.onRegisterClick}> Register </div>
                <div> Benefits </div>
            </main>
            <footer className='landing-footer'>
                <div> Second Call to Action </div>
            </footer>
        </div>
    )
}

export default Landing