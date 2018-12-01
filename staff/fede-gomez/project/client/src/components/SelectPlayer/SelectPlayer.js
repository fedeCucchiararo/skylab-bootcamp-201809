import React from 'react'

const SelectPlayer = (props) => {

    // let playerCount = new Array(props.playerCount).fill(0)
    

    return (

        props.players.map((elem, index) =>
            <select id={index} onChange={props.onChange}>
                <option default={true} value={0}>Choose a Player</option>
                {props.users.map(user => <option value={user.id}>{user.username}</option>)}
            </select>
        )

    )
}

export default SelectPlayer


//     < SelectPlayer
// players = { this.state.players }
// onChange = { this.playerSelectHandler.bind(this) }
// users = { this.state.users }
//     />