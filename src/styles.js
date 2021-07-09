const styles = () => ({
    moonpotImage: {
        margin: '16px 24px',
        height: '36px',
        display: 'absolute',
    },
    mobileNavItem: {
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        fontWeight: 500,
        fontSize: '21px',
        lineHeight: '24px',
        marginBottom: '32px',
    },
    mobileNavWallet: {
        width: '90%',
    }
})

const burgerMenuStyles = {
    bmBurgerButton: {
      position: 'fixed',
      width: '36px',
      height: '36px',
      right: '2.5%',
      top: '2.5%',
      color: '#FFFFFF',
    },
    bmBurgerBars: {
      background: '#FFFFFF'
    },
    bmBurgerBarsHover: {
      background: '#a90000'
    },
    bmCrossButton: {
      height: '36px',
      width: '36px',
      right: '2.5%',
      top: '2.5%',
    },
    bmCross: {
      background: '#FFFFFF'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%',
      width: '100%',
    },
    bmMenu: {
      background: '#262640',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em'
    },
    bmMorphShape: {
      fill: '#373a47'
    },
    bmItemList: {
      color: '#b8b7ad',
      padding: '0.8em'
    },
    bmItem: {
      display: 'flex'
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)'
    },
}

export {styles, burgerMenuStyles};