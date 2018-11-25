import React from 'react'
import Card from '../Card/Card'
import logic from '../../logic'


const GameList = (props) => {

    let fromOwned = props.fromOwned

    return (
        <section className='main'>
            <h1>{props.title}</h1>
            <div className='main__cards'>
                {
                    props.games.map(game => <Card onAddOrRemoveClick={props.onAddOrRemoveClick} fromOwned={fromOwned} buttonText={fromOwned ? 'Remove' : 'Add'} onMoreInfoClick={props.onMoreInfoClick} key={game._id} id={game._id} game={game} />)
                }
            </div>
        </section>
    )
}

export default GameList