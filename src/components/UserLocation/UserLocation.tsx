import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Checkbox } from '../construct/Checkbox/Checkbox';
import { setLocation } from '../../store/setLocation';
import { IStore } from '../../types/store';
import { Text } from '../construct/Text/Text';
import { removeLocation } from '../../store/removeLocation';
import { SearchInput } from '../construct/SearchInput/SearchInput';
import { setAutoLocation } from '../../lib/setAutoLocation';
import { getCoords } from '../../lib/parseGeocode';

import './UserLocation.scss';

declare const ymaps: any;

export interface IUserLocation {
    validation?: boolean;
}

export const UserLocation: React.FC<IUserLocation> = props => {
    const location = useSelector((state: IStore) => state.location);
    const showRoute = useSelector((state: IStore) => Boolean(state.tripRoute));
    const dispatch = useDispatch();

    const isAuto = Boolean(location && location.auto);

    const handleChangeManual = () => {
        if (location) {
            dispatch(setLocation(location.coords, location.address, false));
        } else {
            dispatch(removeLocation());
        }
    }

    const handleAutoLocation = () => setAutoLocation(dispatch);

    return (
        <div className="UserLocation">
            {
                showRoute ? <UserLocationStat /> : (
                    <>
                        <Checkbox
                            checked={isAuto}
                            text="Определить моё местоположение"
                            onChange={isAuto ? handleChangeManual : handleAutoLocation}
                        />
                        { isAuto && <UserLocationAuto validation={props.validation} /> }
                        { !isAuto && <UserLocationManual validation={props.validation} />}
                    </>
                )
            }
        </div>
    );
};

const UserLocationManual: React.FC<IUserLocation> = props => {
    const address = useSelector((state: IStore) => state.location && state.location.address);
    const dispatch = useDispatch();

    const handleSelectedAddress = (address: string) => {
        ymaps.geocode(address, {
            result: 1,
        }).then((geocode: any) => {
            const coords = getCoords(geocode);

            dispatch(setLocation(coords, address, false));
        });
    }

    return (
        <SearchInput
            className="UserLocation-Info"
            value={address}
            placeholder="Адрес"
            validationError={props.validation}
            onSelected={handleSelectedAddress}
        />
    );
}

const UserLocationAuto: React.FC<IUserLocation> = props => {
    const startLocation = useSelector((state: IStore) => state.location);

    const color = props.validation ? 'red' : 'grey';
    const stat = startLocation ? startLocation.address : 'Стартовая точка не выбрана';

    return (
        <Text
            className="UserLocation-Info"
            color={color}
            newLine
            center
            size="m"
        >
            {stat}
        </Text>
    );
}

const UserLocationStat: React.FC = () => {
    const startLocation = useSelector((state: IStore) => state.location);
    const stat = startLocation ? startLocation.address : 'Стартовая точка не выбрана';

    return (
        <Text
            color="black"
            newLine
            center
            size="m"
            bold
        >
            {stat}
        </Text>
    );
}
