import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '../../lib/cn';
import { Modal } from '../construct/Modal/Modal';
import { IStore } from '../../types/store';
import { stopRouteCalculation } from '../../store/stopRouteCalculation';

import './CalculationModal.scss';
import { IMultiLang, multiLang } from '../../lib/multiLang';

const addText: IMultiLang = {
    none: 'добавлено',
    one: 'добавлен',
    some: 'добавлено',
    many: 'добавлено'
};
const objectsText: IMultiLang = {
    none: 'объектов',
    one: 'объект',
    some: 'объекта',
    many: 'объектов'
}

export const CalculationModal: React.FC = () => {
    const tripList = useSelector((store: IStore) => store.tripList);
    const routeCalculation = useSelector((store: IStore) => store.routeCalculation);
    const dispatch = useDispatch();

    const organizations: Array<[string, boolean]> = tripList.map(item => {
        return [
            item.organization.name,
            routeCalculation && routeCalculation.organizations.has(item.organization.id)
        ];
    });

    const handleStop = useCallback(() => {
        dispatch(stopRouteCalculation());
    }, []);

    const content = Boolean(routeCalculation) ? (
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
                {
                    routeCalculation.maxDays ? (
                        <div className="CalculationModal-InfoBlock">
                            <div className="CalculationModal-Info">
                                В маршрут
                                &nbsp;
                                {multiLang(routeCalculation.organizations.size, addText)}
                                &nbsp;
                                {routeCalculation.organizations.size}
                                &nbsp;
                                {multiLang(routeCalculation.organizations.size, objectsText)}
                            </div>
                            <div className="CalculationModal-Info">
                                Обрабатывается {routeCalculation.curDay} день из {routeCalculation.maxDays}
                            </div>
                        </div>
                    ) : <div className="CalculationModal-InfoBlockPlaceholder" />
                }
            </div>
            <button
                className="CalculationModal-Button"
                onClick={handleStop}
            >
                ПРЕРВАТЬ
            </button>
        </>
    ) : null;

    return (
        <Modal
            className="CalculationModal"
            visible={Boolean(routeCalculation)}
        >
            {content}
        </Modal>
    );
};
