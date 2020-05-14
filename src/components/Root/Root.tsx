import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Map } from '../Map/Map';
import { Title } from '../construct/Title/Title';
import { Hint } from '../construct/Hint/Hint';
import { RootLayout } from '../RootLayout/RootLayout';
import { ToggleAssetsGroup } from '../ToggleAssetsGroup/ToggleAssetsGroup';
import { IOrganization } from '../../types/organization';
import { ArrayLayout } from '../construct/ArrayLayout/ArrayLayout';
import { SingleDatePicker } from '../construct/DatePicker/SingleDatePicker';
import { TimePicker } from '../construct/TimePicker/TimePicker';
import { IAssetName } from '../../types/assets';
import { TripList } from '../TripList/TripList';
import { ToggleButton } from '../construct/ToggleButton/ToggleButton';
import { IStore, IStoreDate, IStoreLocation } from '../../types/store';
import { setStartTime } from '../../store/setStartTime';
import { setEndTime } from '../../store/setEndTime';
import { setDate } from '../../store/setDate';
import { parseTime } from '../../lib/time';
import { getAlgorithmParams } from '../../lib/getAlgorithmParams';
import { tripAlgorithm } from '../../lib/algorithm/index';
import { setRoute } from '../../store/setRoute';
import { removeRoute } from '../../store/removeRoute';
import { TripRoute } from '../TripRoute/TripRoute';
import { fetchOrganizationsToAlgorithmOutput } from '../../lib/fetchOrganizationsToAlgorithmOutput';
import { Checkbox } from '../construct/Checkbox/Checkbox';
import { setDateMode } from '../../store/setDateMode';
import { MultiDatePicker } from '../construct/DatePicker/MultiDatePicker';
import { CalculationModal } from '../CalculationModal/CalculationModal';
import { setRouteCalculating } from '../../store/setRouteCalculating';
import { AutoLocationButton } from '../AutoLocationButton/AutoLocationButton';
import { Text } from '../construct/Text/Text';

import './Root.scss';

interface IConnectRootProps {
    startTime: string;
    endTime: string;
    date: IStoreDate;
    tripListSize: number;
    showRoute: boolean;
    routeCalculating?: boolean;
    startLocation?: IStoreLocation;
}

export type IRootProps = DispatchProp & IConnectRootProps;

interface IState {
    category: IAssetName | null;
    organizations: IOrganization[] | null;

    dateValidation?: boolean;
    startTimeValidation?: boolean;
    endTimeValidation?: boolean;
    tripListValidation?: boolean;
    startLocationValidation?: boolean;
}

class RootPresenter extends React.PureComponent<IRootProps, IState> {
    state: IState = {
        category: null,
        organizations: null
    };

    render() {
        const { organizations, category } = this.state;
        const { showRoute, routeCalculating } = this.props;

        const left = (
            <Map
                category={category ? category : undefined}
                organizations={organizations ? organizations : undefined}
                lockArea
            />
        );

        const right = (
            <>
                {this.renderDates()}
                {this.renderLocation()}
                {
                    showRoute ? null : this.renderCategories()
                }
                {
                    showRoute ? <TripRoute/> :  <TripList validationError={this.state.tripListValidation}/>
                }
                <ToggleButton
                    id="calculate"
                    set={showRoute}
                    onClick={showRoute ? this.handleResetClick : this.handleCalculateClick}
                >
                    {showRoute ? 'Подобрать другой маршрут' : 'Рассчитать маршрут'}
                </ToggleButton>
            </>
        );

        return (
            <>
                <RootLayout left={left} right={right} />
                <CalculationModal visible={routeCalculating} />
            </>
        );
    }

    private renderLocation(): React.ReactElement {
        const { showRoute } = this.props;
        const stat = this.props.startLocation ? this.props.startLocation.address : 'Начальная точка не выбрана';
        const validation = this.state.startLocationValidation;

        return (
            <>
                <Title text={showRoute ? 'Начальная точка' : 'Выберите начальную точку'} />
                <ArrayLayout>
                    <AutoLocationButton />
                    {null}
                </ArrayLayout>
                <Text color={validation ? 'red' : 'grey'} newLine center size="m">{stat}</Text>
            </>
        );
    }

