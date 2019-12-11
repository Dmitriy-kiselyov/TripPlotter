import React from 'react';
import { IBalloonFactoryProps } from '../Map/types';
import { ICategory, IOrganization, IPhone } from '../../types/organization';
import { findOrganization } from '../../lib/findOrganization';
import { Divider } from '../Divider/Divider';
import { Icon, IIconType } from '../Icon/Icon';
import { Link } from '../Link/Link';

import './Balloon.scss';
import { Input } from '../Input/Input';

export interface IBalloonProps extends IBalloonFactoryProps {
}

interface IContact {
    type: IIconType;
    content: React.ReactNode;
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
                <div className="Balloon-Categories">
                    {this.getCategories(Categories)}
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
                content: Hours.text
            });
        }

        contacts.push({
            type: 'map',
            content: address
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

    private renderPhoneContacts(phones: IPhone[]): React.ReactNode {
        return (
            <div>
                {
                    phones.map(phone => (
                        <div>{phone.formatted}</div>
                    ))
                }
            </div>
        );
    }
}

const autor = '<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>';
