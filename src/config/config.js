export const config = {
    name: 'Binance Smart Chain',
    chainId: 56,
    rpc: [
        'https://bsc-dataseed.binance.org',
        'https://bsc-dataseed1.defibit.io',
        'https://bsc-dataseed1.ninicoin.io',
    ],
    multicallAddress: '0xB94858b0bB5437498F5453A16039337e5Fdc269C',
    supportedWallets: ['injected', 'walletconnect', 'custom-binance', 'custom-math', 'custom-twt', 'custom-safepal'],
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
    stableCoins: ['BUSD', 'USDT', 'USDC', 'DAI', 'VAI', 'QUSD', 'UST'],
}
