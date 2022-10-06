const styles = () => ({
  wrapper: {
    background: 'linear-gradient(90.18deg, #423AAD 0.12%, #605CAA 100%)',
    width: '100%',
    height: '84px',
  },
  shrimp: {
    height: '84px',
    padding: '20px 40px',
  },
  title: {
    color: '#F3BA2E',
    fontWeight: 700,
    fontSize: '8px',
    lineHeight: '20px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    whiteSpace: 'nowrap' as const,
  },
  content: {
    color: '#fff',
    fontWeight: 400,
    fontSize: '13px',
    fontStyle: 'italic',
    lineHeight: '24px',
    letterSpacing: '0.2px',
    whiteSpace: 'nowrap' as const,
  },
});

export default styles;
