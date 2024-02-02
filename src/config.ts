export interface ChainConfig {
  id: number
  name: string
  networkTokenSymbol: string
  ScanAddress: string
  ethAddress: string
  contractAddress: string
  usdcAddress: string
  usdtAddress: string
}

export const infuraKey = process.env.REACT_APP_INFURA_KEY
export const infuraAddress = `https://mainnet.infura.io/v3/${infuraKey}`
export const bscNodeAddress = `https://bsc-dataseed.binance.org/`
export const allowedChains: Array<number> = [1, 5, 56, 97];

export const chainsConfig: ChainConfig[] = [
  {
    id: 1,
    ScanAddress: 'https://etherscan.com/',
    name: 'Eth mainnet',
    networkTokenSymbol: 'Eth',
    ethAddress: '0x0000000000000000000000000000000000000000',
    contractAddress: '',
    usdcAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    usdtAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7'
  },
  {
    id: 5,
    ScanAddress: 'https://etherscan.com/',
    name: 'Eth mainnet',
    networkTokenSymbol: 'Eth',
    ethAddress: '0x0000000000000000000000000000000000000000',
    contractAddress: '',
    usdcAddress: '0x179c54e1fEa2Cd75de3Dc5fa61869B93d8C5b317',
    usdtAddress: '0x94829DD28aE65bF4Ff6Ce3A687B1053eC7229272'
  },
  {
    id: 56,
    ScanAddress: 'https://bscscan.com/',
    name: 'BSC mainnet',
    networkTokenSymbol: 'BNB',
    ethAddress: '0x0000000000000000000000000000000000000000',
    contractAddress: '',
    usdcAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    usdtAddress: '0x55d398326f99059fF775485246999027B3197955'
  },
  {
    id: 97,
    ScanAddress: 'https://testnet.bscscan.com/',
    name: 'BSC Testnet',
    networkTokenSymbol: 'TBNB',
    ethAddress: '0x0000000000000000000000000000000000000000',
    contractAddress: '0x6d029dc28e5abddd69187d6d214f0cc70d5ee5a1',
    usdcAddress: '0x64544969ed7ebf5f083679233325356ebe738930',
    usdtAddress: '0xcDaDB1D9ae238dB553aB88A7c5356F4b518C76Cb'
  }
]

export const getChainConfigById = (id: number | undefined): ChainConfig => chainsConfig.find(chain => chain.id === id) || chainsConfig[0]
export const chainConfig = (id: number | undefined): ChainConfig | undefined => chainsConfig.find(chain => chain.id === id)