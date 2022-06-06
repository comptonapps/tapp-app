import './DrinkCell.css';
import defaultBeerLogo from '../../images/default_beer.jpg';
import Cell from '../Cell/Cell';
import StarRatings from 'react-star-ratings';
import CellRating from '../CellRating/CellRating';

import React, {useState} from 'react'

function DrinkCell({drink, dashboard}) {
    const [image, setImage] = useState(drink.img_url);
    return (
        <Cell>
            <img src={image} onError={() => setImage(defaultBeerLogo)}/>
            <div className="DrinkCell-info">
                <h2>{drink.name}</h2>
                <h3>{drink.maker}</h3>
            </div>
            <CellRating dashboard={dashboard} rating={drink.rating} num_ratings={drink.num_ratings} />
        </Cell>
    )
}

export default DrinkCell
