import React from 'react';

import './ArrayLayout.scss';

interface IArrayLayoutProps {
    children: React.ReactElement[];
}

export const ArrayLayout: React.FC<IArrayLayoutProps> = function ArrayLayout(props) {
    const width = 100 / props.children.length + '%';

    const children = React.Children.map(props.children, child => (
        <div className="ArrayLayout-Item" style={{ width }}>
            {child}
        </div>
    ));

    return (
        <div className="ArrayLayout">
            {children}
        </div>
    );
};
