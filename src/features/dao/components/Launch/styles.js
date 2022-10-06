const styles = theme => ({
  card: {
    color: '#ffffff',
    backgroundColor: '#393960',
    width: '500px',
    maxWidth: '100%',
    border: '2px solid #6753DB',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 12px 24px -10px rgba(0, 0, 0, 0.4)',
    borderRadius: '16px',
    boxSizing: 'border-box',
    margin: '0 auto',
    padding: '24px',
    '& + $card': {
      marginTop: 24,
    },
    '& p': {
      color: '#DFDFEC',
      fontSize: '13px',
      lineHeight: '24px',
      letterSpacing: '0.2px',
      marginBottom: 24,
      '&:last-child': {
        marginBottom: 0,
      },
      '& a': {
        color: '#F3BA2E',
        textDecoration: 'none',
        '& .MuiSvgIcon-root': {
          verticalAlign: 'text-bottom',
        },
        '&:hover, &:focus, &:active': {
          textDecoration: 'underline',
        },
      },
    },
  },
  cardTitle: {
    color: '#FAFAFC',
    fontWeight: 500,
    fontSize: '17px',
    lineHeight: '28px',
    letterSpacing: '0.6px',
    marginBottom: 24,
  },
  rocket: {
    display: 'block',
    margin: '0 auto 24px auto',
  },
  airdropBox: {
    marginBottom: 24,
    background: '#2A6F46',
    border: '2px solid #318152',
    boxSizing: 'border-box',
    borderRadius: 4,
    padding: 12,
  },
  airdropAllocation: {
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: '20px',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  airdropAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: '28px',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  requirement: {
    border: '2px solid transparent',
    boxSizing: 'border-box',
    borderRadius: 4,
    padding: 10,
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
  },
  requirementIcon: {
    flexShrink: '0',
    flexGrow: '0',
    flexBasis: '20px',
    fontSize: '18px',
    lineHeight: '1',
  },
  requirementContent: {
    paddingLeft: 8,
    fontSize: '13px',
    lineHeight: '24px',
    '& p': {
      fontSize: '13px',
      lineHeight: '24px',
      letterSpacing: '0',
      margin: '0 0 12px 0',
      color: '#ffffff',
      '& a': {
        color: '#ffffff',
        '& .MuiSvgIcon-root': {
          verticalAlign: 'middle',
        },
      },
      '&:last-child': {
        marginBottom: 0,
      },
    },
  },
  requirementFulfilled: {
    background: '#2A6F46',
    borderColor: '#318152',
  },
  requirementUnfulfilled: {
    background: '#A3563E',
    borderColor: '#C1907B',
  },
  button: {
    margin: '24px 0',
  },
  countdown: {
    'p&': {
      margin: '24px 0',
      textAlign: 'center',
      fontWeight: 500,
      fontSize: '22px',
      lineHeight: '28px',
      letterSpacing: '0.6px',
    },
  },
  eligibility: {
    '& p': {
      fontSize: '10px',
      lineHeight: '20px',
      letterSpacing: '0.2px',
    },
  },
});

export default styles;
