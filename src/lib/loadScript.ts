export function loadScript(src: string, cb: () => void): void {
    const script = document.createElement("script");

    script.src = src;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = cb;

    document.body.appendChild(script);
}
