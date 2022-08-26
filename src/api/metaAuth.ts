import { LocalStorageKeys } from '../constants/local-storage-keys.enum';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000';
type WindowInstanceWithEthereum = Window & typeof globalThis & { ethereum?: any; web3: any };

export const metaAuth = async (address: string): Promise<string> => {
  const { ethereum } = window as WindowInstanceWithEthereum;
  const getNonceUrl = `${SERVER_URL}/auth/${address}`;
  const options = { method: 'GET' };

  try {
    const nonce = await fetch(getNonceUrl, options).then((res) => res.text());
    const signature = await ethereum.request({
      method: 'eth_sign',
      params: [address, nonce]
    });
    return signature;
  } catch (err) {
    console.error(err);
    console.log(`Error: ${err.message}`);
    return 'error';
  }
};

export const doMetamaskAuthAndSaveTokenToLocalStorage = async (
  address: string
): Promise<string> => {
  const signature = await metaAuth(address);
  localStorage.setItem(
    LocalStorageKeys.METAMASK_BACKEND_TOKEN,
    JSON.stringify([address, signature])
  );
  return signature;
};

// ***
// To make client-authorizated requests to the backend, the client should have a
// special token, which is known only to this client and the backend.
// In this realization MetaMask is a provider for the token creating.
// Client can get this token in such way:
// 1. Send MetaMask signed nonce with his blockchain address
// to the backend on the special endpoint /auth/:address
// This process described here https://docs.metamask.io/guide/signing-data.html,
// For the user it looks like pressing the button "Sign" in the MetaMask window.
// 2. Backend will generate a token based on this nonce, will save token to database
// for further authentication checkings and will return the token to the client
// in this request.
// 3. Client keeps this token in the localStorage and for now client it can use
// this token in API requests with authentification.
// ***

export const getMetamaskBackendToken = async (address: string): Promise<string> => {
  let signature: string;

  const metamaskBackendToken = localStorage.getItem(LocalStorageKeys.METAMASK_BACKEND_TOKEN);
  if (!metamaskBackendToken) {
    signature = await doMetamaskAuthAndSaveTokenToLocalStorage(address);
  } else {
    let metamaskBackendTokenJSON;
    try {
      metamaskBackendTokenJSON = JSON.parse(metamaskBackendToken);
    } catch {
      signature = await doMetamaskAuthAndSaveTokenToLocalStorage(address);
      return signature;
    }

    const [currentAddress, token] = metamaskBackendTokenJSON;
    signature = token;
    if (!currentAddress || !token || currentAddress !== address) {
      signature = await doMetamaskAuthAndSaveTokenToLocalStorage(address);
    }
  }

  return signature;
};
