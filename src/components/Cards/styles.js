const styles = () => ({
  cards: {
    width: `${500 * 2 + 24 * 2}px`,
    maxWidth: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cardsInner: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginLeft: '-12px',
    marginRight: '-12px',
    marginBottom: '-24px',
    '& > *, & > $card': {
      marginBottom: '24px',
      marginLeft: '12px',
      marginRight: '12px',
    },
  },
  card: {
    width: '500px',
    maxWidth: '100%',
    borderRadius: '16px',
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '24px',
    borderWidth: '2px',
    borderStyle: 'solid',
    boxShadow: '0px 4px 24px 24px rgba(19, 17, 34, 0.16)',
  },
  title: {
    fontWeight: 500,
    fontSize: '19px',
    lineHeight: '28px',
    letterSpacing: '0.6px',
    marginBottom: 24,
  },
  accordionGroup: {
    borderBottom: 'solid 2px red',
    paddingBottom: '16px',
  },
  accordionItem: {
    borderTop: 'solid 2px red',
    paddingTop: '16px',
    paddingBottom: '16px',
    '&:last-child': {
      paddingBottom: '0',
    },
  },
  accordionItemTitle: {
    fontStyle: 'normal',
    fontWeight: '700',
    fontFamily: 'Ubuntu',
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'red',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    outline: 'none',
    width: '100%',
    padding: '0',
  },
  accordionItemToggle: {
    cursor: 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    '& > .MuiSvgIcon-root': {
      fontSize: '20px',
    },
  },
  accordionItemInner: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.2px',
    color: 'red',
    paddingTop: '16px',
  },
  variantPurpleDark: {
    color: '#DFDFEC',
    backgroundColor: '#393960',
    borderColor: '#6753DB',
    '& $title': {
      color: '#FAFAFC',
    },
    '& $accordionGroup': {
      borderBottomColor: '#70609A',
    },
    '& $accordionItem': {
      borderTopColor: '#70609A',
    },
    '& $accordionItemTitle': {
      color: '#EBF3F9',
      paddingBottom: '16px',
    },
    '& $accordionItemInner': {
      color: '#EBF3F9',
    },
  },
  variantPurpleDarkAlt: {
    color: '#594C7B',
    backgroundColor: '#594C7B',
    borderColor: '#70609A',
    '& $title': {
      color: '#FAFAFC',
    },
    '& $accordionGroup': {
      borderBottomColor: '#70609A',
    },
    '& $accordionItem': {
      borderTopColor: '#70609A',
    },
    '& $accordionItemTitle': {
      color: '#EBF3F9',
      paddingBottom: '16px',
    },
    '& $accordionItemInner': {
      color: '#EBF3F9',
    },
  },
  variantPurpleMid: {
    color: '#ECEAFB',
    backgroundColor: '#594C7B',
    borderColor: '#70609A',
    '& $title': {
      color: '#ECEAFB',
    },
    '& $accordionGroup': {
      borderBottomColor: '#70609A',
    },
    '& $accordionItem': {
      borderTopColor: '#70609A',
    },
    '& $accordionItemTitle': {
      color: '#ECEAFB',
    },
    '& $accordionItemInner': {
      color: '#ECEAFB',
    },
  },
  variantPurpleLight: {
    color: '#ECEAFB',
    backgroundColor: '#70609A',
    borderColor: '#8A7EAF',
    '& $title': {
      color: '#EBF3F9',
    },
    '& $accordionGroup': {
      borderBottomColor: '#8A7EAF',
    },
    '& $accordionItem': {
      borderTopColor: '#8A7EAF',
    },
    '& $accordionItemTitle': {
      color: '#ECEAFB',
    },
    '& $accordionItemInner': {
      color: '#ECEAFB',
    },
  },
  variantTealDark: {
    color: '#EBF3F9',
    backgroundColor: '#345675',
    borderColor: '#436F97',
    '& $title': {
      color: '#EBF3F9',
    },
    '& $accordionGroup': {
      borderBottomColor: '#436F97',
    },
    '& $accordionItem': {
      borderTopColor: '#436F97',
    },
    '& $accordionItemTitle': {
      color: '#EBF3F9',
    },
    '& $accordionItemInner': {
      color: '#EBF3F9',
    },
  },
  variantTealLight: {
    color: '#EBF3F9',
    backgroundColor: '#437098',
    borderColor: '#5989B5',
    '& $title': {
      color: '#EBF3F9',
    },
    '& $accordionGroup': {
      borderBottomColor: '#5989B5',
    },
    '& $accordionItem': {
      borderTopColor: '#5989B5',
    },
    '& $accordionItemTitle': {
      color: '#EBF3F9',
    },
    '& $accordionItemInner': {
      color: '#EBF3F9',
    },
  },
  variantWhite: {
    color: '#585464',
    backgroundColor: '#ffffff',
    borderColor: '#F3F2F8',
    '& $title': {
      color: '#6753DB',
    },
  },
});

export default styles;
