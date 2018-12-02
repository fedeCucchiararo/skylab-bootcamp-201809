import React from 'react'
import Option from '../Option/Option'

const SelectPlayer = (props) => {

    // let playerCount = new Array(props.playerCount).fill(0)


    return (

        props.players.map((playerId, index) =>
            <select id={index} onChange={props.onChange}>
                {index === 0 ?
                    <option default={true} value={props.thisPlayer}>Me</option> :
                    <Option>
                        <option default={true} value={0}>Choose a Player</option>
                        {props.users.filter(user => (user.id !== props.thisPlayer)).map(user => <option value={user.id}>{user.username}</option>)}
                    </Option>
                }

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