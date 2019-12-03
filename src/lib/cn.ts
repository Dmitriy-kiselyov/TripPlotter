export function cn(className: string, mods: Record<string, string | boolean>): string {
    const classes = [className];

    Object.keys(mods).forEach(key => {
        const value = mods[key];

        if (typeof value === 'boolean' && value) {
            classes.push(className + '_' + key);
        }

        if (typeof value === 'string') {
            classes.push(className + '_' + key + '_' + value);
        }
    });

    return classes.join(' ');
}
