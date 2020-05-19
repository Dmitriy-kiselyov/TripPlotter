import React from 'react';

import { ToggleButton } from '../construct/ToggleButton/ToggleButton';

import './PrintButton.scss';

export const PrintButton: React.FC = () => {
    const handleClick = () => {
        window.print();
    }

    return (
        <ToggleButton
            className="PrintButton noprint"
            id="print-route"
            set
            onClick={handleClick}
        >
            Сохранить маршрут
        </ToggleButton>
    );
};
