import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Paper, Typography, Stack } from '@mui/material';
import { ViewProps } from '../../../views/types/ViewProps';
import { selectAllAssets, fetchAssets } from '../../../store/slices/assetSlice';
import type { RootState, AppDispatch } from '../../../store/store';
import { Asset } from '../../../types/Asset';
// import msci from '../utils/mockup_data';

import { FilterControls } from './components/FilterControls';
import { PerformanceChart } from './components/PerformanceChart';
import getAdjustedCloseNearestSameMonth from '../utils/getAdjustedCloseNearestSameMonth';
import useAssetProcessing from '../../../hooks/useAssetProcessing';

// API key for AlphaVantage (stock data service)
const API_KEY = 'HUOAGXWH1HFLQ4ZA';
//TESTING
// const BENCHMARK_SYMBOL = 'AAPL';

// Define data structure for performance data points
interface PerformancePoint {
  date: string;
  value: number;
  quantity?: number;
  pricePerItem?: number;
}


function PerformanceView({ title }: ViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const assets = useSelector(selectAllAssets);
  const loading = useSelector((state: RootState) => state.assets.status === 'loading');

  // State for benchmark and portfolio performance data
  const [benchmarkData, setBenchmarkData] = useState<PerformancePoint[]>([]);
  const [portfolioPerformance, setPortfolioPerformance] = useState<PerformancePoint[]>([]);

  // Custom hook for filtering assets by bank, portfolio, asset name
  const {
    selectedBank,
    selectedPortfolio,
    selectedAssetName,
    banks,
    portfolios,
    assetNames,
    filteredAssets,
    handleBankChange,
    handlePortfolioChange,
    handleAssetNameChange
  } = useAssetProcessing(assets);

  // Load assets data on component mount
  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);


  // Calculate portfolio performance based on filtered assets
  const calculatedPortfolioPerformance = useMemo(() => {
    if (!filteredAssets || filteredAssets.length === 0) return [];

    // Track daily values with a map using date as key
    const dailyValuesMap: Record<string, {value: number; quantity: number; pricePerItem: number}> = {};

    // Process each asset to calculate daily values
    filteredAssets.forEach((asset: Asset) => {
      if (!asset.TRADE_DATE) return;

      const direction = asset.DIRECTION;
      const amountUSD = asset.TRADE_AMOUNT_USD || 0;
      const quantity = asset.QUANTITY || 0;
      const pricePerItem = quantity !== 0 ? amountUSD / quantity : 0;

      // Initialize the date entry if it doesn't exist
      if (!dailyValuesMap[asset.TRADE_DATE]) dailyValuesMap[asset.TRADE_DATE] = { value: 0, quantity: 0, pricePerItem: 0 };

      // Update values based on transaction direction
      if (direction === 'BUY' || direction === 'COMMIT') {
        dailyValuesMap[asset.TRADE_DATE].value += amountUSD;
        dailyValuesMap[asset.TRADE_DATE].quantity += quantity;
        dailyValuesMap[asset.TRADE_DATE].pricePerItem = pricePerItem; 
      } else if (direction === 'SELL') {
        dailyValuesMap[asset.TRADE_DATE].value -= amountUSD;
        dailyValuesMap[asset.TRADE_DATE].quantity -= quantity;
        dailyValuesMap[asset.TRADE_DATE].pricePerItem = pricePerItem; 
      }
    });

    // Sort dates chronologically
    const sortedDates = Object.keys(dailyValuesMap).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // Calculate cumulative performance over time
    const cumulativePerformance: PerformancePoint[] = [];
    let cumulativeValue = 0;
    let cumulativeQuantity = 0;
    let lastPricePerItem = 0;

    sortedDates.forEach((date) => {
      cumulativeValue += dailyValuesMap[date].value;
      cumulativeQuantity += dailyValuesMap[date].quantity;
      lastPricePerItem = dailyValuesMap[date].pricePerItem || lastPricePerItem;

      cumulativePerformance.push({
        date,
        value: cumulativeValue,
        quantity: cumulativeQuantity,
        pricePerItem: lastPricePerItem,
      });
    });

    return cumulativePerformance;
  }, [filteredAssets]);

  // Update portfolio performance state when calculated values change
  useEffect(() => {
    setPortfolioPerformance(calculatedPortfolioPerformance);
  }, [calculatedPortfolioPerformance]);

    // Get ticker symbol from the selected asset for benchmark comparison
    const BENCHMARK_SYMBOL = filteredAssets.find((a) => a.ASSET_NAME === selectedAssetName)?.ASSET_TICKER;

    // Fetch benchmark data from AlphaVantage API
    async function fetchBenchmark() {
      if (!filteredAssets.length) return;
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${BENCHMARK_SYMBOL}&apikey=${API_KEY}`
      );
      const json = await response.json();

      const timeSeries = json['Monthly Adjusted Time Series']

      const result: {
        date: string;
        value: number;
        quantity: number;
        pricePerItem: number;
        cumulativeQuantity?: number;  
      }[] = [];

      // Match benchmark data points to portfolio performance dates
      portfolioPerformance.forEach((asset) => {   
        // Get benchmark price for the same month as the portfolio data point
        const price_usd_benchmark = getAdjustedCloseNearestSameMonth(asset.date, timeSeries); //msci for testing
        const quantity = asset.quantity || 0;

        if (!asset.date || !price_usd_benchmark) return;

        // Calculate benchmark value using portfolio quantity for comparison
        result.push({
          date: asset.date,
          value: price_usd_benchmark * quantity,
          quantity: quantity,  
          pricePerItem: price_usd_benchmark,
        });
      });

    setBenchmarkData(result);
  }

  // Fetch benchmark data when portfolio performance data is available
  useEffect(() => {
    if (portfolioPerformance.length > 0) {
      fetchBenchmark();
    }
  }, [portfolioPerformance]);

  // Render performance chart when all filters are selected
  const renderPerformanceChart = useMemo(() => {
    if (selectedBank && selectedPortfolio && selectedAssetName) {
      return (
        <Card elevation={2}>
          <CardContent>
            <PerformanceChart
              title={title + ' ' + selectedPortfolio + ' - ' + selectedAssetName}
              portfolioPerformance={portfolioPerformance}
              benchmarkData={benchmarkData}
            />
          </CardContent>
        </Card>
      );
    }
    return (
      <Typography variant="body2" color="text.secondary">
        Please select a bank, a portfolio, and an asset to view the performance chart.
      </Typography>
    );
  }, [selectedBank, selectedPortfolio, selectedAssetName, portfolioPerformance, benchmarkData, title]);

  // Show loading state while fetching assets
  if (loading) return <Typography>Loading assets...</Typography>;
  if (!assets || assets.length === 0) return <Typography>No asset data found.</Typography>;

  return (
    <Box>
      {/* Filter controls section */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          backgroundColor: '#f9f9f9',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filter Assets
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FilterControls
            selectedBank={selectedBank}
            setSelectedBank={handleBankChange}
            banks={banks}
            selectedPortfolio={selectedPortfolio}
            setSelectedPortfolio={handlePortfolioChange}
            portfolios={portfolios}
            selectedAssetName={selectedAssetName}
            setSelectedAssetName={handleAssetNameChange}
            assetNames={assetNames}
          />
        </Stack>
      </Paper>

      {/* Performance chart */}
      {renderPerformanceChart}
    </Box>
  );
}

export default PerformanceView;
