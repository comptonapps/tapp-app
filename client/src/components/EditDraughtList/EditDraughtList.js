import './EditDraughtList.js';
import List from '../List/List';
import EditDraughtCell from '../EditDraughtCell/EditDraughtCell';

import React from 'react'

function EditDraughtList({draughts, place_id}) {
    return (
        <List>
            {draughts.length > 0 && 
                draughts.map(dr => <EditDraughtCell key={dr.drink_id} draught={dr} place_id={place_id}/>)
            }
            {!draughts.length && <h3>NO DRAUGHTS FOUND</h3>}
        </List>
    )
}

export default EditDraughtList
