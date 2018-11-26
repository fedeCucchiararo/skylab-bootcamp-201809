import React from 'react'
import './Snackbar.css'

const Snackbar = (props) => {

    return (
        <div onClick={props.onCloseSnackbar} className='snackbar'>
            <i className="fas fa-exclamation-triangle"></i><span>{props.message}</span>
            <p>(Click to close)</p>
        </div>
     
    )

}

export default Snackbar