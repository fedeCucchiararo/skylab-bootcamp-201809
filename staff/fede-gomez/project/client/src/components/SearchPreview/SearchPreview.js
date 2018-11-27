import React from 'react'
import Card from '../Card/Card'



const SearchPreview = (props) => {

    let fromOwned = props.fromOwned
    let filteredGames = props.games.filter(game => {
        return game.name.toLowerCase().indexOf(props.searchQuery) !== -1
    })

    return (
            <div className='searchPreview'>
                {
                    filteredGames.map(game => <p>{game.name}</p>)
                }
            </div>
    )
}

export default SearchPreview