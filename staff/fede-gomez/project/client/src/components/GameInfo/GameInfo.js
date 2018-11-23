import React, { Component } from 'react'
import Card from '../Card/Card'
import logic from '../../logic'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from "react-router-dom"

const GameInfo = (props) => {

    return (

        <div className="modal fade bottom" id="frameModalBottom" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            {/* Add class .modal-frame and then add class .modal-bottom (or other classes from list above) to set a position to the modal */}
            <div className="modal-dialog modal-frame modal-bottom" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="row d-flex justify-content-center align-items-center">
                            <p className="pt-3 pr-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit nisi quo provident fugiat reprehenderit nostrum
                              quos..
              </p>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(GameInfo)