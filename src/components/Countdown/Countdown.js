import React, {useEffect, useState} from 'react';
import {formatTimeLeft} from '../../helpers/format';

// until in milliseconds since unix epoch
// Optionally, pass children to render when countdown reaches zero
const Countdown = ({until, resolution = "minutes", dropZero = false, children}) => {
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const id = setInterval(() => setTime(Date.now()), 1000);
        return () => clearInterval(id);
    }, [setTime]);

    if (!until) {
        return null;
    }

    const timeLeft = Math.max(0, until - time);
    if (timeLeft > 0 || children === null || React.Children.count(children) === 0) {
        return formatTimeLeft(timeLeft, {
            resolution,
            dropZero
        });
    }

    return children;
}

export default Countdown;
