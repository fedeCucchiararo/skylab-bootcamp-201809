import React from 'react'
import Card from '../Card/Card'
import './GameList.css'
import 'react-slidedown/lib/slidedown.css'
import { CSSTransition } from 'react-transition-group'




const GameList = (props) => {

    let fromOwned = props.fromOwned
    let filteredGames = props.games.filter(game => {
        return game.name.toLowerCase().indexOf(props.searchQuery) !== -1
    })

    return (
            <section className='gamelist-main'>
                <div className='gamelist-main__cards'>
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