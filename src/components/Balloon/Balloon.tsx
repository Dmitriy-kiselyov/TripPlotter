import React from 'react';
import { IBalloonFactoryProps } from '../Map/types';
import { ICategory, IOrganization } from '../../types/organization';

import { findOrganization } from '../../lib/findOrganization';

import './Balloon.scss';

export interface IBalloonProps extends IBalloonFactoryProps {
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
            </div>
        );
    }

    private getCategories(categories: ICategory[]): string {
        return categories.map(category => category.name).join(', ');
    }
}
