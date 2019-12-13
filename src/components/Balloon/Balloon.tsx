import React from 'react';
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

import './Balloon.scss';

export interface IBalloonProps extends IBalloonFactoryProps {
}

interface IContact {
    type: IIconType;
    content: React.ReactElement;
}

interface IState {
    time: string;
    timeValidation?: boolean;
}

export class Balloon extends React.PureComponent<IBalloonProps, IState> {
    private readonly organization: IOrganization | null;

    state: IState = {
        time: '',
    };

    constructor(props: IBalloonProps) {
        super(props);

        this.organization = findOrganization(props.category, props.id);
    }

    render() {
        if (this.organization === null) {
            return null;
        }

        const { name, Categories } = this.organization;

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
                        value={this.state.time}
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
                    text="Добавить"
                    set={false}
                    onClick={this.handleAdd}
                />
            </div>
        );
    }

    private handleTimeChange = (time: string) => {
        this.setState({ time });
    };

    private handleTimeShow = () => {
        this.setState({ timeValidation: false });
    };

    private handleAdd = () => {
        if (this.state.time === '') {
            this.setState({ timeValidation: true });
        }
    };

    private getCategories(categories: ICategory[]): string {
        return categories.map(category => category.name).join(', ');
    }

    private getContacts(): IContact[] {
        const { Hours, address, Phones, url } = this.organization;
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
