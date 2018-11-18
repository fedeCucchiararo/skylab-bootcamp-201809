import React, { Component } from 'react'
import logic from '../logic'

class Profile extends Component {
    state = {
        user: {},
        buddies: {}
    }

    async componentWillMount() {
        const user = await logic.retrieveUserInfo()
        
        this.setState({ user: {...user} })
    }

    render() {
        return (
            <div profile-main>
                <h1 className="profile__title"> Profile </h1>
                <h2>{this.state.user.name}</h2>
                <h2>{this.state.user.surname}</h2>
                {this.state.user.buddies ? <h3>1</h3> : <h3>2</h3>}
                {console.log(this.state.user.buddies)}
            </div>
        )
    }
}

export default Profile