import { memo, useEffect, useMemo, useState } from 'react'

import { ArrowDownIcon, ArrowUpIcon } from '@app/assets/icons'
import { ChevronToggleButton } from '@app/components/ui/buttons'
import type { Transaction } from '@app/services/archiver'
import { formatString } from '@app/utils'
import type { AssetTransfer, Transfer } from '@app/utils/qubic-ts'
import { getAssetsTransfers, getTransfers, isTransferTx, QUTIL_ADDRESS } from '@app/utils/qubic-ts'
import AddressLink from '../AddressLink'
import CardItem from '../CardItem'
import TxLink from '../TxLink'
import TxStatus from '../TxStatus'
import TransactionDetails from './TransactionDetails'
import type { TxItemVariant } from './TxItem.types'

type Props = {
  tx: Omit<Transaction, 'inputSize' | 'signatureHex'>
  identity?: string
  nonExecutedTxIds: string[]
  variant?: TxItemVariant
  isHistoricalTx?: boolean
  timestamp?: string
}

function TxItem({
  tx: { txId, sourceId, tickNumber, destId, inputType, amount, inputHex },
  identity,
  nonExecutedTxIds,
  variant = 'primary',
  isHistoricalTx = false,
  timestamp
}: Props) {
  const [entries, setEntries] = useState<Transfer[]>([])
  const [asset, setAsset] = useState<AssetTransfer>()
  const [detailsOpen, setDetailsOpen] = useState(false)

  const handleToggleDetails = () => setDetailsOpen((prev) => !prev)

  const isTransferTransaction = useMemo(
    () => isTransferTx(sourceId, destId, amount),
    [sourceId, destId, amount]
  )

  useEffect(() => {
    if (destId === QUTIL_ADDRESS && inputType === 1 && inputHex) {
      ;(async () => {
        try {
          const transfers = await getTransfers(inputHex)
          setEntries(transfers)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      })()
    }
    if (inputType === 2 && inputHex) {
      ;(async () => {
        try {
          const assetTransfer = await getAssetsTransfers(inputHex)
          setAsset(assetTransfer)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      })()
    }
  }, [destId, inputHex, inputType])

  if (variant === 'secondary') {
    return (
      <>
        <div className="mb-24 flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
          <div className="">
            <TxStatus
              executed={!(nonExecutedTxIds || []).includes(txId)}
              isTransferTx={isTransferTransaction}
            />
          </div>
          <TxLink isHistoricalTx={isHistoricalTx} className="text-base text-gray-50" value={txId} />
        </div>
        <TransactionDetails
          txDetails={{ txId, sourceId, tickNumber, destId, inputType, amount }}
          isHistoricalTx={isHistoricalTx}
          variant={variant}
          entries={entries}
          assetDetails={asset}
          timestamp={timestamp}
        />
      </>
    )
  }

  return (
    <CardItem className="flex flex-col rounded-12 p-12 transition-all duration-300">
      <div className="flex items-center justify-between gap-8">
        <TxStatus
          executed={!(nonExecutedTxIds || []).includes(txId)}
          isTransferTx={isTransferTransaction}
        />
        <div className="flex flex-grow flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          {identity ? (
            <div className="flex items-center gap-8">
              {identity === sourceId ? (
                <ArrowDownIcon className="size-12 text-error-30" />
              ) : (
                <ArrowUpIcon className="size-12 text-success-30" />
              )}
              <AddressLink
                className="text-base"
                value={identity === sourceId ? destId : sourceId}
                copy
                ellipsis
              />
            </div>
          ) : (
            <TxLink
              isHistoricalTx={isHistoricalTx}
              value={txId}
              className="text-primary-30"
              ellipsis
              copy
            />
          )}
          <p className="text-center font-space text-base">
            {asset ? (
              <>
                {formatString(asset.units)} <span className="text-gray-50">{asset.assetName}</span>
              </>
            ) : (
              <>
                {formatString(amount)} <span className="text-gray-50">QUBIC</span>
              </>
            )}
          </p>
        </div>
        <ChevronToggleButton
          aria-label="toggle-tx-details"
          isOpen={detailsOpen}
          onClick={handleToggleDetails}
        />
      </div>
      {detailsOpen && (
        <TransactionDetails
          txDetails={{ txId, sourceId, tickNumber, destId, inputType, amount }}
          isHistoricalTx={isHistoricalTx}
          variant={variant}
          entries={entries}
          assetDetails={asset}
          timestamp={timestamp}
        />
      )}
    </CardItem>
  )
}

const MemoizedTxItem = memo(TxItem)

export default MemoizedTxItem
