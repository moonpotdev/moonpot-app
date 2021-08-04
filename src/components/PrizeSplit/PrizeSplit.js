import * as React from "react";

const PrizeSplit = ({item, withBalances = true, skipFirstComma = false}) => {
    return <React.Fragment>
        {item.sponsors.map((sponsor, i) => {
            return <React.Fragment key={item.id + i}>{i < item.sponsors.length - 1 ? i === 0 && skipFirstComma ? "" : ", " : " & "}
                {withBalances ? sponsor.sponsorBalance.div(item.numberOfWinners).toFixed(2) : ''} {sponsor.sponsorToken}
            </React.Fragment>
        })}
    </React.Fragment>
}

export default PrizeSplit;
