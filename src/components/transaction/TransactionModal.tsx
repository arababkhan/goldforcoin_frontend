import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { useReactiveVar } from '@apollo/client'
import { Modal, Spin } from 'antd'
import { useEffect } from 'react'
import styled from 'styled-components'
import { transactionModalVar, transactionVar } from '../../graphql/variables/TransactionVariable'
import { transactionService } from '../../services/TransactionService'
import { useWeb3React } from "@web3-react/core"

export function ModalTransaction() {
  const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />
  const transaction = useReactiveVar(transactionVar)
  const { chainId, provider } = useWeb3React();
  const transactionModal = useReactiveVar(transactionModalVar)

  useEffect(() => {
    if (transaction && !transaction.confirmed && chainId && provider) {
      transactionService().confirm(transaction.hash, chainId, provider)
    }
  }, [chainId, transaction])

  return (
    <S.ModalTransaction open={!!transactionModal} footer={null} destroyOnClose>
      <S.Container>
        <div>
          <Spin style={{color: 'white'}} indicator={antIcon} />
        </div>
        <div>
          <h1 style={{color: 'white', textAlign: 'center'}}>Waiting for blockchain confirmation</h1>
          <span style={{color: 'white'}}>This may take a few seconds</span>
        </div>
      </S.Container>
    </S.ModalTransaction>
  )
}

export const S = {
  ModalTransaction: styled(Modal)`
    border-radius: 8px;

    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-content {
      background: ${props => props.theme.blueberry.light};
      border-radius: 16px;
      max-width: 350px;
      height: 280px;
      padding: 25px;
      margin: 0 auto;
    }

    .ant-modal-close-x {
      display: none;
    }

    .ant-modal-close {
      position: absolute;
      top: 15px;
      right: -2px;
    }
  `,
  Container: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    > div {
      display: flex;
      align-items: center;
      height: 80%;
    }
    div:nth-child(2) {
      display: flex;
      align-items: center;
      flex-direction: column;
      height: 20%;
      margin-top: 20px;
      margin-bottom: 20px;
      h1 {
        font-size: 18px;
        line-height: 20px;
        color: ${props=>props.theme.gray[4]};
        margin-bottom: 8px;
      }
      span {
        font-size: 14px;
        line-height: 16px;
        color: ${props=>props.theme.gray[3]};
      }
    }
  `
}
