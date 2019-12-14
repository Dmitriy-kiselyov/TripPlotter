import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store/store';
import { IObjectManagerFeature, IBalloonFactory } from '../types';

const layout = '<div id="balloon"></div>';

let BalloonLayout: any;

export function getBalloonLayout(balloonFactory: IBalloonFactory): any {
    if (!BalloonLayout) {
        createBalloonLayout(balloonFactory);
    }

    return BalloonLayout;
}

function createBalloonLayout(balloonFactory: IBalloonFactory) {
    BalloonLayout = window.ymaps.templateLayoutFactory.createClass(
        layout,
        {
            build: function () {
                BalloonLayout.superclass.build.call(this);

                this._container = document.querySelector('#balloon');
                this._renderBalloon();
            },

            clear: function () {
                BalloonLayout.superclass.clear.call(this);

                ReactDOM.unmountComponentAtNode(this._container)
            },

            _renderBalloon() {
                const { id, category } = this.getData().object as IObjectManagerFeature;

                ReactDOM.render(
                    <Provider store={store}>
                        {balloonFactory({ id, category })}
                    </Provider>,
                    this._container
                );
            }
        }
    );
}
