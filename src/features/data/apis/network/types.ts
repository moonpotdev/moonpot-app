export interface NetworkConfig {
  id: string;
  name: string;
  chainId: number;
  eip1559: boolean;
  rpc: string[];
  explorerUrl: string;
  drawsSubgraphEndpoint: string;
  multicallAddress: string;
  converterAddress?: string;
  claimAllBonusesAddress?: string;
  nftPromoClaimAddress?: string;
  walletSettings: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  };
  nativeCurrency: {
    symbol: string;
    decimals: number;
    wrappedSymbol: string;
    wrappedAddress: string;
  };
}
