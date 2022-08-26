export enum Chain {
  RINKEBY = 'rinkeby',
  MUMBAI = 'mumbai',
  LOCAL = 'local'
}

export const chainIds: Record<Chain, number> = {
  [Chain.RINKEBY]: 4,
  [Chain.MUMBAI]: 80001,
  [Chain.LOCAL]: Number(process.env.REACT_APP_CHAIN_ID_LOCAL) || 1337
};

export const chainTitles: Record<Chain, string> = {
  [Chain.RINKEBY]: 'Rinkeby Testnet',
  [Chain.MUMBAI]: 'Matic Mumbai Testnet',
  [Chain.LOCAL]: 'Local Network Testnet'
};

export const getChainById = (chainId?: number): Chain | undefined => {
  if (!chainId) return undefined;
  const chainKeys = Object.keys(chainIds) as Chain[];
  return chainKeys.find((i) => chainIds[i] === chainId);
};

export const getTransactionLink = (chain: Chain, txHash?: string): string => {
  switch (chain) {
    case Chain.RINKEBY:
      return `https://rinkeby.etherscan.io/tx/${txHash}`;
    case Chain.MUMBAI:
      return `https://mumbai.polygonscan.com/tx/${txHash}`;
    default:
      return '';
  }
};

export const getAddressLink = (chain: Chain, address?: string): string => {
  switch (chain) {
    case Chain.RINKEBY:
      return `https://rinkeby.etherscan.io/address/${address}`;
    case Chain.MUMBAI:
      return `https://mumbai.polygonscan.com/address/${address}`;
    default:
      return '';
  }
};
