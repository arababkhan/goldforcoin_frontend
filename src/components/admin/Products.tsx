import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Row, Typography, Tag, Col, InputNumber } from 'antd'
import { setPrices, getPrices, saveWeights, getWeight} from '../../services/AdminService'

const { Title } = Typography

export const Products: React.FC = () => {
  const [price, setPrice] = useState(0)
  const [shipFee, setShipFee] = useState(0)
  const [storageFee, setStorageFee] = useState(0)
  const [weight, setWeight] = useState(0)
  const [selectedWeights, setSelectedWeights] = useState<string[]>([])

  const handlePrice = (value: number | null) => {
    if (value !== null && value > 0) {
      setPrice(value);
    }
  };
  const handleShipFee = (value: number | null) => {
    if (value !== null && value > 0) {
      setShipFee(value);
    }
  };
  const handleStorageFee = (value: number | null) => {
    if (value !== null && value > 0) {
      setStorageFee(value);
    }
  };
  const handleWeight = (value: number | null) => {
    if (value !== null && value > 0) {
      setWeight(value);
    }
  };

  const handleWeightClose = (removedWeight:string) => {
    const newWeights = selectedWeights.filter(weight => weight !== removedWeight);
    setSelectedWeights(newWeights);
  };

  const addWeight = () => {
    if((selectedWeights.filter(weight => weight === (weight.toString() + 'g'))).length ===0)
      setSelectedWeights([...selectedWeights, weight.toString() + 'g'])
  }

  const handleUpdate = async(type:string) => {
    if(type === 'pricepergram')
      await setPrices(price, type)
    else if(type === 'costship')
      await setPrices(shipFee, type)
    else 
      await setPrices(storageFee, type)
  }

  const saveWeight = async () => {
    await saveWeights(selectedWeights)
  }

  useEffect(() => {
    async function getProductInfo() {
      let w_prices = await getPrices()
      let w_weights = await getWeight()
      setSelectedWeights(w_weights)
      setPrice(w_prices.pricePerGram)
      setShipFee(w_prices.costShip)
      setStorageFee(w_prices.costStorage)
    }
    
    getProductInfo()
   }, [])
  return (
    <Row>
      <S.Col xs={24} sm={12}>
          <S.Title className="white orderDesc">Price per Gram</S.Title>
          <Row justify={'space-between'} align={'middle'} >
            <InputNumber style={{width: '100px'}} value={price} onChange={handlePrice}></InputNumber>
            <S.Button style={{width: '80px'}} onClick={()=>handleUpdate('pricepergram')}>Set</S.Button>
          </Row>

          <S.Title className="white orderDesc">Shipping Fee for Gold with shippment</S.Title>
          <Row justify={'space-between'} align={'middle'} >
            <InputNumber style={{width: '100px'}} value={shipFee} onChange={handleShipFee}></InputNumber>
            <S.Button style={{width: '80px'}} onClick={()=>handleUpdate('costship')}>Set</S.Button>
          </Row>

          <S.Title className="white orderDesc">Shipping Fee for Gold storage</S.Title>
          <Row justify={'space-between'} align={'middle'} >
            <InputNumber style={{width: '100px'}} value={storageFee} onChange={handleStorageFee}></InputNumber>
            <S.Button style={{width: '80px'}} onClick={()=>handleUpdate('coststorage')}>Set</S.Button>
          </Row>
      </S.Col>
      <S.Col xs={24} sm={12}>
        <S.Title className="white orderDesc">Product Weight</S.Title>
        <Row justify={'space-between'} align={'middle'} >
          <InputNumber style={{width: '200px'}} value={weight} onChange={handleWeight}></InputNumber>
          <S.Button style={{width: '80px'}} onClick={addWeight}>Add</S.Button>
        </Row>
        <div style={{ marginTop: '20px' }}>
          <S.Title className="white prod">Added Weights</S.Title>
          {selectedWeights.map((weight:string) => (
            <S.Tag
              closable
              onClose={() => handleWeightClose(weight)}
              key={weight}
              style={{ marginTop: '10px' }}
            >
              {weight}
            </S.Tag>
          ))}
        </div>
        <Row justify={'end'} style={{marginTop: '20px'}}>
          <S.Button style={{width: '80px'}} onClick={saveWeight}>Save</S.Button>
        </Row>
      </S.Col>
    </Row>
  )
}

const S = {
  Title: styled(Title) `
    font-family: 'Changa';
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
    &.orderDesc {
      font-weight: 200 !important;
      font-size: 1rem !important;
      margin-top: 30px !important;
    }
    &.prod {
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
    @media (max-width: 400px) {
      margin-top: 10px;
    }
  `,
  Tag: styled(Tag)`
    color: white !important;
    font-size: 14px;
    &.ant-tag .ant-tag-close-icon {
      color: white !important;
    }
  `,
  Col: styled(Col)`
    padding: 0px 10px;
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
  `
}
