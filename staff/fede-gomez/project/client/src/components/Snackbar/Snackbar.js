import React from 'react'
import './Snackbar.css'

const Snackbar = (props) => {

    return (
        <div onClick={props.onCloseSnackbar} className='snackbar'>{props.message} (Click to Close)</div>
    )

}

export default Snackbar