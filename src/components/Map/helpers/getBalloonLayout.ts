import ReactDOM from 'react-dom';

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
                    balloonFactory({ id, category }),
                    this._container
                );
            }
        }
    );
}
