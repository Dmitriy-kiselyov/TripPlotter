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

export class Balloon extends React.PureComponent<IBalloonProps> {
    private readonly organization: IOrganization | null;

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
                <Text className="Balloon-Categories">
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
                        placeholder="Время"
                    />
                    <Text>Сколько времени вы хотите провести в этом месте?</Text>
                </div>
                <ToggleButton
                    id="add"
                    text="Добавить"
                    set={false}
                    onClick={() => {}}
                />
            </div>
        );
    }

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
