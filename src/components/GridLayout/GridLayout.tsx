import React from 'react';

import { ArrayLayout } from '../ArrayLayout/ArrayLayout';

export interface IGridLayoutProps {
    columns: number;
    children: React.ReactElement[];
}

export const GridLayout: React.FC<IGridLayoutProps> = props => {
    const rows = [];

    for (let i = 0; i < props.children.length; i += props.columns) {
        rows.push(props.children.slice(i, i + props.columns));
    }

    return (
        <div className="GridLayout">
            {rows.map((row, i) => <ArrayLayout key={i}>{row}</ArrayLayout>)}
        </div>
    );
};
