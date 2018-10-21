import React from 'react'

function Event(props) {
    return <li>
        <div className="card">
            <a href="#"><img className="card-img-top" src={props.eventImgUrl } alt="Card cap" /></a>
                <div className="card-body">
                    <h5 className="card-title"> {props.eventName }</h5>
                    <p> { props.eventCity } </p>
                    <p className="card-text"><a target="blank" href= {props.eventUrl }>Get tickets</a></p>
                    {/* <p> { props.eventPrice }</p> */}
                </div>
        </div>       
    </li>
}     
        
export default Event