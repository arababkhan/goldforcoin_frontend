/* eslint-disable no-console */
import { coinbaseWallet } from "../connectors/coinbaseWallet";
import { metaMask } from "../connectors/metaMask";
import { walletConnect } from "../connectors/walletConnect";

import {
  MultiWallet,
  setWalletStorage,
  walletVar
} from '../graphql/variables/WalletVariable'

interface MultiWalletService {
  connect(): Promise<void>
}

export const multiWalletService = (provider: string | undefined): MultiWalletService => {
  switch (provider) {
    case MultiWallet.metaMask:
      return metaMaskProvider()
    case MultiWallet.walletConnect:
      return walletConnectProvider()
    case MultiWallet.coinBase:
      return coinBaseProvider()
    default:
      return metaMaskProvider()
  }
}

const metaMaskProvider = (): MultiWalletService => {
  return {
    connect: async () => {
      await metaMask.activate();
      setWalletStorage(MultiWallet.metaMask)
      walletVar(MultiWallet.metaMask)
    }
  }
}

const walletConnectProvider = (): MultiWalletService => {
  return {
    connect: async () => {
      await walletConnect.activate();
      setWalletStorage(MultiWallet.walletConnect)
      walletVar(MultiWallet.walletConnect)
    }
  }
}

const coinBaseProvider = () => {
  return {
    connect: async () => {
      await coinbaseWallet.activate();
      setWalletStorage(MultiWallet.coinBase)
      walletVar(MultiWallet.coinBase)
    }
  }
}
