import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '../../../store/store';
import { IObjectManagerCluster, IObjectManagerFeature } from '../types';
import { Balloon } from '../../Balloon/Balloon';
import { BalloonCluster } from '../../BalloonCluster/BalloonCluster';

const layout = '<div id="balloon"></div>';

let BalloonLayout: any;

export function getBalloonLayout(): any {
    if (!BalloonLayout) {
        createBalloonLayout();
    }

    return BalloonLayout;
}

function createBalloonLayout() {
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
                ReactDOM.render(
                    <Provider store={store}>
                        {balloonFactory(this.getData().object)}
                    </Provider>,
                    this._container
                );
            }
        }
    );
}

function balloonFactory(data: IObjectManagerFeature | IObjectManagerCluster): React.ReactElement {
    return data.type === 'Cluster' ?
        <BalloonCluster cluster={data} /> :
        <Balloon id={data.id} category={data.category} />;
}
