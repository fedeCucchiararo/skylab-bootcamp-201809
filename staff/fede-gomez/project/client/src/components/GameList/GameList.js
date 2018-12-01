import React from 'react'
import Card from '../Card/Card'
import './GameList.css'



const GameList = (props) => {

    let fromOwned = props.fromOwned
    let filteredGames = props.games.filter(game => {
        return game.name.toLowerCase().indexOf(props.searchQuery) !== -1
    })

    return (
        <section className='main'>
            <h1 className='main__title'>{props.title}</h1>
            <div className='main__cards'>
                {
                    filteredGames.map(game =>
                        <Card
                            onSavePlayClick={props.onSavePlayClick}
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