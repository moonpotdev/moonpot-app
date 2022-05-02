const networksConfig = {
  bsc: {
    name: 'BNB Chain',
    chainId: 56,
    eip1559: false,
    rpc: [
      'https://bsc-dataseed.binance.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed1.ninicoin.io',
    ],
    explorerUrl: 'https://bscscan.com',
    drawsSubgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/moonpotdev/moonpot-draws',
    multicallAddress: '0xB94858b0bB5437498F5453A16039337e5Fdc269C',
    converterAddress: '0xC0d9f24c325113b7d21494032B40D1c0a49A24d9',
    claimAllBonusesAddress: '0xD6F847959f00818BeB8FeC4F8866A7369695A488',
    nftPromoClaimAddress: '0x305e1c2356758bD4c1A85C9DF9a618a14783dA29',
    walletSettings: {
      chainId: `0x${parseInt(56, 10).toString(16)}`,
      chainName: 'BSC Mainnet',
      nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org'],
      blockExplorerUrls: ['https://bscscan.com/'],
    },
    nativeCurrency: {
      symbol: 'BNB',
      decimals: 18,
      wrappedSymbol: 'WBNB',
      wrappedAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    },
  },
  fantom: {
    name: 'Fantom',
    chainId: 250,
    eip1559: false,
    rpc: ['https://rpc.ftm.tools'],
    explorerUrl: 'https://ftmscan.com',
    drawsSubgraphEndpoint:
      'https://api.thegraph.com/subgraphs/name/moonpotdev/moonpot-draws-fantom',
    multicallAddress: '0xC9F6b1B53E056fd04bE5a197ce4B2423d456B982',
    walletSettings: {
      chainId: `0x${parseInt('250', 10).toString(16)}`,
      chainName: 'Fantom Opera',
      nativeCurrency: {
        name: 'FTM',
        symbol: 'FTM',
        decimals: 18,
      },
      rpcUrls: ['https://rpc.ftm.tools'],
      blockExplorerUrls: ['https://ftmscan.com/'],
    },
    nativeCurrency: {
      symbol: 'FTM',
      decimals: 18,
      wrappedSymbol: 'WFTM',
      wrappedAddress: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    },
  },
  // polygon: {
  //   name: 'Polygon',
  //   chainId: 137,
  //   eip1559: true,
  //   rpc: ['https://polygon-rpc.com'],
  //   explorerUrl: 'https://polygonscan.com',
  //   multicallAddress: '0xC3821F0b56FA4F4794d5d760f94B812DE261361B',
  //   walletSettings: {
  //     chainId: `0x${parseInt('137', 10).toString(16)}`,
  //     chainName: 'Polygon Mainnet',
  //     nativeCurrency: {
  //       name: 'MATIC',
  //       symbol: 'MATIC',
  //       decimals: 18,
  //     },
  //     rpcUrls: ['https://rpc-mainnet.matic.network'],
  //     blockExplorerUrls: ['https://polygonscan.com/'],
  //   },
  //   nativeCurrency: {
  //     symbol: 'MATIC',
  //     decimals: 18,
  //     wrappedSymbol: 'WMATIC',
  //     wrappedAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  //   },
  // },
};

export default networksConfig;
