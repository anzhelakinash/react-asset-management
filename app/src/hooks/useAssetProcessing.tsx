import { useEffect, useState, useMemo, useCallback } from 'react';
import { Asset } from '../../../types/Asset';

const useAssetProcessing = (assets: Asset[]) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedPortfolio, setSelectedPortfolio] = useState('');
  const [selectedAssetName, setSelectedAssetName] = useState('');
  const [tradeTicker, setTradeTicker] = useState<string | undefined>(undefined);

  const banks = useMemo(() =>
    Array.from(new Set(assets.map((a) => a.BANK || 'Unknown'))), [assets]);

  const portfolios = useMemo(() =>
    selectedBank
      ? Array.from(new Set(
          assets.filter((a) => a.BANK === selectedBank).map((a) => a.PORTFOLIO || 'Unknown')
        ))
      : [], [selectedBank, assets]);

  const assetNames = useMemo(() => {
    if (!selectedBank || !selectedPortfolio) return [];
    return Array.from(new Set(
      assets
        .filter((a) => a.BANK === selectedBank && a.PORTFOLIO === selectedPortfolio)
        .map((a) => a.ASSET_NAME || 'Unnamed')
    ));
  }, [selectedBank, selectedPortfolio, assets]);

  const filteredAssets = useMemo(() => {
    const filtered = assets.filter((asset) => asset.ASSET_TICKER === tradeTicker && asset.BANK === selectedBank && asset.PORTFOLIO === selectedPortfolio);
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.TRADE_DATE);
      const dateB = new Date(b.TRADE_DATE);
      return dateA.getTime() - dateB.getTime();
    });
    return sorted;
  }, [assets, tradeTicker, selectedBank, selectedPortfolio]);

  useEffect(() => {
    if (selectedAssetName) {
      const matchingAsset = assets.find(
        (asset) =>
          asset.BANK === selectedBank &&
          asset.PORTFOLIO === selectedPortfolio &&
          asset.ASSET_NAME === selectedAssetName
      );
      setTradeTicker(matchingAsset?.ASSET_TICKER);
    } else {
      setTradeTicker(undefined);
    }
  }, [selectedAssetName, selectedBank, selectedPortfolio, assets]);

  const handleBankChange = useCallback((newBank: string) => {
    setSelectedBank(newBank);
    setSelectedPortfolio('');
    setSelectedAssetName('');
  }, []);

  const handlePortfolioChange = useCallback((newPortfolio: string) => {
    setSelectedPortfolio(newPortfolio);
    setSelectedAssetName('');
  }, []);

  const handleAssetNameChange = useCallback((newAssetName: string) => {
    setSelectedAssetName(newAssetName);
  }, []);

  return {
    selectedBank,
    selectedPortfolio,
    selectedAssetName,
    tradeTicker,
    banks,
    portfolios,
    assetNames,
    filteredAssets,
    handleBankChange,
    handlePortfolioChange,
    handleAssetNameChange
  };
};

export default useAssetProcessing;