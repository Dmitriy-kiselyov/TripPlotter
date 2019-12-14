import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { IBalloonFactoryProps } from '../Map/types';
import { ICategory, IOrganization, IPhone } from '../../types/organization';
import { findOrganization } from '../../lib/findOrganization';
import { Divider } from '../Divider/Divider';
import { Icon, IIconType } from '../Icon/Icon';
import { Link } from '../Link/Link';
import { ToggleButton } from '../ToggleButton/ToggleButton';
import { Hint } from '../Hint/Hint';
import { TimePicker } from '../TimePicker/TimePicker';
import { Text } from '../Text/Text';

import { IStore } from '../../types/store';
import { addToList } from '../../store/addToList';
import { removeFromList } from '../../store/removeFromList';
import { changeTime } from '../../store/changeTime';
import { getTripItem } from '../../store/getTripItem';

import './Balloon.scss';

export interface IBalloonProps extends IBalloonFactoryProps, DispatchProp {
    inList: boolean;
    time?: string;
    organization: IOrganization | null;
}

interface IContact {
    type: IIconType;
    content: React.ReactElement;
}

interface IState {
    time: string;
    timeValidation?: boolean;
}

class BalloonPresenter extends React.PureComponent<IBalloonProps, IState> {
    state: IState = {
        time: this.props.time || ''
    };

    render() {
        if (this.props.organization === null) {
            return null;
        }

        const { name, Categories } = this.props.organization;
        const { inList } = this.props;
        const { time } = this.state;

        return (
            <div className="Balloon">
                <div className="Balloon-Title">
                    {name}
                </div>
                <Text color="grey">
                    {this.getCategories(Categories)}
                </Text>
                <Divider/>
                {
                    this.getContacts().map(contact => (
                        <div className="Balloon-Contact" key={contact.type}>
                            <Icon size={15} type={contact.type}/>
                            {contact.content}
                        </div>
                    ))
                }
                <Divider/>
                <Hint text="Хотите добавить в поездку?"/>
                <div className="Balloon-TimeWrap">
                    <TimePicker
                        value={time}
                        place="left"
                        placeholder="Время"
                        onShow={this.handleTimeShow}
                        onChange={this.handleTimeChange}
                        validationError={this.state.timeValidation}
                    />
                    <Text>Сколько времени вы хотите провести в этом месте?</Text>
                </div>
                <ToggleButton
                    id="add"
                    text={inList ? 'Удалить' : 'Добавить'}
                    set={inList}
                    onClick={inList ? this.handleRemove : this.handleAdd}
                />
            </div>
        );
    }

    static getDerivedStateFromProps(props: IBalloonProps): Partial<IState> {
        if (props.time !== undefined) {
            return {
                time: props.time
            }
        }

        return {};
    }

    private handleTimeChange = (time: string) => {
        this.setState({
            time
        });

        this.props.dispatch(changeTime(this.props.id, time));
    };

    private handleTimeShow = () => {
        this.setState({ timeValidation: false });
    };

    private handleAdd = () => {
        if (this.state.time === '') {
            this.setState({ timeValidation: true });
        } else {
            this.props.dispatch(addToList(this.props.category, this.props.organization, this.state.time));
        }
    };

    private handleRemove = () => {
        this.props.dispatch(removeFromList(this.props.id));
    };

    private getCategories(categories: ICategory[]): string {
        return categories.map(category => category.name).join(', ');
    }

    private getContacts(): IContact[] {
        const { Hours, address, Phones, url } = this.props.organization;
        const contacts: IContact[] = [];

        if (Hours) {
            contacts.push({
                type: 'clock',
                content: <Text>{Hours.text}</Text>
            });
        }

        contacts.push({
            type: 'map',
            content: <Text>{address}</Text>
        });

        if (Phones) {
            contacts.push({
                type: 'call',
                content: this.renderPhoneContacts(Phones)
            });
        }

        if (url) {
            contacts.push({
                type: 'site',
                content: <Link text={url} url={url} />
            });
        }

        return contacts;
    }

    private renderPhoneContacts(phones: IPhone[]): React.ReactElement {
        return (
            <div>
                {
                    phones.map(phone => (
                        <Text key={phone.formatted}>{phone.formatted}</Text>
                    ))
                }
            </div>
        );
    }
}

export const Balloon = connect(
    (state: IStore, props: IBalloonFactoryProps): Partial<IBalloonProps> => {
        const tripItem = getTripItem(props.id);

        return {
            inList: Boolean(tripItem),
            time: tripItem ? tripItem.time : undefined,
            organization: tripItem ? tripItem.organization : findOrganization(props.category, props.id)
        };
    }
)(BalloonPresenter);
