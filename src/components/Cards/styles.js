import backgroundSnow from '../../images/backgrounds/snow.svg';

const styles = () => ({
  cardGrid: {
    maxWidth: '1240px',
    margin: '-8px auto',
  },
  cardGridInner: {
    padding: '10px',
  },
  cardGridInnerCentered: {
    padding: '10px',
    margin: '0 auto',
  },
  card: {
    borderRadius: '16px',
    boxSizing: 'border-box',
    padding: '24px',
    borderWidth: '2px',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
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
    position: 'relative',
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
    },
    '& $accordionItemInner': {
      color: '#EBF3F9',
    },
  },
  variantPurpleInfo: {
    color: '#DFDFEC',
    backgroundColor: '#424270',
    borderColor: '#555590',
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
  variantBlueCommunity: {
    color: '#EBF3F9',
    backgroundColor: '#4F5888',
    borderColor: '#586397',
    '& $title': {
      color: '#EBF3F9',
    },
    '& $accordionGroup': {
      borderBottomColor: '#586397',
    },
    '& $accordionItem': {
      borderTopColor: '#586397',
    },
    '& $accordionItemTitle': {
      color: '#EBF3F9',
    },
    '& $accordionItemInner': {
      color: '#EBF3F9',
    },
  },
  variantBlueCommunityAlt: {
    color: '#EBF3F9',
    backgroundColor: '#464E77',
    borderColor: '#586397',
    '& $title': {
      color: '#EBF3F9',
    },
    '& $accordionGroup': {
      borderBottomColor: '#586397',
    },
    '& $accordionItem': {
      borderTopColor: '#586397',
    },
    '& $accordionItemTitle': {
      color: '#EBF3F9',
    },
    '& $accordionItemInner': {
      color: '#EBF3F9',
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
  variantGreen: {
    color: '#FFFFFF',
    backgroundColor: '#275668',
    borderColor: '#2E657A',
    '& $title': {
      color: '#FFFFFF',
    },
    '& $accordionGroup': {
      borderBottomColor: '#2E657A',
    },
    '& $accordionItem': {
      borderTopColor: '#2E657A',
    },
    '& $accordionItemTitle': {
      color: '#FFFFFF',
    },
    '& $accordionItemInner': {
      color: '#FFFFFF',
    },
  },
  variantGreenDark: {
    color: '#FFFFFF',
    backgroundColor: '#204755',
    borderColor: '#275668',
    '& $title': {
      color: '#FFFFFF',
    },
    '& $accordionGroup': {
      borderBottomColor: '#275668',
    },
    '& $accordionItem': {
      borderTopColor: '#275668',
    },
    '& $accordionItemTitle': {
      color: '#FFFFFF',
    },
    '& $accordionItemInner': {
      color: '#FFFFFF',
    },
  },
  variantGreenStable: {
    color: '#FFFFFF',
    backgroundColor: '#467268',
    borderColor: '#508276',
    '& $title': {
      color: '#FFFFFF',
    },
    '& $accordionGroup': {
      borderBottomColor: '#508276',
    },
    '& $accordionItem': {
      borderTopColor: '#508276',
    },
    '& $accordionItemTitle': {
      color: '#FFFFFF',
    },
    '& $accordionItemInner': {
      color: '#FFFFFF',
    },
  },
  variantGreenStableAlt: {
    color: '#FFFFFF',
    backgroundColor: '#3C6259',
    borderColor: '#467268',
    '& $title': {
      color: '#FFFFFF',
    },
    '& $accordionGroup': {
      borderBottomColor: '#467268',
    },
    '& $accordionItem': {
      borderTopColor: '#467268',
    },
    '& $accordionItemTitle': {
      color: '#FFFFFF',
    },
    '& $accordionItemInner': {
      color: '#FFFFFF',
    },
  },
  variantGreySide: {
    color: '#FFFFFF',
    backgroundColor: '#3D4A5C',
    borderColor: '#47566B',
    '& $title': {
      color: '#FFFFFF',
    },
    '& $accordionGroup': {
      borderBottomColor: '#47566B',
    },
    '& $accordionItem': {
      borderTopColor: '#47566B',
    },
    '& $accordionItemTitle': {
      color: '#FFFFFF',
    },
    '& $accordionItemInner': {
      color: '#FFFFFF',
    },
  },
  variantGreySideAlt: {
    color: '#FFFFFF',
    backgroundColor: '#333E4D',
    borderColor: '#3D4A5C',
    '& $title': {
      color: '#FFFFFF',
    },
    '& $accordionGroup': {
      borderBottomColor: '#3D4A5C',
    },
    '& $accordionItem': {
      borderTopColor: '#3D4A5C',
    },
    '& $accordionItemTitle': {
      color: '#FFFFFF',
    },
    '& $accordionItemInner': {
      color: '#FFFFFF',
    },
  },
  variantPurpleNft: {
    color: '#FFFFFF',
    backgroundColor: '#5C285A',
    borderColor: '#6E306C',
    '& $title': {
      color: '#FFFFFF',
    },
    '& $accordionGroup': {
      borderBottomColor: '#6E306C',
    },
    '& $accordionItem': {
      borderTopColor: '#6E306C',
    },
    '& $accordionItemTitle': {
      color: '#FFFFFF',
    },
    '& $accordionItemInner': {
      color: '#FFFFFF',
    },
  },
  variantPurpleNftAlt: {
    color: '#FFFFFF',
    backgroundColor: '#501B4E',
    borderColor: '#632161',
    '& $title': {
      color: '#FFFFFF',
    },
    '& $accordionGroup': {
      borderBottomColor: '#632161',
    },
    '& $accordionItem': {
      borderTopColor: '#632161',
    },
    '& $accordionItemTitle': {
      color: '#FFFFFF',
    },
    '& $accordionItemInner': {
      color: '#FFFFFF',
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
  variantPurpleXmas: {
    color: '#ECEAFB',
    backgroundColor: '#625CA2',
    backgroundImage: `url('${backgroundSnow}')`,
    borderColor: '#827DB5',
    '& $title': {
      color: '#FFFFFF',
    },
    '& $accordionGroup': {
      borderBottomColor: '#827DB5',
    },
    '& $accordionItem': {
      borderTopColor: '#827DB5',
    },
    '& $accordionItemTitle': {
      color: '#FFFFFF',
    },
    '& $accordionItemInner': {
      color: '#ECEAFB',
    },
  },
  variantPurpleXmasAlt: {
    color: '#ECEAFB',
    backgroundColor: '#625CA2',
    backgroundImage: `url('${backgroundSnow}')`,
    borderColor: '#827DB5',
    '& $title': {
      color: '#FFFFFF',
    },
    '& $accordionGroup': {
      borderBottomColor: '#827DB5',
    },
    '& $accordionItem': {
      borderTopColor: '#827DB5',
    },
    '& $accordionItemTitle': {
      color: '#FFFFFF',
    },
    '& $accordionItemInner': {
      color: '#ECEAFB',
    },
  },
});

export default styles;
