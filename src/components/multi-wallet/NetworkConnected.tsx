import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import bscIcon from '../../assets/multi-wallet/bsc.svg'
import ethereumIcon from '../../assets/multi-wallet/ethereum.svg'
import polygonIcon from '../../assets/multi-wallet/matic.png'
import { useWeb3React } from "@web3-react/core"
// import { isAllowedChain } from '../../services/UtilService'

interface NetworkConnectedProps {
  className?: string
}

export const NetworkConnected: React.FC<NetworkConnectedProps> = ({ className }: NetworkConnectedProps) => {
  const { chainId } = useWeb3React();
  const rightChain: boolean = true //isAllowedChain(chainId)
  const [network, setNetwork] = useState('')

  const selectNetwork = useCallback(() => {
    switch (chainId) {
      case 1:
        setNetwork(ethereumIcon)
        break
      case 5:
        setNetwork(ethereumIcon)
        break
      case 56:
        setNetwork(bscIcon)
        break
      case 97:
        setNetwork(bscIcon)
        break
      case 80001:
        setNetwork(polygonIcon)
        break
      default:
        break
    }
  }, [chainId])

  useEffect(() => {
    if (chainId) {
      selectNetwork()
    }
  }, [chainId, selectNetwork])

  return (
    <>
      {rightChain && (
        <S.NetworkConnected className={`${className} ${rightChain ? '' : ''}`}>
          <img src={network} alt='' />
        </S.NetworkConnected>
      )}
    </>
  )
}

const S = {
  NetworkConnected: styled.div`
    background: transparent !important;
    border: 0px solid;
    border-radius: 24px;
    display: flex;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    padding: 8px;
    margin-top: 12px;
    margin-left: 15px;
    span {
      font-family: Montserrat;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 130%;
    }
    img {
      width: 32px;
      height: 32px;
    }

    @media (max-width: ${props => props.theme.viewport.tablet}) {
      display: none;
    }
  `
}
