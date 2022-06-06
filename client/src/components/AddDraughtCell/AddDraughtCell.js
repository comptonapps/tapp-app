import './AddDraughtCell.css';
import React, { useState } from 'react';
import Cell from '../Cell/Cell';

function AddDraughtCell({result, handleSelection}) {
    const [isActive, setIsActive] = useState(false);

    const handleChange = (evt) => {
        if (evt.target.type === 'checkbox') {
            setIsActive(isActive => !isActive)
        }
    }

    return (
        <Cell>
            <div className="Cell-drink-data">
                <p className="Cell-drink-name">{result.name}</p>
                <p className="Cell-drink-maker">{result.maker}</p>
            </div>
            <div className="Cell-drink-control">
                
                <div>
                    <label htmlFor="active">Is Online?</label>
                    <input 
                        type="checkbox"
                        id="active"
                        name="active"
                        checked={isActive}
                        onChange={handleChange}
                    />
                </div>
                <button onClick={() => handleSelection(isActive, result)}>Add Draught</button>
            </div>
        </Cell>
    )
}

export default AddDraughtCell;
