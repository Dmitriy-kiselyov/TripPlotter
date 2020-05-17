declare const ymaps: any;

export function ScaleButton(map: any, zoom: number) {
    const button = new ymaps.control.Button({
        data: {
            content: 'На всю карту',
        },
        options: {
            maxWidth: 150,
            selectOnClick: false
        }
    });

    button.events.add('click', () => map.setZoom(zoom));

    return button;
}
