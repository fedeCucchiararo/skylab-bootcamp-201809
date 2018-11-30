import React from 'react'

const SelectPlayer = (props) => {

    let index = 0

    return (<option onChange={props.onChange} value={props.user.id}>{props.user.username}</option>)
}

export default SelectPlayer


//     < SelectPlayer
// players = { this.state.players }
// onChange = { this.playerSelectHandler.bind(this) }
// users = { this.state.users }
//     />