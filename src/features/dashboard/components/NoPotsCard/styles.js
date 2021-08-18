const styles = theme => ({
  noActivePots: {
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
    maxWidth: '350px',
    minHeight: '320px',
    border: '2px solid #F3F2F8',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 12px 24px -10px rgba(0, 0, 0, 0.4)',
    borderRadius: '16px',
    boxSizing: 'border-box',
    marginTop: '48px',
    padding: '24px',
  },
  noActivePotsImage: {},
  noActivePotsTitle: {
    color: '#585464',
    fontWeight: 400,
    fontSize: '24px',
    lineHeight: '36px',
    marginBottom: '12px',
    marginTop: '24px',
  },
  noActivePotsText: {
    color: '#585464',
    fontWeight: 400,
    fontSize: '15px',
    lineHeight: '24px',
  },
  noActivePotsPlayButton: {
    backgroundColor: 'rgba(103, 83, 219, 0.1)',
    border: '2px solid #6753DB',
    boxSizing: 'border-box',
    borderRadius: '20px',
    width: '100%',
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '17.24px',
    color: '#6753DB',
    marginTop: '32px',
  },
});

export default styles;
