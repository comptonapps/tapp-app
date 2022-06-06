import './DrinkRating.css';
import StarRating from 'react-star-ratings';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { createDrinkRating, updateDrinkRating, deleteDrinkRating } from '../../action/creators/session'

function DrinkRating({drink_id}) {
    const dispatch = useDispatch();
    const userRating = useSelector(st => st.sessionState.user.drink_ratings[drink_id]);
    const drinkRating = userRating ? +userRating.rating : 0;

    const handleRatingSelection = (rating) => {
        if (drinkRating === 0) {
            dispatch(createDrinkRating(rating, drink_id));
        } else if (drinkRating === rating) {
            dispatch(deleteDrinkRating(drinkRating, drink_id));
        } else {
            dispatch(updateDrinkRating(rating, drinkRating, drink_id));
        }
    }

    return (
        <div class="DrinkRating">
            <h3>Your Rating: 
                <span className="stars">
                    <StarRating 
                        rating={drinkRating}
                        starRatedColor="yellow"
                        isSelectable={true}
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

export default DrinkRating;