    private renderDates(): React.ReactElement {
        const { showRoute } = this.props;

        return (
            <>
                <Title text={showRoute ? 'Выбранная дата' : 'Выберите дату'}/>
                <Checkbox
                    className="RootLayout-DateCheck"
                    checked={!Array.isArray(this.props.date)}
                    onChange={this.handleDateModeChange}
                    text="Однодневный маршрут"
                    disabled={showRoute}
                />
                <ArrayLayout>
                    {this.renderDatePicker()}
                    <ArrayLayout>
                        <TimePicker
                            value={this.props.startTime}
                            onShow={this.handleStartTimeShow}
                            onChange={this.handleStartTimeChange}
                            place="bottom"
                            placeholder="Начало"
                            validationError={this.state.startTimeValidation}
                            disabled={showRoute}
                        />
                        <TimePicker
                            value={this.props.endTime}
                            onShow={this.handleEndTimeShow}
                            onChange={this.handleEndTimeChange}
                            place="bottom"
                            placeholder="Конец"
                            validationError={this.state.endTimeValidation}
                            disabled={showRoute}
                        />
                    </ArrayLayout>
                </ArrayLayout>
            </>
        )
    }

    private renderDatePicker(): React.ReactElement | null {
        const { showRoute, date } = this.props;

        if (Array.isArray(date)) {
            return (
                <MultiDatePicker
                    date={date[0] ? date : undefined}
                    onShow={this.handleDateShow}
                    onChange={this.handleMultiDateChange}
                    placeholder="Даты путешествия"
                    validationError={this.state.dateValidation}
                    disabled={showRoute}
                />
            )
        }

        return (
            <SingleDatePicker
                date={date}
                onShow={this.handleDateShow}
                onChange={this.handleSingleChange}
                placeholder="Дата путешествия"
                validationError={this.state.dateValidation}
                disabled={showRoute}
            />
        )
    }

    private renderCategories(): React.ReactElement {
        return (
            <>
                <Hint text="Мы подготовили для вас варианты:" />
                <ToggleAssetsGroup onAssetChanged={this.handleAssetChanged} />
            </>
        );
    }

    private handleDateShow = () => {
        this.setState({
            dateValidation: false
        });
    };

    private handleDateModeChange = (single: boolean) => {
        this.props.dispatch(setDateMode(single ? 'single' : 'multi'));
    };

    private handleSingleChange = (date: Date | null) => {
        this.props.dispatch(setDate(date));
    };

    private handleMultiDateChange = (date: [Date, Date] | null) => {
        this.props.dispatch(setDate(date ? date : [null, null]));
    };

    private handleStartTimeShow = () => {
        this.setState({
            startTimeValidation: false
        });
    };

    private handleStartTimeChange = (time: string) => {
        this.props.dispatch(setStartTime(time));
    };

    private handleEndTimeShow = () => {
        this.setState({
            endTimeValidation: false
        });
    };

    private handleEndTimeChange = (time: string) => {
        this.props.dispatch(setEndTime(time));
    };

    private handleAssetChanged = (assetName: IAssetName, asset: IOrganization[] | null) => {
        this.setState({
            category: assetName,
            organizations: asset
        });
    };

    private handleResetClick = () => {
        this.props.dispatch(removeRoute());
    };

    private handleCalculateClick = () => {
        const validation: Partial<IState> = {};

        if (!this.props.date || (Array.isArray(this.props.date) && this.props.date[0] === null)) {
            validation.dateValidation = true;
        }

        if (!this.props.startTime) {
            validation.startTimeValidation = true;
        }

        if (!this.props.endTime) {
            validation.endTimeValidation = true;
        }

        if (!validation.startTimeValidation && !validation.endTimeValidation) {
            if (parseTime(this.props.startTime) >= parseTime(this.props.endTime)) {
                validation.endTimeValidation = true;
            }
        }

        if (this.props.tripListSize === 0) {
            validation.tripListValidation = true;
        }

        if (!this.props.startLocation) {
            validation.startLocationValidation = true;
        }

        if (Object.keys(validation).length > 0) {
            // @ts-ignore
            this.setState(validation);

            return;
        }

        this.props.dispatch(setRouteCalculating());
        tripAlgorithm(getAlgorithmParams())
            .then(route => this.props.dispatch(setRoute(fetchOrganizationsToAlgorithmOutput(route))));
    };

    static getDerivedStateFromProps(props: IRootProps): Partial<IState> {
        const state: Partial<IState> = {};

        if (props.tripListSize !== 0) {
            state.tripListValidation = false;
        }

        if (props.startLocation) {
            state.startLocationValidation = false;
        }

        return state;
    }
}

export const Root = connect(
    (state: IStore): IConnectRootProps => ({
        startTime: state.startTime,
        endTime: state.endTime,
        date: state.date,
        tripListSize: state.tripList.length,
        showRoute: Boolean(state.tripRoute),
        routeCalculating: state.routeCalculating,
        startLocation: state.location
    })
)(RootPresenter);
