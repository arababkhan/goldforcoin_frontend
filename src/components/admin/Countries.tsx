import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Row, Typography, Select, Tag, Col} from 'antd'
import { getCountries, registerCountries, getAllCountries } from '../../services/AdminService'

const { Title } = Typography
const { Option } = Select

export const Countries: React.FC = () => {
  const [allCountries, setAllCountries] = useState<string[]>([])
  const [selectedShipCountries, setSelectedShipCountries] = useState<string[]>([])
  const [shipCountry, setShipCountry] = useState<string>()
  const [selectedStorageCountries, setSelectedStorageCountries] = useState<string[]>([])
  const [storageCountry, setStorageCountry] = useState<string>()

  const handleShipCountry = (value: string) => {
    setShipCountry(value)
    if((selectedShipCountries.filter(country => country === value)).length ===0)
    setSelectedShipCountries([...selectedShipCountries, value])
  };

  const handleShipClose = (removedCountry:string) => {
    const newCountries = selectedShipCountries.filter(country => country !== removedCountry);
    setSelectedShipCountries(newCountries);
  };

  const handleStorageCountry = (value: string) => {
    setStorageCountry(value)
    if((selectedStorageCountries.filter(country => country === value)).length ===0)
    setSelectedStorageCountries([...selectedStorageCountries, value])
  };

  const handleStorageClose = (removedCountry:string) => {
    const newCountries = selectedStorageCountries.filter(country => country !== removedCountry);
    setSelectedStorageCountries(newCountries);
  };

  const handleCountries = async () => {
    await registerCountries(selectedShipCountries, selectedStorageCountries)
  }

  useEffect(() => {
    async function getAllCountriesInit() {
      let w_allCountries = await getAllCountries()
      setAllCountries(w_allCountries)
      let w_countries = await getCountries()
      setSelectedShipCountries(w_countries.ship?w_countries.ship:[])
      setSelectedStorageCountries(w_countries.storage?w_countries.storage:[])
    }

    getAllCountriesInit()
  }, [])
  return (
    <Row>
      <S.Col xs={24} sm={12} style={{padding: '0px 10px'}}>
        <S.Title className="white orderDesc">Gold with Shippment</S.Title>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Select countries"
          onChange={handleShipCountry}
          value={shipCountry}
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {allCountries.map((country, index) => (
            <Option value={country} key={index}>{country}</Option>
          ))}
        </Select>

        <div style={{ marginTop: '20px' }}>
          <S.Title className="white prod">Selected Countries:</S.Title>
          {selectedShipCountries.map(country => (
            <S.Tag
              closable
              onClose={() => handleShipClose(country)}
              key={country}
              style={{ marginTop: '10px' }}
            >
              {country}
            </S.Tag>
          ))}
        </div>
      </S.Col>
      <S.Col xs={24} sm={12} style={{padding: '0px 10px'}}>
        <S.Title className="white orderDesc">Gold with Storage</S.Title>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Select countries"
          onChange={handleStorageCountry}
          value={storageCountry}
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {allCountries.map((country, index) => (
            <Option value={country} key={index}>{country}</Option>
          ))}
        </Select>

        <div style={{ marginTop: '20px' }}>
          <S.Title className="white prod">Selected Countries</S.Title>
          {selectedStorageCountries.map(country => (
            <S.Tag
              closable
              onClose={() => handleStorageClose(country)}
              key={country}
              style={{ marginTop: '10px' }}
            >
              {country}
            </S.Tag>
          ))}
        </div>
      </S.Col>
      <Col sm={24} style={{padding: '0px 10px'}}>
        <Row justify={'end'} style={{marginTop: '20px'}}>
          <S.Button style={{width: '80px'}} onClick={handleCountries}>Save</S.Button>
        </Row>
      </Col>
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
      margin-top: 10px !important;
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
  `,
  Tag: styled(Tag)`
    color: white !important;
    font-size: 14px;
    &.ant-tag .ant-tag-close-icon {
      color: white !important;
    }
  `,
  Col: styled(Col)`
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
  `
}
