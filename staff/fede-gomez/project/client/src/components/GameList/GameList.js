import React from 'react'
import Card from '../Card/Card'



const GameList = (props) => {

    let fromOwned = props.fromOwned
    console.log(props.games)

    return (
        <section className='main'>
            <h1>{props.title}</h1>
            <div className='main__cards'>
                {
                    props.games.map(game => <Card onAddOrRemoveClick={props.onAddOrRemoveClick} fromOwned={fromOwned} buttonText={fromOwned ? 'Remove' : 'Add'} onMoreInfoClick={props.onMoreInfoClick} key={game._id} game={game} />)
                }
            </div>
        </section>
    )
}

export default GameList