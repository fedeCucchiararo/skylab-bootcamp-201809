import React from 'react'
import Card from '../Card/Card'



const GameList = (props) => {

    let fromOwned = props.fromOwned
    let filteredGames = props.games.filter(game => {
        return game.name.toLowerCase().indexOf(props.searchQuery) !== -1
    })

    return (
        <section className='main'>
            <h1>{props.title}</h1>
            <div className='main__cards'>
                {
                    filteredGames.map(game =>
                        <Card
                            onRegisterPlayClick={props.onRegisterPlayClick}
                            onAddOrRemoveClick={props.onAddOrRemoveClick}
                            onMoreInfoClick={props.onMoreInfoClick}
                            buttonText={fromOwned ? 'Remove' : 'Add'}
                            loggedIn={props.loggedIn}
                            fromOwned={fromOwned}
                            key={game._id}
                            game={game}
                        />)
                }
            </div>
        </section>
    )
}

export default GameList