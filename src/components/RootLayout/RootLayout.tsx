import React from 'react';

import './RootLayout.scss';

export interface IRootLayout {
    left: React.ReactElement;
    right: React.ReactElement;
}

export const RootLayout: React.FC<IRootLayout> = function RootLayout(props) {
    return (
        <div className="RootLayout">
            <div className="RootLayout-Left">
                {props.left}
            </div>
            <div className="RootLayout-Right RootLayout-Scrollbar">
                {props.right}
            </div>
        </div>
    );
};
