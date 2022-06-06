import './PlaceCell.css';
import React from 'react'
import Cell from '../Cell/Cell';
import StarRatings from 'react-star-ratings';
import CellRating from '../CellRating/CellRating'


function PlaceCell({place, dashboard, hoverable=true}) {
    return (
        <Cell className="PlaceCell" hoverable={hoverable}>
            <div className="PlaceCell-info">
                <h2>{place.name}</h2>
                <p>{place.address}</p>
                <p>{`${place.city}, ${place.state} ${place.zip}`}</p>
            </div>
            <CellRating dashboard={dashboard} rating={+place.rating} num_ratings={+place.num_ratings} />
        </Cell>
    )
}

export default PlaceCell;
