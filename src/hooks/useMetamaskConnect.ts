import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected, SupportedChainIds } from '../connectors';

interface EthereumRequestArgs {
  chainId: string | number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals?: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

const addEthereumChain = async (args: EthereumRequestArgs): Promise<void> => {
  // @ts-ignore
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    // method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: args.chainId,
        chainName: args.chainName,
        nativeCurrency: {
          name: args.nativeCurrency.name,
          symbol: args.nativeCurrency.symbol,
          decimals: args.nativeCurrency.decimals || 18
        },
        rpcUrls: args.rpcUrls,
        blockExplorerUrls: args.blockExplorerUrls
      }
    ]
  });
};

const switchEthereumNetwork = async (hexChainId: string | number): Promise<void> => {
  // @ts-ignore
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: hexChainId }]
  });
};

interface MetamaskAuthFunctions {
  connect: () => void;
  disconnect: () => void;
}

export const useMetamaskConnect = (): MetamaskAuthFunctions => {
  const { activate, deactivate } = useWeb3React();
  const chainId: string | SupportedChainIds = process.env.REACT_APP_CHAIN_ID || 80001;

  const connect = useCallback(async () => {
    switch (chainId as SupportedChainIds) {
      case 137: {
        const switchNetwork = async (): Promise<void> => {
          await switchEthereumNetwork('0x89');
        };

        try {
          await switchNetwork();
        } catch (error) {
          console.log('Cannot switch network! Chain id: 0x89.', error);
        }

        try {
          await addEthereumChain({
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
              name: 'Matic',
              symbol: 'MATIC'
            },
            rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
            blockExplorerUrls: ['https://explorer.matic.network/']
          });
        } catch (error) {
          console.log('Cannot add network! Chain id: 0x89.', error);
        }

        break;
      }

      case 80001: {
        const switchNetwork = async (): Promise<void> => {
          await switchEthereumNetwork('0x13881');
        };

        try {
          await switchNetwork();
        } catch (error) {
          console.log('Cannot add switch! Chain id: 0x89.', error);
        }

        try {
          await addEthereumChain({
            chainId: '0x13881',
            chainName: 'Mumbai TestNet',
            nativeCurrency: {
              name: 'Matic',
              symbol: 'tMATIC'
            },
            rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
            blockExplorerUrls: ['https://mumbai-explorer.matic.today/']
          });
        } catch (error) {
          console.log('Cannot add network! Chain id: 0x89.', error);
        }

        break;
      }

      default: {
        throw new Error('Cannot connect to Metamask!');
      }
    }

    await activate(injected);
  }, []);

  return {
    connect,
    disconnect: deactivate
  };
};
