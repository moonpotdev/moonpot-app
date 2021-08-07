const networkSettings = {
    '56': {
      chainId: '0x38',
      chainName: 'BSC Mainnet',
      nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org'],
      blockExplorerUrls: ['https://bscscan.com/'],
    }
  }
  
  export const networkSetup = (chainId) => {
      return new Promise((resolve, reject) => {
        const provider = window.ethereum
        if (provider) {
          if (networkSettings.hasOwnProperty(chainId)) {
            provider.request({
              method: 'wallet_addEthereumChain',
              params: [networkSettings[chainId]]
            }).then(resolve).catch(reject)
          } else {
            reject(new Error(`No network settings configured for chainId: '${chainId}'`))
          }
        } else {
          reject(new Error(`window.ethereum is '${typeof provider}'`))
        }
      })
    }