import './PlaceRating.css';
import StarRating from 'react-star-ratings';
import { useSelector, useDispatch } from 'react-redux';
import {
    createPlaceRating,
    deletePlaceRating,
    updatePlaceRating
} from '../../action/creators/session'
import React from 'react'

function PlaceRating({place_id}) {
    const dispatch = useDispatch();
    const userRating = useSelector(st => st.sessionState.user.place_ratings[place_id]);
    const placeRating = userRating ? userRating.rating : 0;
    const sessionRequests = useSelector(st => st.sessionState.requests);
    const handleRatingSelection = (rating) => {
        if (placeRating === rating) {
            dispatch(deletePlaceRating(placeRating, place_id));
        }
        else if (placeRating > 0) {
            dispatch(updatePlaceRating(rating, placeRating, place_id));
        }
        else {
            dispatch(createPlaceRating(rating, place_id));
        }
    }
    return (
        <div>
            <h3>Your Rating: <span>
                <StarRating 
                    rating={placeRating}
                    starRatedColor="yellow"
                    isSelectable={sessionRequests === 0 ? true : false}
                    numberOfStars={5}
                    name="rating"
                    changeRating={handleRatingSelection}
                    starDimension={'20px'}
                    starSpacing={'4px'}
                />
               </span>
            </h3>
        </div>
    )
}

export default PlaceRating
