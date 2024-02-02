import { chainConfig } from '../config'
import { useWeb3React } from "@web3-react/core"

interface ChainConfigV2Migration {
  chainId: number | undefined
}

export function useChainConfig(): ChainConfigV2Migration {
  const { chainId } = useWeb3React();
  const config = chainConfig(chainId)
  return { chainId: typeof config !== "undefined"?config.id:0 }
}
