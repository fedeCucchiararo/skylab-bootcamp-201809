import React from 'react';
import PropTypes from 'prop-types';
import Flag from 'react-flags';
import Card from '../Card/Card'

const CountryCard = props => {

    return (
        <div className="col-sm-6 col-md-4 country-card">
            <div className="country-card-container border-gray rounded border mx-2 my-3 d-flex flex-row align-items-center p-0 bg-light">

                <div className="h-100 position-relative border-gray border-right px-2 bg-white rounded-left">

                    <Card
                        onSavePlayClick={props.onSavePlayClick}
                        onAddOrRemoveClick={props.onAddOrRemoveClick}
                        onMoreInfoClick={props.onMoreInfoClick}
                        buttonText={props.fromOwned ? 'Remove' : 'Add'}
                        loggedIn={props.loggedIn}
                        fromOwned={props.fromOwned}
                        key={props.game._id}
                        game={props.game}
                    />

                </div>

                <div className="px-3">

                    <span className="country-name text-dark d-block font-weight-bold">{props.game.name}</span>

                    <span className="country-region text-secondary text-uppercase">{props.game.id}</span>

                </div>

            </div>
        </div>
    )
}

export default CountryCard;
