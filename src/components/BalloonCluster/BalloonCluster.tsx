import React, { Dispatch, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IObjectManagerCluster, IObjectManagerFeature } from '../Map/types';
import { Balloon } from '../Balloon/Balloon';
import { ClickableText } from '../construct/ClickableText/ClickableText';
import { IStore, IStoreTripItem } from '../../types/store';
import { setBalloon } from '../../store/setBalloon';
import { store } from '../../store/store';
import { IActionSetBalloon } from '../../types/actions';
import { Divider } from '../construct/Divider/Divider';
import { Icon } from '../construct/Icon/Icon';

import './BalloonCluster.scss';

interface IBalloonClusterProps {
    cluster: IObjectManagerCluster;
    onSizeChange: () => void;
}

export const BalloonCluster: React.FC<IBalloonClusterProps> = props => {
    const dispatch = useDispatch();
    const { features } = props.cluster;
    const sortedFeatures = getSortedFeatures(features);
    const openedBalloonId = useSelector((store: IStore) => store.openedBalloon);
    const openedBalloon = features.find(feature => feature.id === openedBalloonId);

    const inListFeatures = getFeatureList(sortedFeatures.inList, openedBalloonId, dispatch);
    const restFeatures = getFeatureList(sortedFeatures.rest, openedBalloonId, dispatch);

    const balloonRef: React.RefObject<HTMLDivElement> = useRef(null);
    const minHeight = useRef(0);
    const clusterRef: React.RefObject<HTMLDivElement> = useRef(null);

    useEffect(() => {
        const balloon = balloonRef.current;

        if (balloon && minHeight.current < balloon.offsetHeight) {
            minHeight.current = balloon.offsetHeight + 1;
            clusterRef.current.style.minHeight = minHeight.current + 'px';

            props.onSizeChange();
        }
    });

    return (
        <div ref={clusterRef} className="BalloonCluster">
            <div className="BalloonCluster-Left RootLayout-Scrollbar">
                {
                    inListFeatures.length ?
                        <div className="BalloonCluster-StarContainer"><Icon type="star" size={24} /></div> :
                        null
                }
                {inListFeatures}
                {inListFeatures.length && restFeatures.length ? <Divider /> : null}
                {restFeatures}
            </div>
            <div className="BalloonCluster-Right">
                {openedBalloon ? <Balloon forwardRef={balloonRef} id={openedBalloon.id} category={openedBalloon.category} /> : null}
            </div>
        </div>
    )
};

function getFeatureList(features: IObjectManagerFeature[], openedBalloonId: string, dispatch: Dispatch<IActionSetBalloon>): React.ReactElement[] {
    return features.map(feature => (
        <ClickableText
            className="BalloonCluster-Feature"
            newLine
            key={feature.id}
            set={feature.id === openedBalloonId}
            onClick={() => dispatch(setBalloon(feature.id))}
        >
            {feature.properties.hintContent}
        </ClickableText>
    ));
}

interface ISortedFeatures {
    inList: IObjectManagerFeature[];
    rest: IObjectManagerFeature[];
}

function getSortedFeatures(features: IObjectManagerFeature[]): ISortedFeatures {
    const { tripList } = store.getState();
    const inList = [];
    const rest = [];

    for (const feature of features) {
        if (tripList.find((item: IStoreTripItem) => item.organization.id === feature.id)) {
            inList.push(feature);
        } else {
            rest.push(feature);
        }
    }

    return { inList, rest };
}
