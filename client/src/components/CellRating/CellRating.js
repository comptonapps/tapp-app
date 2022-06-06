import './CellRating.css';

import React from 'react'
import StarRatings from 'react-star-ratings';

function CellRatings({rating, num_ratings, dashboard}) {
    const stringNumRatings = (num_ratings && num_ratings > 0) ? `${num_ratings} ratings` : "No ratings yet"; 
    return (
        <div className="CellRatings">
            <StarRatings 
                rating={rating ? +rating : 0}
                starRatedColor="yellow"
                isSelectable={false}
                numberOfStars={5}
                name="rating"
                starDimension={'20px'}
                starSpacing={'4px'}
            />
            {!dashboard &&
            <div className="CellRating-info">
                <p>{stringNumRatings}</p>
            </div>}
        </div>
    )
}

export default CellRatings;
