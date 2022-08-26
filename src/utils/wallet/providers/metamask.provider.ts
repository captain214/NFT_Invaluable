/* eslint-disable @typescript-eslint/lines-between-class-members */
import Web3 from 'web3';
import { OptionalTuple } from '../../types';
import { IMetaMaskProvider } from '../interfaces';

export class MetaMaskProvider implements IMetaMaskProvider {
  private readonly wallet: Web3;
  // @ts-ignore
  private readonly eth = window.ethereum;

  constructor() {
    // @ts-ignore
    this.wallet = new Web3(this.eth);
  }

  async connect(): Promise<void> {
    try {
      // @ts-ignore
      await this.wallet.currentProvider?.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log('error in "connect" method of MetaMask:', error);
    }
  }

  checkIfDetected(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.eth !== undefined) {
        return resolve(true);
      }

      if (this.eth === undefined) {
        return resolve(false);
      }

      return reject();
    });
  }

  async getBalance(address: string): Promise<OptionalTuple<string, Error>> {
    try {
      const balance = await this.wallet.eth.getBalance(address);

      return [balance, null];
    } catch (err) {
      const error = err as Error;

      return [null, error];
    }
  }

  async getAccounts(): Promise<OptionalTuple<string[], Error>> {
    try {
      const accounts = await this.wallet.eth.getAccounts();

      return [accounts, null];
    } catch (err) {
      const error = err as Error;

      return [null, error];
    }
  }

  async checkIfLocked(): Promise<boolean> {
    const [accounts, error] = await this.getAccounts();

    if (error !== null) {
      return true;
    }

    if (accounts!.length === 0) {
      return true;
    }

    return false;
  }

  async currentUser(): Promise<string | undefined> {
    const [accounts, error] = await this.getAccounts();

    if (accounts !== null) {
      return accounts[0];
    }

    return undefined;
  }
}
