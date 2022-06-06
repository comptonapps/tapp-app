import React from 'react'
import List from '../List/List';
import DrinkCell from '../DrinkCell/DrinkCell';
import { Link } from 'react-router-dom';

function DrinkList({drinks, dashboard}) {
    return (
        <List>
            {drinks.map(d => {
                if (d.id) {
                    return <Link 
                                key={`drink${d.id}`} 
                                to={`/drinks/${d.id}`}
                            >
                                <DrinkCell drink={d} dashboard={dashboard}/>
                            </Link>
                }
            })}
        </List>
    );
};

export default DrinkList;
