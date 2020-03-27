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
import { IStore, IStoreDate } from '../../types/store';
import { setStartTime } from '../../store/setStartTime';
import { setEndTime } from '../../store/setEndTime';
import { setDate } from '../../store/setDate';
import { parseTime } from '../../lib/time';
import { getAlgorithmParams } from '../../lib/getAlgorithmParams';
import { tripAlgorithm } from '../../lib/algorithm/index';
import { setRoute } from '../../store/setRoute';
import { IAlgorithmOutput } from '../../types/algorithm';
import { removeRoute } from '../../store/removeRoute';
import { TripRoute } from '../TripRoute/TripRoute';
import { fetchOrganizationsToAlgorithmOutput } from '../../lib/fetchOrganizationsToAlgorithmOutput';
import { Checkbox } from '../construct/Checkbox/Checkbox';

import './Root.scss';
import { setDateMode } from '../../store/setDateMode';
import { MultiDatePicker } from '../construct/DatePicker/MultiDatePicker';

interface IConnectRootProps {
    startTime: string;
    endTime: string;
    date: IStoreDate;
    tripListSize: number;
    showRoute: boolean;
}

export type IRootProps = DispatchProp & IConnectRootProps;

interface IState {
    category: IAssetName | null;
    organizations: IOrganization[] | null;

    dateValidation?: boolean;
    startTimeValidation?: boolean;
    endTimeValidation?: boolean;
    tripListValidation?: boolean;
}

class RootPresenter extends React.PureComponent<IRootProps, IState> {
    state: IState = {
        category: null,
        organizations: null
    };

    render() {
        const { organizations, category } = this.state;
        const { showRoute } = this.props;

        const left = (
            <Map
                category={category ? category : undefined}
                organizations={organizations ? organizations : undefined}
                lockArea
            />
        );

        const right = (
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
            <RootLayout left={left} right={right} />
        );
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

        if (!this.props.date) {
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

        if (Object.keys(validation).length > 0) {
            // @ts-ignore
            this.setState(validation);

            return;
        }

        tripAlgorithm(getAlgorithmParams(), (route: IAlgorithmOutput) => {
            this.props.dispatch(setRoute(fetchOrganizationsToAlgorithmOutput(route)));
        });
    };

    static getDerivedStateFromProps(props: IRootProps): Partial<IState> {
        if (props.tripListSize !== 0) {
            return {
                tripListValidation: false
            }
        }

        return {};
    }
}

export const Root = connect(
    (state: IStore): IConnectRootProps => ({
        startTime: state.startTime,
        endTime: state.endTime,
        date: state.date,
        tripListSize: state.tripList.length,
        showRoute: Boolean(state.tripRoute)
    })
)(RootPresenter);
