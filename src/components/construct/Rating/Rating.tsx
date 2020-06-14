import React from 'react';

import { Icon } from '../Icon/Icon';

import './Rating.scss';
import { Text } from '../Text/Text';

export interface IRating {
    rating: number;
}

export const Rating: React.FC<IRating> = props => {
    const rating = Math.round(props.rating * 2);
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const size = 14;

    const stars = new Array(fullStars).fill(0).map((_, i) => (
        <Icon type="ratingStar" key={i} size={size} />
    ));
    const noStars = new Array(emptyStars).fill(0).map((_, i) => (
        <Icon type="ratingEmptyStar" key={i} size={size} />
    ));
    const halfStar = hasHalfStar ? (
        <Icon type="ratingHalfStar" size={size} />
    ) : null;

    return (
        <div className="Rating">
            {stars}
            {halfStar}
            {noStars}
            <Text color="black" size="l">{formatRating(props.rating)}</Text>
        </div>
    )
}

function formatRating(rating: number): string {
    const integer = Math.floor(rating);
    const fracture = Math.floor(rating * 10) % 10;

    return `${integer}.${fracture}`;
}
