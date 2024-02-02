import { Button, Input, Row, Col, Typography, Tabs, Modal } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useSignerOrProvider } from "../hooks/useSignerOrProvider";
import { DefaultPageTemplate } from './template/DefaultPageTemplate'
import { Countries } from '../components/admin/Countries'
import { Products } from '../components/admin/Products'
import { Orders } from '../components/admin/Orders'
import { AppContext } from '../contexts';
import { getContract } from "../services/UtilService";
import { notifyError } from '../services/NotificationService'
import { setAdmin } from '../services/UserService'
import contractAbi from '../abi/tokenWallet.json'
import erc20Abi from '../abi/erc20.json'
import {coins} from '../services/UtilService'
import { clearTransaction, handleTransaction, TransactionType } from '../graphql/variables/TransactionVariable'
import { UserData } from '../types/userType'
import { chainConfig } from '../config'
import { fonts } from '../styles/variables'

const { Title } = Typography
const { TabPane } = Tabs

export default function AdminPage() {
  const {account, chainId} = useWeb3React()
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress
  const usdcAddress = chainConfig(chainId)?.usdcAddress
  const usdtAddress = chainConfig(chainId)?.usdtAddress
  const { user, setUser } = useContext(AppContext)
  const navigate = useNavigate()
  const [usdtBalance, setUsdtBalance] = useState(0)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [adminAddress, setAdminAddress] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [isShowConfirmAdmin, setIsShowConfirmAdmin] = useState(false)
  const [isShowConfirmWithdraw, setIsShowConfirmWithdraw] = useState(false)

  useEffect(() => {
    async function getBalance() {
      if(!!signerOrProvider && account && contract_address) {
        let decimals = 18
        if(chainId === 1 || chainId === 5)
          decimals = 6
        const erc20UsdtContract = getContract(usdtAddress || '', erc20Abi, signerOrProvider)
        const erc20UsdcContract = getContract(usdcAddress || '', erc20Abi, signerOrProvider)
        try {
          let w_balance = await erc20UsdtContract.balanceOf(contract_address)
          w_balance = coins(w_balance.toString(), decimals)
          w_balance = Math.round(w_balance*1000)/1000
          setUsdtBalance(w_balance)
          w_balance = await erc20UsdcContract.balanceOf(contract_address)
          w_balance = coins(w_balance.toString(), decimals)
          w_balance = Math.round(w_balance*1000)/1000
          setUsdcBalance(w_balance)
        } catch (e) {
          setUsdcBalance(0)
          setUsdtBalance(0)
        }
      }
    }
    if (!user.role) {
      notifyError('You do not have permission!')
      navigate("/")
    } else {
      getBalance()
    }
  }, [user.account])

  const handleSetAdmin = () => {
    if(!adminAddress) {
      notifyError("Please input valid address")
      return
    }
    setIsShowConfirmAdmin(true)
  }

  const handleSetWithdrawer = () => {
    if(!withdrawAddress){
      notifyError("Please input valid address")
      return
    }
    setIsShowConfirmWithdraw(true)
  }

  const handleWithdraw = async(coin:string) => {
    if(!!signerOrProvider && account && contract_address) {
      let decimals = 18
        if(chainId === 1 || chainId === 5)
          decimals = 6
      const contract = getContract(contract_address, contractAbi, signerOrProvider);
      const erc20Contract = getContract((coin === 'usdt' ? usdtAddress ||'' : usdcAddress ||''), erc20Abi, signerOrProvider)
      try {
        let w_balance = await erc20Contract.balanceOf(contract_address)
        const funcTx = await contract.withdraw(w_balance, (coin === 'usdt' ? true : false))
        funcTx? handleTransaction(funcTx.hash, TransactionType.withdraw) : clearTransaction();
        await funcTx.wait()
        w_balance = await erc20Contract.balanceOf(contract_address)
        w_balance = coins(w_balance.toString(), decimals)
        w_balance = Math.round(w_balance*1000)/1000
        if(coin === 'usdt')
          setUsdtBalance(w_balance)
        else
          setUsdcBalance(w_balance)
      } catch (e) {
        notifyError('transaction failed')
      }
    }
  }

  const handleCancel = () => {
    setIsShowConfirmWithdraw(false)
    setIsShowConfirmAdmin(false)
  }

  const confirmWithdraw = async () => {
    setIsShowConfirmWithdraw(false)
    if(!!signerOrProvider && account && contract_address) {
      const contract = getContract(contract_address, contractAbi, signerOrProvider);
      try {
        const funcTx = await contract.setWithdrawAddress(withdrawAddress)
        funcTx? handleTransaction(funcTx.hash, TransactionType.setwithdraw) : clearTransaction();
        await funcTx.wait()
      } catch (e) {
        notifyError('transaction failed')
      }
    }
  }

  const confirmAdmin = async () => {
    setIsShowConfirmAdmin(false)
    if(!!signerOrProvider && account && contract_address) {
      const contract = getContract(contract_address, contractAbi, signerOrProvider);
      try {
        const funcTx = await contract.transferOwnership(adminAddress)
        funcTx? handleTransaction(funcTx.hash, TransactionType.setowner) : clearTransaction();
        await funcTx.wait()
        let w_res:UserData = await setAdmin(adminAddress, user._id, user.account)
        setUser(w_res)
      } catch (e) {
        notifyError('transaction failed')
      }
    }
  }

  return (
    <>    
    <DefaultPageTemplate fullWidth marginMax> 
      <Row>
        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
          <Row>
            <S.Title className="white sub-title">Balance</S.Title>
          </Row>
          <Row align={'middle'} >
            <Col xs={24} md={12} style={{padding: '10px 0px 10px 30px'}}>
            <Row justify={'space-between'} align={'middle'}>
              <div>
              <S.Title style={{display: 'inline', marginRight: '20px'}} className="blueberry-lighter orderDesc">USDT</S.Title>
              <S.Title style={{display: 'inline'}} className="white orderDesc">{usdtBalance}</S.Title>
              </div>
              <S.Button style={{marginLeft: '15px'}} onClick={() => {handleWithdraw('usdt')}}>Withdraw</S.Button>
            </Row>
            </Col>
            <Col xs={24} md={12} style={{padding: '10px 0px 10px 30px'}}>
            <Row justify={'space-between'} align={'middle'}>
              <div>
              <S.Title style={{display: 'inline', marginRight: '20px'}} className="blueberry-lighter orderDesc">USDC</S.Title>
              <S.Title style={{display: 'inline'}} className="white orderDesc">{usdcBalance}</S.Title>
              </div>
              <S.Button style={{marginLeft: '15px'}} onClick={() => {handleWithdraw('usdc')}}>Withdraw</S.Button>
            </Row>
            </Col>
          </Row>
          <Row>
            <S.Title className="white sub-title">Set Admin</S.Title>
          </Row>
          <Row justify={'space-between'} align={'middle'} >
            <S.Input name="address" value={adminAddress} onChange={(e) => setAdminAddress(e.target.value)} placeholder='Admin address'/>
            <S.Button style={{width: '80px'}} onClick={handleSetAdmin}>Set</S.Button>
          </Row>
          <Row>
          <S.Title className="white sub-title">Withdraw Address</S.Title>
          </Row>
          <Row justify={'space-between'} align={'middle'} >
            <S.Input name="address" value={withdrawAddress} onChange={(e) => setWithdrawAddress(e.target.value)} placeholder='Admin address'/>
            <S.Button style={{width: '80px'}} onClick={handleSetWithdrawer}>Set</S.Button>
          </Row>
          <Row style={{marginTop: '40px'}}>
            <S.Tabs defaultActiveKey="1">
              <TabPane tab="Countries" key="1">
                <Countries />
              </TabPane>
              <TabPane tab="Products" key="2">
                <Products />
              </TabPane>
              <TabPane tab="Orders" key="3">
                <Orders />
              </TabPane>
            </S.Tabs>
          </Row>
        </Col>
      </Row>
      <S.Modal onCancel={handleCancel} onOk={confirmAdmin} open={isShowConfirmAdmin}>
        <h1>Please confirm again</h1>
        <h2>{adminAddress}</h2>
        
      </S.Modal>
      <S.Modal onCancel={handleCancel} onOk={confirmWithdraw} open={isShowConfirmWithdraw}>
        <h1>Please confirm again</h1>
        <h2>{withdrawAddress}</h2>  
      </S.Modal>
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  Title: styled(Title) `
    font-family: 'Changa';
    &.sub-title {
      margin: 30px 0px 10px !important;
      font-weight: 300 !important;
      font-size: 1.5rem !important;
    }
    &.white {
      color: ${props=>props.theme.white};
    } 
    &.blueberry-lighter {
      color: ${props=>props.theme.blueberry.lighter};
    }   
    &.orderDesc {
      font-weight: 200 !important;
      font-size: 1rem !important;
      margin-top: 10px !important;
    }
  `,
  Button: styled(Button)`
    background: ${props=>props.theme.blue.main};
    color: ${props=>props.theme.white};
    font-weight: 200;
    font-family: 'Changa';
    border: 0px solid;
    cursor: pointer !important;
    &:hover,
    &:active,
    &:focus {
      background-color: ${props=>props.theme.yellow.darker};
      color: ${props=>props.theme.white} !important;
    }
  `,
  Input: styled(Input)`
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: ${(props)=>props.theme.white};
    background: transparent;
    background-clip: padding-box;
    border: 1px solid ${(props)=>props.theme.blueberry.lighter};
    border-radius: 0.25rem;
    max-width: 100%;
    display: inline-block;
    font-family: 'Changa';
    &::placeholder {
      color: white;
    }
    @media (min-width: 230px) {
      margin-bottom: 10px;
    }
    @media (min-width: 530px) {
      max-width: 350px;
      margin-bottom: 0px;
    }
    
  `,
  Tabs: styled(Tabs)`
    width: 100% !important;
    .ant-tabs-tab {
      
      color: white; // Color for tab titles
      font-family: 'Changa';
      font-size: 18px;
      &.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: white !important;
      }
    }
    .ant-tabs-ink-bar {
      background-color: ${(props)=>props.theme.blueberry.lighter};
    }
  `,
  Modal: styled(Modal)`
    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-footer {
      display: flex;
      justify-content: center;

      .ant-btn-default {
        background-color: ${props=>props.theme.yellow.darker}; 
        border: 0px solid; 
      }
    }
    .ant-modal-content {
      background: ${props => props.theme.blueberry.light};
      border-radius: 16px;
      max-width: 300px;
      margin: auto;
      h1 {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        color: ${props=>props.theme.white};
      }
      h2 {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        color: ${props=>props.theme.white};
      }
      span {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: ${props=>props.theme.white};
      }
      .ant-modal-close {
        display: none;
      }
    }
    .ant-modal-header {
      background: ${props => props.theme.blueberry.light};
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      border-bottom: none;
    }
  `
}
