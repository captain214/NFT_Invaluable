import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import { useEagerConnect } from '../../../hooks/useEagerConnect';
import { useInactiveListener } from '../../../hooks/useInactiveListener';

const Web3ReactManager: ({ children }: { children: JSX.Element }) => JSX.Element = ({
  children
}: {
  children: JSX.Element;
}) => {
  const context = useWeb3React<Web3Provider>();
  const { connector } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<never>();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return children;
};

export default Web3ReactManager;
