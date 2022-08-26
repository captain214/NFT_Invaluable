import { InjectedConnector } from '@web3-react/injected-connector';

const supportedChainIds = [1, 3, 4, 137, 80001] as const;
export const injected = new InjectedConnector({ supportedChainIds } as any);

export type SupportedChainIds = typeof supportedChainIds[number];
