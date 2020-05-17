export function generateId(name: string) {
    return name + Math.floor(Math.random() * 1000000);
}
