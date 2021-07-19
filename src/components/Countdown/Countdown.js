import * as React from "react";
import {formatCountdown} from "../../helpers/format";

const Countdown = ({expiresAt}) => {

    const [currentTime, setCurrentTime] = React.useState(new Date().getTime());

    React.useEffect(() => {
        setInterval(function(){
            setCurrentTime(new Date().getTime())
        }, 1000);
    });

    return formatCountdown(currentTime, expiresAt);
}

export default Countdown;
