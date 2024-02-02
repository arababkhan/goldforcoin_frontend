import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { Button, Checkbox, Modal, Divider } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import metamaskIcon from '../../assets/multi-wallet/metamask.svg'
import walletConnectIcon from '../../assets/multi-wallet/walletConnect.svg'
import coinBaseIcon from '../../assets/multi-wallet/coinbase_Logo.png'
import { connectWalletModalVar, MultiWallet } from '../../graphql/variables/WalletVariable'
import { multiWalletService } from '../../services/MultiWalletService'
import { colorsV2, fonts } from '../../styles/variables'
import { useWeb3React } from "@web3-react/core"

interface Wallet {
  key: number
  name: string
  code: MultiWallet
  image: string
  active: boolean
  loading: boolean
  disabled: boolean
}
interface Network {
  key: number
  name: string
  image: string
  active: boolean
  chainId: number
}

export const ConnectWalletModal = () => {
  const connectWalletModal = useReactiveVar(connectWalletModalVar)
  const { account } = useWeb3React();
  const [walletList, setWalletList] = useState<Wallet[]>([
    {
      key: 0,
      name: 'MetaMask',
      code: MultiWallet.metaMask,
      image: metamaskIcon,
      active: false,
      loading: false,
      disabled: true
    },
    // {
    //   key: 1,
    //   name: 'WalletConnect',
    //   code: MultiWallet.walletConnect,
    //   image: walletConnectIcon,
    //   active: false,
    //   loading: false,
    //   disabled: true
    // },
    // {
    //   key: 2,
    //   name: 'Coinbase Wallet',
    //   code: MultiWallet.coinBase,
    //   image: coinBaseIcon,
    //   active: false,
    //   loading: false,
    //   disabled: true
    // }
  ])

  const setLoading = (key: number | undefined) => {
    const newWalletList: Wallet[] = []
    walletList.forEach(wallet => {
      if (wallet.key === key) {
        const walletUpdate = {
          ...wallet,
          loading: true
        }
        newWalletList.push(walletUpdate)
      } else {
        const walletUpdate = {
          ...wallet,
          loading: false
        }
        newWalletList.push(walletUpdate)
      }
    })
    setWalletList(newWalletList)
  }

  const selectWallet = async (wallet: Wallet) => {
    setLoading(wallet.key)
    await multiWalletService(wallet.code).connect()
    setLoading(undefined)
  }

  useEffect(() => {
    if (account) {
      handleCancel()
    }
  }, [account])

  const handleCancel = () => {
    connectWalletModalVar(false)
  }

  return (
    <S.Modal title='Connect Your Wallet' onCancel={handleCancel} open={!!connectWalletModal} footer={null} destroyOnClose>
      <div>
        <S.BoxContainer>
          <S.ContainerCards>
              {walletList.map(wallet => (
                <div key={wallet.key + 'pan'} style={{margin: '5px 10px'}}>
                  <S.CardButton
                    key={wallet.key}
                    onClick={() => selectWallet(wallet)}
                    loading={wallet.loading}
                  >
                    <div key={wallet.key + 'div'}>
                      <img alt={wallet.name} src={wallet.image} />
                      <span>{wallet.name}</span>
                    </div>
                  </S.CardButton>
                </div>
              ))}
            
          </S.ContainerCards>
        </S.BoxContainer>
      </div>
      <Divider />
        <div style={{ margin: "auto", fontSize: "15px", marginBottom: "15px", color: 'white' }}>
          Need help installing a wallet?{" "}
          <a
            href="https://metamask.zendesk.com/hc/en-us/articles/360015489471-How-to-Install-MetaMask-Manually"
            target="_blank"
            rel="noopener"
          >
            Click here
          </a>
        </div>

        <div style={{ margin: "auto", fontSize: "10px", color: 'white' }}>
          Wallets are provided by External Providers and by selecting you agree to Terms of those Providers. Your access
          to the wallet might be reliant on the External Provider being operational.
        </div>
    </S.Modal>
  )
}
const S = {
  Modal: styled(Modal)`
    .ant-modal-content {
      background: ${props => props.theme.blueberry.light};
      border-radius: 16px;
      width: 320px;
      margin: auto;
    }
    .ant-modal-body {
      display: flex;
      padding: 32px 32px;
      padding-top: 0px;
      flex-direction: column;
      > div {
        display: flex;
        flex-direction: column;
        > h4 {
          margin-top: 8px;
          margin-bottom: 8px;
          font-size: 1.4rem;
          line-height: 1.6rem;
          font-weight: 400;
          color: ${props=>props.theme.white};
        }
        &:not(:last-child) {
          margin-bottom: 16px;
        }
      }
    }
    .ant-modal-header {
      background: ${props => props.theme.blueberry.light};
      padding: 16px 32px;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      border-bottom: none;
    }
    .ant-modal-title {
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 20px;
      padding-bottom: 16px;
      color: ${props=>props.theme.white};
      text-align: center;
      margin-top: 4px;
    }
    .ant-modal-close-x {
      display: flex;
      justify-content: center;
      align-items: center;
      display: none;
      height: 48px;
    }
  `,
  BoxContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px 0px;
  `,
  ContainerCards: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      color: ${props=>props.theme.white};
      line-height: 18px;
      margin-bottom: 16px;
    }

    div {
      display: flex;
      gap: 0px 16px;
    }
  `,
  CardButton: styled(Button)`
    display: flex;
    flex-direction: row;
    border: 0px solid;
    border-radius: 8px;
    background: ${props => props.theme.blue.darker};;
    justify-content: center;
    align-items: center;
    height: 55px;
    width: 220px;

    cursor: pointer;
    white-space: normal;
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 120%;
    color: ${props=>props.theme.white};
    box-shadow: 1px 1px 5px hsla(0, 0%, 0%, 0.05);
    &::after {
      display: none;
    }
    &.active {
      border: 1px solid;
      border-color: ${colorsV2.secondary.main};
      background: ${props => props.theme.yellow.darker};
      box-shadow: 1px 1px 5px hsla(0, 0%, 0%, 0.05);
    }
    &.disabled {
      background: ${props=>props.theme.gray[0]};
      cursor: not-allowed;
    }
    &:hover {
      background: ${props => props.theme.yellow.darker};
      color: ${props=>props.theme.white};
    }
    &:focus {
      border-color: ${colorsV2.secondary.main};
      color: ${props=>props.theme.white};
    }
    div {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: start;
      img {
        height: 30px;
        width: 30px;
        margin-bottom: 4px;
      }
      span {
        font-size: 0.9rem;
        line-height: 1.4rem;
        margin-top: 4px;
        color: ${props=>props.theme.white};
      }
    }
  `,
  Checkbox: styled(Checkbox)`
    color: ${colorsV2.gray[4]};
    font-size: 12px;
    line-height: 14px;
    font-weight: 400;
    margin-top: 8px;
    a {
      color: ${colorsV2.blue.main};
      &:hover {
        opacity: 0.7;
      }
    }
  `
}
