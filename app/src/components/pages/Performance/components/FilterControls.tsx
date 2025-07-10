import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface FilterControlsProps {
  selectedBank: string;
  setSelectedBank: (bank: string) => void;
  banks: string[];

  selectedPortfolio: string;
  setSelectedPortfolio: (portfolio: string) => void;
  portfolios: string[];

  selectedAssetName: string;
  setSelectedAssetName: (name: string) => void;
  assetNames: string[];
}

export function FilterControls({
  selectedBank,
  setSelectedBank,
  banks,
  selectedPortfolio,
  setSelectedPortfolio,
  portfolios,
  selectedAssetName,
  setSelectedAssetName,
  assetNames,
}: FilterControlsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: 'row' }}>
      {/* Bank Portfolio Dropdown */}
      <FormControl sx={{ minWidth: 220 }} size="small">
        <InputLabel id="bank-select-label">Bank Portfolio</InputLabel>
        <Select
          labelId="bank-select-label"
          id="bank-select"
          value={selectedBank}
          label="Bank Portfolio"
          onChange={(e: SelectChangeEvent) => setSelectedBank(e.target.value)}
        >
          <MenuItem value="">
            <em>Select Bank</em>
          </MenuItem>
          {banks.map((bank) => (
            <MenuItem key={bank} value={bank}>
              {bank}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Portfolio Dropdown */}
      <FormControl sx={{ minWidth: 220 }} size="small" disabled={!selectedBank}>
        <InputLabel id="portfolio-select-label">Portfolio</InputLabel>
        <Select
          labelId="portfolio-select-label"
          id="portfolio-select"
          value={selectedPortfolio}
          label="Portfolio"
          onChange={(e: SelectChangeEvent) => setSelectedPortfolio(e.target.value)}
        >
          <MenuItem value="">
            <em>Select Portfolio</em>
          </MenuItem>
          {portfolios.map((portfolio) => (
            <MenuItem key={portfolio} value={portfolio}>
              {portfolio}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Asset Name Dropdown */}
      <FormControl
        sx={{ minWidth: 220 }}
        size="small"
        disabled={!selectedBank || !selectedPortfolio}
      >
        <InputLabel id="asset-select-label">Asset Name</InputLabel>
        <Select
          labelId="asset-select-label"
          id="asset-select"
          value={selectedAssetName}
          label="Asset Name"
          onChange={(e: SelectChangeEvent) => setSelectedAssetName(e.target.value)}
        >
          <MenuItem value="">
            <em>Select Asset</em>
          </MenuItem>
          {assetNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default FilterControls;
