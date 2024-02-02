import React, { ReactNode, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Footer } from '../../components/layout/Footer'
import  {Header} from '../../components/layout/Header';

export type DefaultTemplatePageProps = {
  children: ReactNode
  bgGray?: boolean
  noMargin?: boolean
  fullWidth?: boolean
  sidebar? : boolean
  marginMedium?: boolean
  marginMax?: boolean
}

export function DefaultPageTemplate({ children, bgGray, noMargin, fullWidth, sidebar, marginMedium, marginMax }: DefaultTemplatePageProps) {
  const [isSidebar, setIsSidebar] = useState(false);

  useEffect(()=>{
    if(sidebar !== undefined) setIsSidebar(true);
  },[])

  return (
    <>
      <Header />
      <S.Main bgGray={!!bgGray} noMargin={!!noMargin} sidebar={sidebar} isSidebar={isSidebar} marginMedium={marginMedium} marginMax={marginMax}>
        <S.Container fullWidth={!!fullWidth}>{children}</S.Container>
      </S.Main>
      <Footer />
    </>
  )
}
export const S = {
  Main: styled.main<{ bgGray?: boolean; noMargin: boolean; sidebar?:boolean; isSidebar: boolean; marginMedium?: boolean; marginMax?: boolean }>`
    min-height: calc(100vh - 72px);
    background: ${props => props.theme.blueberry.main};
    display: block;
    align-items: center;
    padding-top: 100px !important;

    ${props =>
      props.bgGray &&
      css`
        background: ${props.theme.gray[0]};
      `}

    ${props =>
      css`
        padding: ${props.noMargin ? 0 : (props.marginMedium || props.marginMax ? props.theme.margin.medium : props.theme.margin.small)};
      `}
    ${props => (props.isSidebar && !props.sidebar) && 'padding-left: 74px !important;'}
    
    @media (min-width: ${props => props.theme.viewport.mobile}) {
      min-height: calc(100vh - 48.2px);
    }
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      min-height: calc(100vh - 72px);
      padding: ${props => props.theme.margin.small};
      ${props =>
        css`
          padding: ${props.noMargin ? 0 : (props.marginMax || props.marginMedium ? props.theme.margin.medium : props.theme.margin.small)};
        `}
      ${props => (props.isSidebar && !props.sidebar) && 'padding-left: 74px !important;'}
    }

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      padding: ${props => props.theme.margin.small};
      ${props =>
        css`
          padding: ${props.noMargin ? 0 : (props.marginMedium ? props.theme.margin.medium : (props.marginMax ? props.theme.margin.large : props.theme.margin.small))};
        `}
      ${props => props.sidebar && 'padding-left: 324px !important;'}
      ${props => (props.isSidebar && !props.sidebar) && 'padding-left: 74px !important;'}
    }

    .infinite-scroll-component {
      vertical-align: top !important;
    }
  `,
  Container: styled.div<{ fullWidth?: boolean }>`
    width: 100%;
    margin: 0 auto;
    ${props =>
      !props.fullWidth &&
      css`
        max-width: ${props.theme.viewport.desktopXl};
      `}
  `
}
