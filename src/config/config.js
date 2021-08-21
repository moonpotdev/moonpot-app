export const config = {
  bsc: {
    name: 'Binance Smart Chain',
    chainId: 56,
    rpc: [
      'https://bsc-dataseed.binance.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed1.ninicoin.io',
    ],
    explorerUrl: 'https://bscscan.com',
    multicallAddress: '0xB94858b0bB5437498F5453A16039337e5Fdc269C',
    supportedWallets: [
      'injected',
      'walletconnect',
      'custom-binance',
      'custom-math',
      'custom-twt',
      'custom-safepal',
    ],
    providerName: 'binance',
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
    stableCoins: ['BUSD', 'USDT', 'USDC', 'DAI', 'VAI', 'UST'],
  },
};

export const networkSetup = (networdIdentifier) => {
      return new Promise((resolve, reject) => {
        const provider = window.ethereum
        if (provider) {
          if (config.hasOwnProperty(networdIdentifier)) {
            provider.request({
              method: 'wallet_addEthereumChain',
              params: [config[networdIdentifier].walletSettings]
            }).then(resolve).catch(reject)
          } else {
            reject(new Error(`No network settings configured for chainId: '${networdIdentifier}'`))
          }
        } else {
          reject(new Error(`window.ethereum is '${typeof provider}'`))
        }
      })
    }
