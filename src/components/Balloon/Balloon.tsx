import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { IBalloonFactoryProps } from '../Map/types';
import { ICategory, IOrganization, IPhone } from '../../types/organization';
import { findOrganization } from '../../lib/findOrganization';
import { Divider } from '../construct/Divider/Divider';
import { Icon, IIconType } from '../construct/Icon/Icon';
import { Link } from '../construct/Link/Link';
import { ToggleButton } from '../construct/ToggleButton/ToggleButton';
import { Hint } from '../construct/Hint/Hint';
import { TimePicker } from '../construct/TimePicker/TimePicker';
import { Text } from '../construct/Text/Text';
import { Rating } from '../construct/Rating/Rating';

import { IStore } from '../../types/store';
import { addToList } from '../../store/addToList';
import { removeFromList } from '../../store/removeFromList';
import { changeTime } from '../../store/changeTime';
import { getTripItem } from '../../store/getTripItem';

import './Balloon.scss';
import { IMultiLang, multiLang } from '../../lib/multiLang';

interface IBalloonProps extends IBalloonFactoryProps {
    forwardRef?: React.RefObject<HTMLDivElement>;
}

interface IConnectProps {
    inList: boolean;
    time?: string;
    organization: IOrganization | null;
}

type IBalloonPropsWithConnect = IBalloonProps & IConnectProps & DispatchProp;

const visitDict: IMultiLang = {
    none: 'оценок',
    one: 'оценки',
    some: 'оценкок',
    many: 'оценок'
}

interface IContact {
    type: IIconType;
    content: React.ReactElement;
}

interface IState {
    time: string;
    timeValidation?: boolean;
}

class BalloonPresenter extends React.PureComponent<IBalloonPropsWithConnect, IState> {
    state: IState = {
        time: this.props.time || ''
    };

    render() {
        if (this.props.organization === null) {
            return null;
        }

        const { name, Categories } = this.props.organization;
        const { rating, count: visits } = this.props.organization.extra;
        const { inList, forwardRef } = this.props;
        const { time } = this.state;

        return (
            <div ref={forwardRef} className="Balloon">
                <div className="Balloon-Container">
                    <div className="Balloon-Title">
                        {name}
                    </div>
                    <Text color="grey">
                        {this.getCategories(Categories)}
                    </Text>
                    <div>
                        <Rating rating={rating} />
                        <Text className="Balloon-Visits" oneLine color="grey">
                            на основе&nbsp;
                            <Text color="grey" bold>{visits}</Text>
                            &nbsp;
                            {multiLang(visits, visitDict)}
                        </Text>
                    </div>
                    <Divider/>
                    {
                        this.getContacts().map(contact => (
                            <div className="Balloon-Contact" key={contact.type}>
                                <Icon size={15} type={contact.type}/>
                                {contact.content}
                            </div>
                        ))
                    }
                </div>
                <Divider className="Balloon-FlexDivider"/>
                <div className="Balloon-Container">
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
                        set={inList}
                        onClick={inList ? this.handleRemove : this.handleAdd}
                    >
                        {inList ? 'Удалить' : 'Добавить'}
                    </ToggleButton>
                </div>
            </div>
        );
    }

    static getDerivedStateFromProps(props: IBalloonPropsWithConnect): Partial<IState> {
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
                content: <Link text={this.prepareLinkText(url)} url={url} />
            });
        }

        return contacts;
    }

    private prepareLinkText(url: string): string {
        let startI = 0;
        const endI = url.endsWith('/') ? url.length - 1 : url.length;
        const starts = ['https://', 'http://'];

        for (const start of starts) {
            if (url.startsWith(start)) {
                startI = start.length;
            }
        }

        return url.substring(startI, endI);
    }

    private renderPhoneContacts(phones: IPhone[]): React.ReactElement {
        return (
            <div>
                {
                    phones.map(phone => (
                        <Text key={phone.formatted} newLine>{phone.formatted}</Text>
                    ))
                }
            </div>
        );
    }
}

export const Balloon = connect(
    (state: IStore, props: IBalloonProps): IConnectProps => {
        const tripItem = getTripItem(props.id);

        return {
            inList: Boolean(tripItem),
            time: tripItem ? tripItem.time : undefined,
            organization: tripItem ? tripItem.organization : findOrganization(props.category, props.id)
        };
    }
)(BalloonPresenter);
