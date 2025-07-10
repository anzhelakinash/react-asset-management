import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
  Paper,
} from '@mui/material';
import { ViewProps } from "../../../views/types/ViewProps";
import { useDispatch, useSelector } from 'react-redux';
import { selectAllAssets, fetchAssets } from '../../../store/slices/assetSlice';
import type { RootState, AppDispatch } from '../../../store/store';
import useAssetProcessing from '../../../hooks/useAssetProcessing';
import { FilterControls } from './components/FilterControls'; 

// Default stress scenario percentages
const defaultStressLevels = [0, -10, -20, -30];

function StressScenarioView({ }: ViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const assets = useSelector(selectAllAssets);
  const loading = useSelector((state: RootState) => state.assets.status === 'loading');

  // State for custom stress percentage slider
  const [customStress, setCustomStress] = useState<number>(-10);

  // Fetch assets when component mounts
  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

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

  // Get the selected asset for stress testing (using the most recent one)
  const selectedAsset = useMemo(() => {
    return filteredAssets.length > 0 ? filteredAssets[filteredAssets.length - 1] : null;
  }, [filteredAssets]);

  // Calculate stress scenarios based on selected asset and stress percentages
  const stressScenarios = useMemo(() => {
    if (!selectedAsset) return [];

    // Combine default stress levels with custom stress level, removing duplicates
    const allScenarios = [...defaultStressLevels, customStress].filter(
      (value, index, self) => self.indexOf(value) === index
    );

    // Calculate financial impact for each stress scenario
    return allScenarios
      .sort((a, b) => a - b)
      .map((stress) => {
        const newPrice = selectedAsset.PRICE_USD * (1 + stress / 100);
        const newAmount = newPrice * selectedAsset.QUANTITY;
        const absoluteLoss = selectedAsset.TRADE_AMOUNT_USD - newAmount;
        const percentageLoss = (absoluteLoss / selectedAsset.TRADE_AMOUNT_USD) * 100;

        return {
          stressLabel: `${stress > 0 ? '+' : ''}${stress}%`,
          newPrice: newPrice.toFixed(2),
          newAmount: newAmount.toFixed(2),
          absoluteLoss: absoluteLoss.toFixed(2),
          percentageLoss: percentageLoss.toFixed(2),
        };
      });
  }, [selectedAsset, customStress]);

  return (
    <Box mt={4}>
      {/* Filter controls panel */}
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
          Stress Scenarios: Price Decline
        </Typography>

        {loading && <Typography>Loading assets...</Typography>}

        {/* Asset selection filters */}
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
      </Paper>

      {selectedAsset && (
        <>
          {/* Custom stress percentage slider */}
          <Box width={300} mb={2}>
            <Typography variant="body2" gutterBottom>
              Custom Price Loss (%)
            </Typography>
            <Slider
              value={customStress}
              onChange={(_, newValue) => setCustomStress(newValue as number)}
              min={-90}
              max={0}
              step={1}
              valueLabelDisplay="auto"
            />
          </Box>

          {/* Stress scenarios results table */}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Scenario</TableCell>
                  <TableCell>New Price (USD)</TableCell>
                  <TableCell>New Total Value (USD)</TableCell>
                  <TableCell>Loss (USD)</TableCell>
                  <TableCell>Loss (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stressScenarios.map((s) => (
                  <TableRow key={s.stressLabel}>
                    <TableCell>{s.stressLabel}</TableCell>
                    <TableCell>{s.newPrice}</TableCell>
                    <TableCell>{s.newAmount}</TableCell>
                    <TableCell>{s.absoluteLoss}</TableCell>
                    <TableCell>{s.percentageLoss}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Empty state message */}
      {!loading && !selectedAsset && (
        <Typography variant="body2" color="text.secondary">
          Please select a bank, a portfolio, and an asset to view the performance chart.
        </Typography>
      )}
    </Box>
  );
}

export default StressScenarioView;
