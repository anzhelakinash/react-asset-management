import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Grid
} from '@mui/material';
import { selectAllAssets, fetchAssets } from '../../../store/slices/assetSlice';
import type { RootState, AppDispatch } from '../../../store/store';
import PortfolioPieChart from './components/PortfolioPieChart';
import { ViewProps } from '../../../views/types/ViewProps';
import { Asset } from '../../../types/Asset';

function AssetsView({ title }: ViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const assets = useSelector(selectAllAssets);
  // Check if assets are currently loading from the store
  const loading = useSelector((state: RootState) => state.assets.status === 'loading');

  // Fetch assets data when component mounts
  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  // Calculate portfolio summary metrics: total values and last trade date
  const summary = React.useMemo(() => {
    let totalUSD = 0;
    let totalLocal = 0;
    let lastTradeDate: string | null = null;

    assets.forEach((asset: Asset) => {
      totalUSD += asset.TRADE_AMOUNT_USD || 0;
      totalLocal += asset.TRADE_AMOUNT_LOCAL || 0;
      // Track most recent trade date
      if (!lastTradeDate || new Date(asset.TRADE_DATE) > new Date(lastTradeDate)) {
        lastTradeDate = asset.TRADE_DATE;
      }
    });

    return { totalUSD, totalLocal, lastTradeDate };
  }, [assets]);

  // Organize assets by bank and portfolio for the pie charts
  const bankData = React.useMemo(() => {
    const result: Record<
      string,
      {
        portfolio: string;
        investedUSD: number;
        investedLocal: number;
        committedUSD: number;
        committedLocal: number;
      }[]
    > = {};

    if (!assets || loading) return result;

    assets.forEach((asset: Asset) => {
      const bank = asset.BANK || 'Unknown Bank';
      const portfolio = asset.PORTFOLIO || 'Unknown Portfolio';
      const amountUSD = asset.TRADE_AMOUNT_USD || 0;
      const direction = asset.DIRECTION;

      // Initialize bank entry if it doesn't exist
      if (!result[bank]) result[bank] = [];

      // Find or create portfolio entry for this bank
      let entry = result[bank].find((p) => p.portfolio === portfolio);
      if (!entry) {
        entry = {
          portfolio,
          investedUSD: 0,
          investedLocal: 0,
          committedUSD: 0,
          committedLocal: 0,
        };
        result[bank].push(entry);
      }

      // Update portfolio amounts based on transaction direction
      if (direction === 'BUY') {
        entry.investedUSD += amountUSD;
      } else if (direction === 'SELL') {
        entry.investedUSD -= amountUSD;
      } else if (direction === 'COMMIT') {
        entry.committedUSD += amountUSD;
      }
    });

    return result;
  }, [assets, loading]);

  // Calculate totals by currency for the currency summary section
  const currencySummary = React.useMemo(() => {
    const result: Record<string, number> = {};

    assets.forEach((asset: Asset) => {
      const currency = asset.CURRENCY || 'Unknown';
      const amount = asset.TRADE_AMOUNT_LOCAL || 0;
      if (!result[currency]) {
        result[currency] = 0;
      }
      result[currency] += amount;
    });

    return result;
  }, [assets]);

  // Show loading or empty state if needed
  if (loading) return <Typography>Loading assets...</Typography>;
  if (!assets || assets.length === 0) return <Typography>No asset data found.</Typography>;

  return (
    <>
     <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title || 'Asset Summary'}
        </Typography>

        <Grid
          container
          alignItems="center"
          sx={{ mt: 1, flexWrap: 'nowrap' }}
        >
          {/* Left: Total & Last Trade Date (20%) */}
          <Grid item sx={{ flex: '0 0 20%' }}>
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
              <strong>Total (USD):</strong>{' '}
              ${summary.totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
              <strong>Last Trade Date:</strong>{' '}
              {summary.lastTradeDate ? new Date(summary.lastTradeDate).toLocaleDateString() : 'N/A'}
            </Typography>
          </Grid>

          {/* Right: Currency Boxes (80%) */}
          <Grid item sx={{ flex: '0 0 80%' }}>
            <Grid container spacing={2} justifyContent="space-between" wrap="nowrap">
              {/* Display currency boxes, sorted by amount (highest first) */}
              {Object.entries(currencySummary)
                .sort(([, a], [, b]) => b - a)
                .map(([currency, amount]) => (
                  <Grid item key={currency} sx={{ flex: 1 }}>
                    <Card
                      sx={{
                        height: 40,
                        px: 2,
                        py: 1,
                        backgroundColor: '#f5f5f5',
                        boxShadow: 'none',
                        border: '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                        <strong>{currency}:</strong>{' '}
                        {amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

      {/* Bank/Portfolio cards grid */}
      <Grid container spacing={3}>
        {Object.entries(bankData).map(([bankName, portfolios]) => (
          <Grid item xs={12} sm={6} md={6} key={bankName}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {bankName}
                </Typography>
                {portfolios.length > 0 ? (
                  <Grid container spacing={2}>
                    {/* Invested Capital pie chart */}
                    {portfolios.some((p) => p.investedUSD > 0) && (
                      <Grid item xs={12} sm={4.5}>
                        <Typography variant="subtitle2" gutterBottom>
                          Invested Capital (USD)
                        </Typography>
                        <PortfolioPieChart
                          data={portfolios
                            .filter((p) => p.investedUSD > 0)
                            .map((p) => ({
                              portfolio: p.portfolio,
                              amount: p.investedUSD,
                            }))}
                        />
                      </Grid>
                    )}

                    {/* Committed Capital pie chart */}
                    {portfolios.some((p) => p.committedUSD > 0) && (
                      <Grid item xs={12} sm={4.5}>
                        <Typography variant="subtitle2" gutterBottom>
                          Committed Capital (USD)
                        </Typography>
                        <PortfolioPieChart
                          data={portfolios
                            .filter((p) => p.committedUSD > 0)
                            .map((p) => ({
                              portfolio: p.portfolio,
                              amount: p.committedUSD,
                            }))}
                        />
                      </Grid>
                    )}

                    {/* Currency breakdown sidebar */}
                    <Grid item xs={12} sm={3} marginLeft={'auto'}>
                      <Typography variant="subtitle2" gutterBottom>
                        Assets by Currency
                      </Typography>
                      {Object.entries(currencySummary)
                        .sort(([, amountA], [, amountB]) => amountB - amountA)
                        .map(([currency, amount]) => (
                          <Typography key={currency} variant="body2">
                            <strong>{currency}:</strong>{' '}
                            {amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </Typography>
                        ))}
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No portfolio data.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default AssetsView;
