import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Map } from '../Map/Map';
import { Title } from '../construct/Title/Title';
import { Hint } from '../construct/Hint/Hint';
import { RootLayout } from '../RootLayout/RootLayout';
import { ToggleAssetsGroup } from '../ToggleAssetsGroup/ToggleAssetsGroup';
import { IOrganization } from '../../types/organization';
import { assetsNameMap } from '../../lib/assetsNameMap';
import { ArrayLayout } from '../construct/ArrayLayout/ArrayLayout';
import { DatePicker } from '../construct/DatePicker/DatePicker';
import { TimePicker } from '../construct/TimePicker/TimePicker';
import { IAssetName } from '../../types/assets';
import { TripList } from '../TripList/TripList';
import { ToggleButton } from '../construct/ToggleButton/ToggleButton';
import { IStore } from '../../types/store';
import { setStartTime } from '../../store/setStartTime';
import { setEndTime } from '../../store/setEndTime';
import { setDate } from '../../store/setDate';
import { parseTime } from '../../lib/time';
import { getAlgorithmParams } from '../../lib/getAlgorithmParams';
import tripAlgorithm from '../../lib/tripAlgorithm';
import { setRoute } from '../../store/setRoute';
import { IAlgorithmOutput } from '../../types/algorithm';
import { removeRoute } from '../../store/removeRoute';
import { TripRoute } from '../TripRoute/TripRoute';
import { fetchOrganizationsToAlgorithmOutput } from '../../lib/fetchOrganizationsToAlgorithmOutput';

import './Root.scss';

interface IConnectRootProps {
    startTime: string;
    endTime: string;
    date: Date | null;
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
                <ArrayLayout>
                    <DatePicker
                        onShow={this.handleDateShow}
                        onChange={this.handleDateChange}
                        placeholder="Дата путешествия"
                        validationError={this.state.dateValidation}
                        disabled={showRoute}
                    />
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

    private handleDateChange = (date: Date) => {
        this.props.dispatch(setDate(date));
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
