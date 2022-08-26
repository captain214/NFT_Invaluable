export interface IMetaMaskProvider {
  checkIfDetected(): Promise<boolean>;
  checkIfLocked(): Promise<boolean>;
  connect(): Promise<void>;
}
