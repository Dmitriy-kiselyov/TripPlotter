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
            build() {
                BalloonLayout.superclass.build.call(this);

                if (!this._isSynteticBuild) {
                    this._container = document.querySelector('#balloon');

                    this._renderBalloon();
                }
            },

            clear() {
                if (!this._isSynteticBuild) {
                    BalloonLayout.superclass.clear.call(this);

                    ReactDOM.unmountComponentAtNode(this._container)
                }
            },

            // applyElementOffset: function () {
            //     const container = this.getParentElement() as HTMLDivElement;
            //     const floating = container.parentElement.parentElement.parentElement;
            //
            //     const top = getPixelValue(floating.style.top);
            //     const height = getPixelValue(container.style.height);
            //
            //     container.style.height = height + 50 + 'px';
            //     floating.style.top = top - 50 + 'px';
            // },

            _renderBalloon() {
                const data = this.getData().object as IObjectManagerFeature | IObjectManagerCluster;

                ReactDOM.render(
                    <Provider store={store}>
                        {
                            data.type === 'Cluster' ?
                                <BalloonCluster cluster={data} onSizeChange={this._forceRender.bind(this)} /> :
                                <Balloon id={data.id} category={data.category} />
                        }
                    </Provider>,
                    this._container
                );
            },

            _forceRender() {
                setTimeout(() => {
                    this._isSynteticBuild = true;
                    this.rebuild();
                    this._isSynteticBuild = false;
                });
            },
        }
    );
}

// function getPixelValue(style: string): number {
//     if (style.endsWith('px')) {
//         return Number(style.slice(0, style.length - 2));
//     }
//
//     return Number(style);
// }
