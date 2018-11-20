import React from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom";

class Home extends React.Component {

    state = { error: null }

    render() {

        return (
            <div>
                <h1>Home</h1>
            </div>
        )
    }
}

export default withRouter(Home)