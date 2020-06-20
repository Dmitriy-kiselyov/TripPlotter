import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '../../lib/cn';
import { Modal } from '../construct/Modal/Modal';
import { IStore } from '../../types/store';
import { stopRouteCalculation } from '../../store/stopRouteCalculation';

import './CalculationModal.scss';

export const CalculationModal: React.FC = () => {
    const tripList = useSelector((store: IStore) => store.tripList);
    const routeCalculation = useSelector((store: IStore) => store.routeCalculation);
    const dispatch = useDispatch();

    const organizations: Array<[string, boolean]> = tripList.map(item => {
        return [
            item.organization.name,
            routeCalculation && routeCalculation.has(item.organization.id)
        ];
    });

    const handleStop = useCallback(() => {
        dispatch(stopRouteCalculation());
    }, []);

    return (
        <Modal
            className="CalculationModal"
            visible={Boolean(routeCalculation)}
        >
            <>
                <span className="CalculationModal-Title">Поиск наилучшего маршрута</span>
                <div className="CalculationModal-Organizations">
                    {
                        organizations.map(([org, active]) => (
                            <span key={org} className={cn('CalculationModal-Organization', { active })}>
                                {org}
                            </span>
                        ))
                    }
                </div>
                <button
                    className="CalculationModal-Button"
                    onClick={handleStop}
                >
                    ПРЕРВАТЬ
                </button>
            </>
        </Modal>
    );
};
