import type { NetworkTransaction } from 'tarou'

export function useTransactionService() {
  const userStore = useUserStore()

  function handleTransaction(transaction: NetworkTransaction) {
    // 处理transaction
  }

  // 提取GBF UID的专用方法

  return {
    handleTransaction,
  }
}
