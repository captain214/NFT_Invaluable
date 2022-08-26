import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { injected } from '../connectors';

export const useInactiveListener = (suppress = false): void => {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        activate(injected, undefined, true).catch((e) => {
          console.error('Failed to activate after connect', e);
        });
      };
      const handleChainChanged = () => {
        activate(injected, undefined, true).catch((e) => {
          console.error('Failed to activate after chain changed', e);
        });
      };
      const handleAccountsChanged = () => {
        activate(injected, undefined, true).catch((e) => {
          console.error('Failed to activate after accounts changed', e);
        });
      };
      const handleNetworkChanged = () => {
        activate(injected, undefined, true).catch((e) => {
          console.error('Failed to activate after networks changed', e);
        });
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
    return undefined;
  }, [active, error, suppress, activate]);
};
