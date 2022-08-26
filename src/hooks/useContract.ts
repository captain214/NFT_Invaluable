import { Contract } from '@ethersproject/contracts';
import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';

import ERC721_ABI from '../constants/abis/erc721-streak-contract.json';
import ERC1155_ABI from '../constants/abis/erc1155-streak-contract.json';
import EXCHANGE_ABI from '../constants/abis/exchange-streak-contract.json';
import AUCTION_FACTORY_ABI from '../constants/abis/auction-factory-streak-contract.json';
import { getContract } from '../utils/eth-utils';
import { Chain } from '../constants/chains';

export const exchangeContractsAddresses: Record<Chain, string | undefined> = {
  [Chain.RINKEBY]: process.env.REACT_APP_EXCHANGE,
  [Chain.MUMBAI]: process.env.REACT_APP_MUMBAI_EXCHANGE,
  [Chain.LOCAL]: process.env.REACT_APP_LOCAL_EXCHANGE
};

const auctionFactoryContractsAddresses: Record<Chain, string | undefined> = {
  [Chain.RINKEBY]: process.env.REACT_APP_AUCTION_FACTORY_RINKEBY,
  [Chain.MUMBAI]: process.env.REACT_APP_AUCTION_FACTORY_MUMBAI,
  [Chain.LOCAL]: process.env.REACT_APP_AUCTION_FACTORY_LOCAL
};

const erc721ContractsAddresses: Record<Chain, string | undefined> = {
  [Chain.RINKEBY]: process.env.REACT_APP_ERC721_TOKEN_RINKEBY,
  [Chain.MUMBAI]: process.env.REACT_APP_ERC721_TOKEN_MUMBAI,
  [Chain.LOCAL]: process.env.REACT_APP_ERC721_TOKEN_LOCAL
};

const erc1155ContractsAddresses: Record<Chain, string | undefined> = {
  [Chain.RINKEBY]: process.env.REACT_APP_ERC1155_TOKEN_RINKEBY,
  [Chain.MUMBAI]: process.env.REACT_APP_ERC1155_TOKEN_MUMBAI,
  [Chain.LOCAL]: process.env.REACT_APP_ERC1155_TOKEN_LOCAL
};

function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;

    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useErc721StreakContract(chain?: Chain): Contract | null {
  const contractAddress = chain && erc721ContractsAddresses[chain];
  return useContract(contractAddress, ERC721_ABI);
}

export function useErc1155StreakContract(chain?: Chain): Contract | null {
  const contractAddress = chain && erc1155ContractsAddresses[chain];
  return useContract(contractAddress, ERC1155_ABI);
}

export function useExchangeStreak(chain?: Chain): Contract | null {
  const contractAddress = chain && exchangeContractsAddresses[chain];
  return useContract(contractAddress, EXCHANGE_ABI);
}

export function useAuctionFactoryStreak(chain?: Chain): Contract | null {
  const contractAddress = chain && auctionFactoryContractsAddresses[chain];
  return useContract(contractAddress, AUCTION_FACTORY_ABI);
}
