import React, { ReactElement, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { HashRouter as Routers } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProviderEnum, themeVar } from '../graphql/variables/Shared';
import { MultiWallet } from '../graphql/variables/WalletVariable';
import { darkTheme, lightTheme, Theme } from '../styles/theme';
import Router from '../routes/Routes';
import { ConnectWalletModal } from './multi-wallet/ConnectWalletModal';
import { multiWalletService } from '../services/MultiWalletService';
import { ModalTransaction } from './transaction/TransactionModal';

import './App.css';

export default function App(): ReactElement<Theme> {
  const theme = useReactiveVar(themeVar)

  useEffect(() => {
    const autoConnect = async () => {
      const provider = window.localStorage.getItem('provider') as MultiWallet | undefined
      await multiWalletService(provider).connect()
    }

    autoConnect()
  }, [])

  return (
    <>
    <ToastContainer toastClassName='toastContainerBox' transition={Flip} position='top-center' />
    <ThemeProvider theme={theme === ThemeProviderEnum.dark ? darkTheme : lightTheme }>
      <Routers>
        <Router />
        <ConnectWalletModal />
        <ModalTransaction />
      </Routers>
    </ThemeProvider>
    </>
  );
}
