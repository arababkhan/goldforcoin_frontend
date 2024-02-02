import { makeVar } from '@apollo/client';

export enum MultiWallet {
    metaMask = 'metamask',
    walletConnect = 'walletconnect',
    coinBase = 'coinbase'
};

export const walletVar = makeVar<MultiWallet | undefined>(undefined);

export const connectWalletModalVar = makeVar<boolean>(false);
export const wrongNetworkModalVar = makeVar<boolean>(false);

export const setWalletStorage = (provider: MultiWallet | undefined) => {
    provider ? window.localStorage.setItem('provider', provider) : window.localStorage.removeItem('provider');
}

export const clearMultiWalletVars = () => {
    setWalletStorage(undefined);
}