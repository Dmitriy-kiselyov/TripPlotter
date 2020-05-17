export const minCoords = [43.00, 31.1];
export const maxCoords = [47.60, 38.75];
export const centerCoords = [average(minCoords[0], maxCoords[0]), average(minCoords[1], maxCoords[1])];

function average(a: number, b: number) {
    return (a + b) / 2;
}
