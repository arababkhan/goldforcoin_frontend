import { Transaction, transactionLoadingVar, transactionModalVar, transactionVar } from '../graphql/variables/TransactionVariable'
import { Provider } from "@ethersproject/providers";

export interface TransactionService {
  confirm(hash: string, chainId: number, provider: Provider, timer?: number, confirmed?: boolean): Promise<void>
  getConfirmations(hash: string, chainId: number, provider: Provider): Promise<number>
}

export function transactionService(): TransactionService {
  return {
    confirm: async (txHash: string, chainId: number, provider: Provider, timer = 10, confirmed = false) => {
      let confirmedTransaction = confirmed
      setTimeout(async () => {
        const confirmations = await transactionService().getConfirmations(txHash, chainId, provider)
        if (confirmations >= 1) {
          const transaction = transactionVar()
          if (transaction) {
            const { hash, type, params } = transaction
            const transactionItem: Transaction = {
              hash,
              type,
              params,
              confirmed: true
            }
            transactionVar(transactionItem)
            transactionModalVar(false)
            transactionLoadingVar(false)
            confirmedTransaction = true
          } 
        } else {
          transactionService().confirm(txHash, chainId, provider, 2, confirmedTransaction)
        }
      }, timer * 1000)
    },
    getConfirmations: async (hash: string, chainId: number, provider: Provider) => {
      try {
        const trx = await provider.getTransaction(hash)
        const currentBlock = await provider.getBlockNumber()
        if(trx.blockNumber)
          return currentBlock - trx.blockNumber
        else
          return 0;
      } catch (error) {
        return 0
      }
    }
  }
}
