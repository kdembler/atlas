import React from 'react'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { TransactionDialog } from '@/components'
import { Logger } from '@/utils/logger'

import { useTransactionManagerStore } from './store'

export const TransactionManager: React.FC = () => {
  const {
    blockActions,
    dialogStep,
    actions: { removeOldBlockActions, setDialogStep },
  } = useTransactionManagerStore((state) => state)

  useQueryNodeStateSubscription({
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData.data) return

      const indexerHead = subscriptionData.data.stateSubscription.indexerHead

      const syncedActions = blockActions.filter((action) => indexerHead >= action.targetBlock)
      syncedActions.forEach((action) => {
        try {
          action.callback()
        } catch (e) {
          Logger.error('Failed to execute tx sync callback', e)
        }
      })

      removeOldBlockActions(indexerHead)
    },
  })

  return <TransactionDialog status={dialogStep} onClose={() => setDialogStep(null)} />
}
