import { store } from '../../../store/store';

declare const ymaps: any;

export function ScaleFeaturesButton(map: any) {
    const button = new ymaps.control.Button({
        data: {
            content: 'Добавленные места',
        },
        options: {
            maxWidth: 200,
            selectOnClick: false
        }
    });

    button.events.add('click', () => {
        const bounds = getFeaturesBounds();

        if (bounds) {
            map.setBounds(bounds);
        }
    });

    return button;
}

export function getFeaturesBounds(): [[number, number], [number, number]] | null {
    const bounds = [getBounds(Math.min), getBounds(Math.max)];

    if (bounds[0][0] === bounds[1][0] && bounds[0][1] === bounds[1][1]) {
        return null;
    }

    // @ts-ignore
    return bounds;
}

function getBounds(compare: (a: number, b: number) => number): [number, number] {
    const state = store.getState();
    const bounds: [number, number] = state.location ? state.location.coords.slice() : [-1, -1];

    for (const item of state.tripList) {
        const coords = item.organization.geometry.coordinates;

        if (bounds[0] === -1) {
            bounds[0] = coords[0];
            bounds[1] = coords[1];
        } else {
            bounds[0] = compare(bounds[0], coords[0]);
            bounds[1] = compare(bounds[1], coords[1]);
        }
    }

    return bounds;
}
