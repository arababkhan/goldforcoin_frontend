import React from 'react'
import styled from 'styled-components'

export interface FooterProps {
  className?: string
}
 
export const Footer: React.FC<FooterProps> = ({ className }: FooterProps) => {
  const handleNewOpen = () => {
    window.open("https://neweternallife.io")
  }
  return (
    <S.Footer className={className}>
      <S.Span>Copyright @2024 GoldForCrypto.io | a part of <a href="" onClick={handleNewOpen}>NewEternalLife Ecosystem</a> All Rights Reserved</S.Span>
    </S.Footer>
  )
}

const S = {
  Footer: styled.footer`
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    background: #6e3ff9 !important;
    position: absolute;
  `,
  Span: styled.span`
    font-family: ${props => props.theme.fonts.primary};
    font-weight: 400;
    text-decoration: none;
    font-size: 16px;
    color: ${props => props.theme.white};
    padding: 11px;
  `
}
