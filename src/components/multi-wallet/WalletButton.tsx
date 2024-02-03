import { useReactiveVar } from '@apollo/client'
import { Button } from 'antd'
import React, { useContext, useState } from 'react'
import {NavLink} from 'react-router-dom';
import styled from 'styled-components'
import iconMetamask from '../../assets/multi-wallet/metamask.svg'
import iconWalletConnect from '../../assets/multi-wallet/walletConnect.svg'
import iconWalletWhite from '../../assets/multi-wallet/wallet_white.svg'
import { connectWalletModalVar, MultiWallet, walletVar } from '../../graphql/variables/WalletVariable'
import { formatShortAddress } from '../../services/UtilService'
import { useWeb3React } from "@web3-react/core"
import { AppContext } from '../../contexts';

export const WalletButton: React.FC = () => {
  const { account } = useWeb3React();
  const { user } = useContext(AppContext);
  const wallet = useReactiveVar(walletVar);

  const providerIcon = (providerItem: MultiWallet | undefined) => {
    const walletIcons: { name: MultiWallet; icon: string }[] = [
      {
        name: MultiWallet.metaMask,
        icon: iconMetamask
      },
      {
        name: MultiWallet.walletConnect,
        icon: iconWalletConnect
      }
    ]

    return walletIcons.find(w => w.name === providerItem)
  }
  const openConnectWalletModal = () => {
    connectWalletModalVar(true)
  }

  const [isSubMenu, setSubMenu] = useState(false);
  
  const onClick = () => {
    setSubMenu(isSubMenu === false ? true : false);
  };
  
  let submenuClass = ["sub__menus"];
  if(isSubMenu) {
      submenuClass.push('sub__menus__Active');
  } else {
      submenuClass.push('');
  }

  let w_prov: any = providerIcon(wallet);

  return (
    <>
      {!account ? (
        <S.Container>
          <S.ButtonConnectWallet onClick={openConnectWalletModal}>
            Connect Wallet
            <img src={iconWalletWhite} alt='Wallet' />
          </S.ButtonConnectWallet>
        </S.Container>
      ) : (
        <li onClick={onClick} className="menu-item sub__menus__arrows " > 
          <S.ButtonAccount>{formatShortAddress(account)}{wallet && <img src={w_prov? w_prov.icon:''} alt={w_prov? w_prov.name:''} />}</S.ButtonAccount>  
          <S.SubMenu className={submenuClass.join(' ')} > 
                <li className='sub-item'> <NavLink className={({ isActive }) => isActive ? 'is-active' : undefined}  to={`/`}> <S.MenuText>Home</S.MenuText> </NavLink> </li>
                {user.authenticated? (
                  <>
                    <li className='sub-item'><NavLink className={({ isActive }) => isActive ? 'is-active' : undefined} to={`/order`}> <S.MenuText>My Orders</S.MenuText> </NavLink> </li>
                  </>
                  ): (
                    <></>
                  )
                }   
            </S.SubMenu>
        </li>
      )}
    </>
  )
}
const S = {
  SubMenu: styled.ul `
    background: #3a4a82;
  `,
  MenuText: styled.div `
    color: ${props => props.theme.white};
  `,
  Container: styled.div`
    display: flex;
    margin-top: 20px;
    margin-right: ${props => props.theme.margin.xs};
  `,
  ButtonConnectWallet: styled(Button)`
    display: block;
    height: 48px;
    border-radius: ${props => props.theme.borderRadius.xl};
    border: none;
    background: ${props => props.theme.blue.main};
    color: #fff;
    padding: 0 16px;
    font-family: ${props => props.theme.fonts.primary};
    font-style: normal;
    font-weight: 400;
    font-size: 16px;

    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;

    img {
      width: 24px;
      height: auto;
      margin-left: 14px;
    }

    &:hover,
    &:active {
      background: ${props => props.theme.yellow.darker};
      color: #fff !important;
      box-shadow: none;
      border: none;
      outline: none;
    }
    &:focus {
      color: #fff;
    }

    &::after {
      display: none;
    }
  `,
  ButtonAccount: styled(Button)`
    display: block;
    width: 198px;
    height: 48px;
    border-radius: ${props => props.theme.borderRadius.xl};
    border: 1px solid ${props => props.theme.blue.main};
    background: ${props => props.theme.blue.main};
    color: white;
    padding: 8px 8px 8px 16px;
    font-family: ${props => props.theme.fonts.primary};
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    margin-top: 23px;

    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;

    img {
      width: 24px;
      height: 24px;
      margin-left: 20px;
    }

    &:hover,
    &:active {
      background: ${props => props.theme.yellow.darker};
      color: white !important;
      box-shadow: none;
      border: none;
      outline: none;
    }
    
    &::after {
      display: none;
    }
  `,
  ButtonWrong: styled(Button)`
    width: 200px;
    height: 48px;
    background: ${props => props.theme.red.main};
    border-radius: 8px;
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    padding-left: 10px;
    padding-right: 10px;
    span {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 130%;
      color: ${props => props.theme.white};
    }
    img {
      margin-left: 10px;
    }
    &:hover {
      background: ${props => props.theme.red.main};
    }
  `,
  Account: styled.span`
    padding-right: 24px;
  `
}
