export function throttle<T>(fn: (args: T) => void, timeout: number) {
    let prevTime: number = -1;
    let prevArgs: T | null = null;
    let timeoutId: number = 0;

    const applyFn = (curTime: number, args: T) => {
        prevTime = curTime;
        prevArgs = null;
        clearTimeout(timeoutId);
        timeoutId = 0;

        fn(args);
    }

    return (args: T) => {
        const curTime = Date.now();

        if (curTime - prevTime > timeout) {
            applyFn(curTime, args);

            clearTimeout(timeoutId);
        } else {
            prevArgs = args;
            clearTimeout(timeoutId);

            timeoutId = window.setTimeout(() => {
                applyFn(Date.now(), prevArgs);
            }, curTime - prevTime);
        }
    };
}
