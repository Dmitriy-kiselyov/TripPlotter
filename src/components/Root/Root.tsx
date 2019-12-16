import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Map } from '../Map/Map';
import { Title } from '../Title/Title';
import { Hint } from '../Hint/Hint';
import { RootLayout } from '../RootLayout/RootLayout';
import { ToggleAssetsGroup } from '../ToggleAssetsGroup/ToggleAssetsGroup';
import { IOrganization } from '../../types/organization';
import { assetsNameMap } from '../../lib/assetsNameMap';
import { ArrayLayout } from '../ArrayLayout/ArrayLayout';
import { DatePicker } from '../DatePicker/DatePicker';
import { TimePicker } from '../TimePicker/TimePicker';
import { IAssetName } from '../../types/assets';
import { TripList } from '../TripList/TripList';
import { ToggleButton } from '../ToggleButton/ToggleButton';
import { IStore } from '../../types/store';
import { setStartTime } from '../../store/setStartTime';
import { setEndTime } from '../../store/setEndTime';
import { setDate } from '../../store/setDate';
import { parseTime } from '../../lib/time';
import { getAlgorithmParams } from '../../lib/getAlgorithmParams';

import './Root.scss';

interface IConnectRootProps {
    startTime: string;
    endTime: string;
    date: Date | null;
    tripListSize: number;
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

        const left = (
            <Map
                category={category ? category : undefined}
                organizations={organizations ? organizations : undefined}
                lockArea
            />
        );

        const right = (
            <>
                <Title text="Выберите дату"/>
                <ArrayLayout>
                    <DatePicker
                        onShow={this.handleDateShow}
                        onChange={this.handleDateChange}
                        placeholder="Дата путешествия"
                        validationError={this.state.dateValidation}
                    />
                    <ArrayLayout>
                        <TimePicker
                            value={this.props.startTime}
                            onShow={this.handleStartTimeShow}
                            onChange={this.handleStartTimeChange}
                            place="bottom"
                            placeholder="Начало"
                            validationError={this.state.startTimeValidation}
                        />
                        <TimePicker
                            value={this.props.endTime}
                            onShow={this.handleEndTimeShow}
                            onChange={this.handleEndTimeChange}
                            place="bottom"
                            placeholder="Конец"
                            validationError={this.state.endTimeValidation}
                        />
                    </ArrayLayout>
                </ArrayLayout>
                <Hint text="Мы подготовили для вас варианты:" />
                <ToggleAssetsGroup
                    items={assetsNameMap}
                    onAssetChanged={this.handleAssetChanged}
                />
                <TripList
                    validationError={this.state.tripListValidation}
                />
                <ToggleButton
                    id="calculate"
                    text="Рассчитать маршрут"
                    set={false}
                    onClick={this.handleCalculateClick}
                />
            </>
        );

        return (
            <RootLayout left={left} right={right} />
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

        // Всё в порядке
        console.log(getAlgorithmParams());
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
        tripListSize: state.tripList.length
    })
)(RootPresenter);
