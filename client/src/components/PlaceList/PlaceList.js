import './PlaceList.css';
import React from 'react'
import List from '../List/List';
import { Link } from 'react-router-dom';
import PlaceCell from '../PlaceCell/PlaceCell';
import SectionTitle from '../SectionTitle/SectionTitle'



function PlaceList({places, dashboard, hoverable=true}) {
    if (!places.length) {
        return <SectionTitle title="No places found" />
    }
    return (
        <List>
            {places.map(p => {
                if (p) {
                    return <Link key={`place${p.id}`} to={`/places/${p.id}`}><PlaceCell place={p} dashboard={dashboard} hoverable={hoverable}/></Link>
                }
            })}
        </List>
    )
}

export default PlaceList;
