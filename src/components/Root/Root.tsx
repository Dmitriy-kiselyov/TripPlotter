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
import { setRouteCalculation } from '../../store/setRouteCalculation';
import { UserLocation } from '../UserLocation/UserLocation';
import { PrintButton } from '../PrintButton/PrintButton';
import { IAlgorithmBestRoute } from '../../lib/algorithm/typings';
import { throttle } from '../../lib/throttle';

import './Root.scss';
import { AlgorithmStopper } from '../../lib/algorithm/stopper';

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

    private algorithmStopper?: AlgorithmStopper;

    componentDidUpdate(prevProps: Readonly<IRootProps>) {
        if (prevProps.routeCalculating && !this.props.routeCalculating) {
            this.algorithmStopper && this.algorithmStopper.stop();
            this.algorithmStopper = undefined;
        }
    }

    render() {
        const { organizations, category } = this.state;
        const { showRoute } = this.props;

        const left = (
            <Map
                category={category ? category : undefined}
                organizations={organizations ? organizations : undefined}
            />
        );

        const right = (
            <>
                {this.renderDates()}
                {!showRoute && this.renderLocation()}
                {
                    showRoute ? null : this.renderCategories()
                }
                {
                    showRoute ? <TripRoute/> :  <TripList validationError={this.state.tripListValidation}/>
                }
                {showRoute && <PrintButton />}
                <ToggleButton
                    className="noprint"
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
                <CalculationModal />
            </>
        );
    }

    private renderLocation(): React.ReactElement {
        return (
            <>
                <Title text="Выберите стартовую точку" />
                <UserLocation validation={this.state.startLocationValidation} />
            </>
        );
    }

    private renderDates(): React.ReactElement {
        const { showRoute } = this.props;

        return (
            <div className="noprint">
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
            </div>
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

        this.algorithmStopper = new AlgorithmStopper();

        this.props.dispatch(setRouteCalculation());
        tripAlgorithm(getAlgorithmParams(), this.handleCalculationResponse, this.algorithmStopper)
            .then(route => this.props.dispatch(setRoute(fetchOrganizationsToAlgorithmOutput(route))));
    };

    private handleCalculationResponse = throttle((route: IAlgorithmBestRoute) => {
        this.props.routeCalculating && this.props.dispatch(setRouteCalculation(route));
    }, 500);

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
        startLocation: state.location,
        routeCalculating: Boolean(state.routeCalculation),
    })
)(RootPresenter);
