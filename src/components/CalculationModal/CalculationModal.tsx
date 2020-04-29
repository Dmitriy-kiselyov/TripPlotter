import React from 'react';

import { Modal } from '../construct/Modal/Modal';

import './CalculationModal.scss';

export interface ICalculationModal {
    visible?: boolean;
}

export const CalculationModal: React.FC<ICalculationModal> = props => {
    return (
        <Modal
            className="CalculationModal"
            visible={props.visible}
        >
            <span className="CalculationModal-Title">Поиск наилучшего маршрута</span>
        </Modal>
    );
};
