import { Button, InputNumber, Input, Row, Col, Typography, Image, Select, Radio, Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import type { RadioChangeEvent } from 'antd'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { DefaultPageTemplate } from './template/DefaultPageTemplate'
import { getWeightObjects, getPrices, getCountries } from '../services/AdminService'
import { useSwitchChain } from '../hooks/useSwitchChain'
import { Order, Product } from '../types/orderType'
import { addOrder } from '../services/OrderService'
import { fonts } from '../styles/variables'
import { chainConfig } from '../config'
import { useSignerOrProvider } from "../hooks/useSignerOrProvider";
import { getContract } from "../services/UtilService";
import contractAbi from '../abi/tokenWallet.json'
import erc20Abi from '../abi/erc20.json'
import {units, coins} from '../services/UtilService'
import { clearTransaction, handleTransaction, TransactionType } from '../graphql/variables/TransactionVariable'
import { notifyError } from '../services/NotificationService'

const { Title, Paragraph } = Typography
const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

interface product {
  weight: number
  quantity: number
}

interface country {
  value: string
  label: string
}

interface weight {
  value: number
  label: string
}

export default function MarketplacePage() {
  const {account, chainId} = useWeb3React()
  const signerOrProvider = useSignerOrProvider();

  const switchChain = useSwitchChain()
  const contract_address = chainConfig(chainId)?.contractAddress
  const usdcAddress = chainConfig(chainId)?.usdcAddress
  const usdtAddress = chainConfig(chainId)?.usdtAddress
  const [goldShipWeight, setGoldShipWeight] = useState(1)
  const [goldShipQuantity, setGoldShipQuantity] = useState(1)
  const [goldStorageWeight, setGoldStorageWeight] = useState(1)
  const [goldStorageQuantity, setGoldStorageQuantity] = useState(1)
  const [chain, setChain] = useState(1)
  const [coin, setCoin] = useState('usdt')
  const [email, setEmail] = useState('')
  const [full_name, setfull_name] = useState('')
  const [country, setCountry] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postcode, setPostcode] = useState('')
  const [isShippment, setIsShippment] = useState(false)
  const [isStorage, setIsStorage] = useState(false)
  const [products, setProducts] = useState<product[]>([])
  const [price, setPrice] = useState(0)
  const [shipCost, setShipCost] = useState(0)
  const [storageCost, setStorageCost] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [countriesForShip, setCountriesForShip] = useState<country[]>([])
  const [countriesForStorage, setCountriesForStorage] = useState<country[]>([])
  const [productWeights, setProductWeights] = useState<weight[]>([])
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false)

  useEffect(() => {
    async function getInitalValues () {
      let w_weights = await getWeightObjects()
      let w_prices = await getPrices()
      let w_countries = await getCountries()

      setProductWeights(w_weights)
      setPrice(w_prices.pricePerGram)
      setShipCost(w_prices.costShip)
      setStorageCost(w_prices.costStorage)
      let w_countriesForShip = w_countries.ship.map((country:string) => { return {value: country, label: country}})
      let w_countriesForStorage = w_countries.storage.map((country:string, index:number) => { return {value: country, label: country}})
      setCountry(w_countriesForShip.length > 0 ? w_countriesForShip[0].value : (w_countriesForStorage.length > 0 ? w_countriesForStorage[0].value : ''))
      setCountriesForShip(w_countriesForShip)
      setCountriesForStorage(w_countriesForStorage)
      setChain(chainId ? chainId : 1)
    }
    getInitalValues()
  }, [])

  const handleShipQuantity = (value: number | null) => {
    if (value !== null && value > 0) {
      setGoldShipQuantity(value);
    }
  };
  const handleStorageQuantity = (value: number | null) => {
    if (value !== null && value > 0) {
      setGoldStorageQuantity(value);
    }
  };

  const handleChain = (e: RadioChangeEvent) => {
    if(chain !== e.target.value)
    {
      setChain(e.target.value);
      switchChain(e.target.value)
    }
  }

  const handleCoin = (e: RadioChangeEvent) => {
    setCoin(e.target.value);
  }
  const handleContactInfo = (e:any) => {
    if(e.target.name === 'email') {
      setEmail(e.target.value)
    } else if(e.target.name === 'full_name') {
      setfull_name(e.target.value)
    } else if(e.target.name === 'address') {
      setAddress(e.target.value)
    } else if(e.target.name === 'city') {
      setCity(e.target.value)
    } else if(e.target.name === 'postcode') {
      setPostcode(e.target.value)
    }
  }

  const handleSetCountry = (value: any) => {
    setCountry(value)
  }

  const addGoldShipCarts = () => {
    if(!isShippment) {
      setProducts([])
      setTotalCost(shipCost + goldShipWeight * goldShipQuantity * price)
      setIsShippment(true)
    } else {
      setTotalCost(totalCost + goldShipWeight * goldShipQuantity * price)
    }

    setProducts([...products, {weight: goldShipWeight, quantity: goldShipQuantity}])
  }

  const addGoldStorageCarts = () => {
    if(!isStorage) {
      setProducts([])
      setTotalCost(storageCost + goldStorageWeight * goldStorageQuantity * price)
      setIsStorage(true)
    } else {
      setTotalCost(totalCost + goldStorageWeight * goldStorageQuantity * price)
    }
    
    setProducts([...products, {weight: goldStorageWeight, quantity: goldStorageQuantity}])
  }

  const handleOrder = () => {
    setIsShippment(false)
    setIsStorage(false)
    setProducts([])
    setTotalCost(0)
  }

  const handleCheckOut = async () => {
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if(!email || !address || !city || !postcode || !full_name) {
      notifyError("Please fill all the fields.")
      return
    } else if(!emailRegex.test(email)) {
      notifyError("Please enter valid email.")
      return
    }
    
    setIsShowConfirmModal(true)
  }

  const deleteCart = (event: any) => {
    let w_index = parseInt(event.currentTarget?.id)
    const updatedArray = removeNthElement(products, w_index);
    setTotalCost(totalCost - products[w_index-1].quantity * products[w_index-1].weight * price)
    setProducts(updatedArray)
  }

  function removeNthElement(arr:product[], n:number) {
    const newArr = [...arr];

    if (n > 0 && n <= newArr.length) {
        newArr.splice(n - 1, 1); 
    }

    return newArr;
  }

  const handleCancel = () => {
    setIsShowConfirmModal(false)
  }

  const handlePayment = async () => {
    setIsShowConfirmModal(false)
    if(chainId !== chain )
      switchChain(chain)
    
    if(!!signerOrProvider && account && contract_address) {
      let decimals = 18
      if(chainId === 1 || chainId === 5)
        decimals = 6

      const newAllowance = units(totalCost.toString(), decimals)
      const contract = getContract(contract_address, contractAbi, signerOrProvider);
      const erc20Contract = getContract((coin === 'usdt' ? usdtAddress ||'' : usdcAddress ||''), erc20Abi, signerOrProvider)
      try {
        const funcTx = await erc20Contract.approve(contract_address, newAllowance)
        funcTx? handleTransaction(funcTx.hash, TransactionType.approve) : clearTransaction();
        let w_res = await funcTx.wait()
        await delay(2000)
        let w_balance = await erc20Contract.balanceOf(account)
        w_balance = coins(w_balance.toString(), decimals)
        
        if(w_balance > totalCost) {
          const funcDepositTx = await contract.deposit(newAllowance, coin === 'usdt' ? true : false);
          funcDepositTx? handleTransaction(funcDepositTx.hash, TransactionType.deposit) : clearTransaction();
          w_res = await funcDepositTx.wait();
          let w_products: Product[] = []
          w_products = products.map((prod:product) => {
            let w_prod: Product = {weight: prod.weight, price: price, quantity: prod.quantity, cost: prod.weight*price*prod.quantity}
            return w_prod
          })     
          let w_order: Order = {
            user: account.toLowerCase(),
            email: email,
            full_name: full_name,
            country: country,
            address: address,
            city: city,
            code: postcode,
            prod_kind: isStorage?"Gold Storage" : "Gold with Shippment",
            chain: chain,
            coin: coin,
            shipfee: isStorage?storageCost : shipCost,
            cost: totalCost,
            status: "pending",
            transaction: w_res.transactionHash,
            products: w_products
          }
          await addOrder(w_order)
          setIsShippment(false)
          setIsStorage(false)
          setProducts([])
          setTotalCost(0)
        } else {
          notifyError('You have not enough balance')
        }
      } catch (error:any) {
        notifyError(error.reason?error.reason:'unknow error')
      }
    }    
  }

  let indexProd = 0
  return (
    <>    
    <DefaultPageTemplate fullWidth marginMax> 
      <Row>
        <Col xs={24} sm={24} md={10} lg={12} xl={16}>
          <div style={{marginTop: '50px'}}></div>
          <S.Title className="main-title white">DISCOVER THE</S.Title>
          <S.Title className="main-title blueberry-lighter">BEAUTY OF GOLD</S.Title>
          <S.Title className="main-title white">AT GOLDFORCRYPTO.IO</S.Title>
          <S.Paragraph className="white customMargin">
            Welcome to GOLDFORCRYPTO, your trusted destination to buy gold by crypto! Immerse yourself in
            the elegance of owning precious gold in its physical form, delivered right to your doorstep or in a secure goldstorage in switzerland.
            Our seamless process allows you to choose from a variety of payment options, including Tether (USDT), and USD Coin (USDC).
          </S.Paragraph>
        </Col>
        <S.Col xs={24} sm={24} md={14} lg={12} xl={8} className="goldImageCol">
          <Image
            src="/assets/images/gold.png"
            alt="Gold Bar"
          />
        </S.Col>
      </Row>
      {!isStorage && <div>
      <S.Title className="sub-title blueberry-lighter">Gold bars with direct shipping</S.Title>
      <Row>
        <S.Col xs={24} sm={24} md={8} lg={8} xl={8} className="shipImageCol">
          <S.Image
            src="/assets/images/ship.png"
            alt="Shippment"
            className="intro"
          ></S.Image>
        </S.Col>
        <S.Col xs={24} sm={24} md={16} lg={16} xl={16} className="panCol">
          <S.Paragraph className="white">
            Enhance your investment portfolio effortlessly with gold purchases shipped directly to you.
            Experience the convenience, security, and tangible benefits of owning physical gold through a streamlined, online process.
          </S.Paragraph>
          <S.Row>
            <Col xs={24} sm={8}>
              <Row justify={'center'} align={'middle'} style={{height: '100%'}}>
                <S.Paragraph className='white price'>Price per gram: ${price}</S.Paragraph>
              </Row>
            </Col>
            <Col xs={24} sm={8}>
              <S.Row className="sub" justify={'center'}>
                <Select
                  defaultValue={goldShipWeight}
                  style={{ width: 120 }}
                  onChange={setGoldShipWeight}
                  options={productWeights}
                  popupClassName = "select-pop"
                />
              </S.Row>
            </Col>
            <Col xs={24} sm={8}>
              <S.Row className="sub" justify={'center'}>
                <InputNumber value={goldShipQuantity} onChange={handleShipQuantity}></InputNumber>
              </S.Row>
            </Col>
          </S.Row>
          <Row>
            <Col xs={24} sm={8}></Col>
            <Col xs={24} sm={8}></Col>
            <Col xs={24} sm={8}>
              <Row justify={'center'}>
                <S.Button onClick={addGoldShipCarts}>Add to Cart</S.Button>
              </Row>
            </Col>
          </Row>
        </S.Col>
      </Row>
      </div>}
      {!isShippment && <div>
      <S.Title className="sub-title white right">Secure gold storage Switzerland</S.Title>
      <Row>
        <S.Col xs={24} sm={24} md={16} lg={16} xl={16} className="panCol">
          <S.Paragraph className="white">
            Invest in gold bars which are stored securely for you in the Swiss bonded warehouse.
            Switzerland's renowned banking system provides a stable and discreet option for storing precious metals, offering peace of mind to investors around the world.
            After your purchase, you will receive an issue certificate by post, which you can use to collect your gold bars at any time in Switzerland by prior arrangement. You also have the option of having your gold bars sent to you directly from the Swiss Gold Depository.
          </S.Paragraph>
          <S.Row className="storageRow">
            <Col xs={24} sm={8}>
              <Row justify={'center'} align={'middle'} style={{height: '100%'}}>
                <S.Paragraph className='white price'>Price per gram: ${price}</S.Paragraph>
              </Row>
            </Col>
            <Col xs={24} sm={8}>
              <S.Row className="sub" justify={'center'}>
                <Select
                  defaultValue={goldStorageWeight}
                  style={{ width: 120 }}
                  onChange={setGoldStorageWeight}
                  options={productWeights}
                />
              </S.Row>
            </Col>
            <Col xs={24} sm={8}>
              <S.Row className="sub" justify={'center'}>
                <InputNumber value={goldStorageQuantity} onChange={handleStorageQuantity}></InputNumber>
              </S.Row>
            </Col>
          </S.Row>
          <Row>
            <Col xs={24} sm={8}></Col>
            <Col xs={24} sm={8}></Col>
            <Col xs={24} sm={8}>
              <Row justify={'center'}>
                <S.Button onClick={addGoldStorageCarts}>Add to Cart</S.Button>
              </Row>
            </Col>
          </Row>
        </S.Col>
        <S.Col xs={24} sm={24} md={8} lg={8} xl={8} className="storageImageCol">
          <S.Image
            src="/assets/images/storage.png"
            alt="Storage"
            className="storage"
          ></S.Image>
        </S.Col>
      </Row>
      </div>}
      {(isShippment || isStorage) && <S.Row className='order'>
        <Col xs={24}>
          <Row justify={'center'}>
            <S.Title className="white noMargin">Order Summary</S.Title>
          </Row>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }}>
          <Row justify={'space-between'} >
            <S.Title className="white orderDesc">Kind</S.Title>
            <S.Title className="white orderDesc">{ isShippment ? 'Gold with Shippment': 'Gold Storage Switzerland' }</S.Title>
          </Row>
        </Col>
        {products.map(product => {
          indexProd++
          return (
            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }}>
              <Row justify={'space-between'} >
                <S.Title className="white prod">{product.weight}</S.Title>
                <S.Title className="white prod">{product.quantity}</S.Title>
                <div style={{marginTop: '10px'}}>
                  <S.Title className="white prod">${price*product.weight*product.quantity}</S.Title>
                  <S.DeleteOutlined id={indexProd.toString()} onClick={deleteCart}></S.DeleteOutlined>
                </div>
              </Row>
            </Col>
          )
        })}
        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }}>
          <Row justify={'space-between'} >
            <S.Title className="white orderDesc">shipping cost</S.Title>
            <S.Title className="white orderDesc">${isShippment? shipCost : storageCost}</S.Title>
          </Row>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }}>
          <Row justify={'space-between'} >
            <S.Title className="white orderDesc">total cost</S.Title>
            <S.Title className="white orderDesc">${totalCost}</S.Title>
          </Row>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }} style={{border: '1px solid white'}}>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }}>
          <Row justify={'space-between'} style={{margin: '10px 0px'}}>
            <Radio.Group onChange={handleChain} value={chain}>
              <S.Radio value={1}>Ethereum</S.Radio>
              <S.Radio value={56}>BSC</S.Radio>
            </Radio.Group>
            <Radio.Group onChange={handleCoin} value={coin}>
              <S.Radio value={'usdt'}>USDT</S.Radio>
              <S.Radio value={'usdc'}>USDC</S.Radio>
            </Radio.Group>
          </Row>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }}>
          <Row justify={'space-between'} style={{margin: '10px 0px'}}>
            <S.Input name="email" value={email} onChange={handleContactInfo} placeholder='Email*'/>
            <S.Input name="full_name" value={full_name} onChange={handleContactInfo} placeholder='Full Name*'/>
          </Row>
          <Row justify={'space-between'} style={{margin: '10px 0px'}}>
            <S.Select
              defaultValue={country}
              style={{ width: 120 }}
              onChange={handleSetCountry}
              options={isShippment? countriesForShip : countriesForStorage}
            />
            <S.Input name="address" value={address} onChange={handleContactInfo} placeholder='Address*'/>
          </Row>
          <Row justify={'space-between'} style={{margin: '10px 0px'}}>
            <S.Input name="city" value={city} onChange={handleContactInfo} placeholder='City*'/>
            <S.Input name="postcode" value={postcode} onChange={handleContactInfo} placeholder='Post Code*'/>
          </Row>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }}>
          <Row justify={'end'} style={{margin: '10px 0px'}}>
            <S.Button style={{marginRight: '15px'}} onClick={handleOrder}>Cancel</S.Button>
            <S.Button onClick={handleCheckOut}>Check Out</S.Button>
          </Row>
        </Col>
      </S.Row>}
      <S.Modal onCancel={handleCancel} onOk={handlePayment} open={isShowConfirmModal}>
        <h1>Would you like to proceed with payment?</h1>
        
      </S.Modal>
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  Title: styled(Title) `
    font-family: 'Changa';
    &.main-title {
      margin: 20px 0px 0px !important;
      font-weight: 400 !important;
      font-size: 3rem !important;
    }
    &.sub-title {
      margin: 70px 0px 10px !important;
      font-weight: 300 !important;
      font-size: 1.5rem !important;
    }
    &.white {
      color: ${props=>props.theme.white};
    } 
    &.blueberry-lighter {
      color: ${props=>props.theme.blueberry.lighter};
    }   
    &.right {
      text-align: right;
    }
    &.noMargin {
      font-weight: 300 !important;
      font-size: 1.5rem !important;
    }
    &.orderDesc {
      font-weight: 200 !important;
      font-size: 1rem !important;
      margin-top: 10px !important;
    }
    &.prod {
      display: inline !important;
      margin-right: 10px !important;
      font-weight: 200 !important;
      font-size: 1rem !important;
      margin-top: 10px !important;
    }
  `,
  Paragraph: styled(Paragraph)`
    font-size: 16px;
    font-family: 'Changa';
    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      font-size: 22px;
    }
    &.white {
      color: ${props=>props.theme.white};
    } 
    &.blueberry-lighter {
      color: ${props=>props.theme.blueberry.lighter};
    }
    &.price {
      font-size: 20px;
      margin: 0px;
    }
    &.customMargin {
      margin-top: 25px !important;
    }
  `,
  Row: styled(Row)`

    margin: 30px 0px;
    @media (max-width: 1320px) {
      margin: 25px 0px;
    }
    @media (max-width: 1180px) {
      margin: 20px 0px;
    }
    @media (max-width: 1155px) {
      margin: 15px 0px;
    }
    @media (max-width: 1090px) {
      margin: 10px 0px;
    }
    @media (max-width: 1050px) {
      margin: 5px 0px;
    }
    @media (max-width: 575px) {
      margin: 0px 0px;
    }
    @media (max-width: ${props => props.theme.viewport.mobile}) {
      margin: 0px 0px;
    }
    &.storageRow {
      margin: 30px 0px;
      @media (max-width: 1400px) {
        margin: 10px 0px;
      }
      @media (max-width: 1180px) {
        margin: 20px 0px;
      }
      @media (max-width: 1155px) {
        margin: 15px 0px;
      }
      @media (max-width: 1090px) {
        margin: 10px 0px;
      }
      @media (max-width: 1050px) {
        margin: 5px 0px;
      }
      @media (max-width: 575px) {
        margin: 0px 0px;
      }
      @media (max-width: ${props => props.theme.viewport.mobile}) {
        margin: 0px 0px;
      }
    }
    &.sub {
      @media (max-width: 575px) {
        padding: 0px 0px 10px;
        margin: 0px 0px;
      }
    }
    &.order {
      margin-top: 20px;
    }
    .ant-select-selector {
      background-color: transparent !important;
      color: white !important;
      border: 1px solid ${props=>props.theme.blueberry.lighter} !important;
      
    }
    .ant-select-arrow {
      color: white !important;
    }
    .ant-select-dropdown .select-pop{
      background-color: ${props=>props.theme.blueberry.light} !important;
    }
    .ant-select-dropdown-menu-item {
      background-color: ${props=>props.theme.blueberry.light} !important;  /* Using !important to override */
    }
    .ant-select-item-option-content {
      background-color: ${props=>props.theme.blueberry.light} !important;
      color: white !important;
    }
    .ant-select-item {
      background-color: ${props=>props.theme.blueberry.light} !important;
    }
    .ant-input-number {
      background-color: transparent !important;
      color: white !important;
      border: 1px solid ${props=>props.theme.blueberry.lighter} !important;
    }
    .ant-input-number-input {
      color: white !important;
    }
    .ant-input-number-handler {
      color: white !important;
      border-inline-start: 0px solid !important;
    }
    .ant-input-number-handler-wrap {
      background-color: transparent;
      border: 0px solid !important;
    }
    .ant-input-number-handler-down {
      border-block-start: 0px solid;
      border-end-end-radius: 0px;
    }
    .anticon {
      color: white !important;
    }
  `,
  Image: styled(Image)`
    &.intro {
      border-radius: 5px;
      @media (max-width: 888px) {
        height: 260px;
      }
      @media (max-width: 767px) {
        height: auto;
      }
    }
    &.storage {
      border-radius: 5px;
      @media (max-width: 1440px) {
        height: 390px;
      }
      @media (max-width: 1280px) {
        height: 366px;
      }
      @media (max-width: 1155px) {
        height: 356px;
      }
      @media (max-width: 818px) {
        height: 382px;
      }
      @media (max-width: 767px) {
        height: auto;
      }
    }
    
  `,
  Col: styled(Col)`
    &.panCol {
      border-radius: 5px;
      background-color: #23173e;
      padding: 50px 10px;
      @media (max-width: ${props => props.theme.viewport.desktopXl}) {
        padding: 50px 30px;
      }
      @media (max-width: ${props => props.theme.viewport.desktopl}) {
        padding: 25px 20px;
      }
      @media (max-width: ${props => props.theme.viewport.desktop}) {
        padding: 20px 10px;
      }
      @media (max-width: 767px) {
        padding: 30px 10px;
        margin: 20px 0px;
      }
      @media (max-width: ${props => props.theme.viewport.mobile}) {
        padding: 20px 10px;
        margin: 20px 0px;
      }
    }
    &.shipImageCol {
      padding-right: 15px;
      @media (max-width: 767px) {
        padding: 0px;
      }
    }
    &.goldImageCol {
      padding-left: 20px;
      @media (max-width: ${props => props.theme.viewport.tablet}) {
        padding: 0px;
      }
    }
    &.storageImageCol {
      padding-left: 15px;
      @media (max-width: 767px) {
        padding: 0px;
      }
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
    margin-bottom: 10px;
    max-width: 100%;
    display: inline-block;
    font-family: 'Changa';
    &::placeholder {
      color: white;
    }
    @media (min-width: 550px) {
      max-width: 220px;
    }
    @media (min-width: 1024px) {
      max-width: 200px;
    }
    @media (min-width: 1096px) {
      max-width: 220px;
    }
    
  `,
  Radio: styled(Radio)`
    color: white;
    font-family: 'Changa';
  `,
  Select: styled(Select)`
    width: 100% !important;
    .ant-select-selector {
      background-color: transparent !important;
      color: white !important;
      border: 1px solid ${(props)=>props.theme.blueberry.lighter} !important;
      font-family: 'Changa' !important;
    }
    @media (min-width: 550px) {
      max-width: 220px;
    }
    @media (min-width: 1024px) {
      max-width: 200px;
    }
    @media (min-width: 1096px) {
      max-width: 220px;
    }
  `,
  DeleteOutlined: styled(DeleteOutlined)`
    color: white;
    cursor: pointer;
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
  `,

}
