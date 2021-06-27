import { isEqual } from 'lodash'
import { useEffect, useState } from 'react'

import { useStorageProviders } from '@/providers'
import { Logger } from '@/utils/logger'

import { getAssetUrl, readAssetData, testAssetDownload } from './helpers'
import { UseAsset, UseAssetDataArgs } from './types'

export const useAsset: UseAsset = ({ entity, assetType }, opts = {}) => {
  const { getStorageProvider } = useStorageProviders()
  const [error, setError] = useState<ErrorEvent | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [cachedEntity, setCachedEntity] = useState<UseAssetDataArgs['entity']>(null)

  useEffect(() => {
    if (error) {
      Logger.error(`Failed to load ${assetType}`, error)
    }
  }, [error, assetType])

  useEffect(() => {
    if (!entity || isEqual(entity, cachedEntity) || opts.skip) {
      // only run if entity changed
      return
    }
    setCachedEntity(entity)
    setUrl(undefined)
    setIsLoading(true)

    const assetData = readAssetData(entity, assetType)

    if (!assetData) {
      Logger.warn('Unable to read asset data from entity')
      return
    }
    const assetUrl = getAssetUrl(assetData, getStorageProvider()?.url)
    if (assetUrl === null) {
      Logger.warn('Unable to create asset url', assetData)
      return
    } else if (!assetUrl) {
      return
    }
    setUrl(assetUrl)

    const testAsset = async () => {
      setIsLoading(true)
      setError(null)

      try {
        await testAssetDownload(assetUrl, assetType)
      } catch (e) {
        setError(e)
      } finally {
        setIsLoading(false)
      }
    }

    testAsset()
  }, [assetType, cachedEntity, entity, getStorageProvider, opts.skip])

  return { url: isEqual(entity, cachedEntity) ? url : undefined, error, isLoading }
}
