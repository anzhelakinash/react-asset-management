import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";

// API for asset operations
import AssetApi from "../../api/asset.api";

// Original Asset type from API
import { Asset, AssetState } from "../../types/Asset";

import type { RootState } from '../../store/store';

// Type with 'id' added for Redux Toolkit's entity adapter compatibility
type AssetWithId = Asset & { id: string };

// Create entity adapter using custom selectId (maps to asset.ID)
// Entity adapter provides CRUD operations and selectors for normalized state
const assetAdapter = createEntityAdapter<AssetWithId, string>({
  selectId: (asset) => asset.TRADE_ID,
});


// Thunk: Fetch assets with optional filters and inject 'id' property
export const fetchAssets = createAsyncThunk<AssetWithId[], { bank?: string; portfolio?: string; tradeTicker?: string } | undefined>(
  "assets/fetchAssets",
  async (filters) => {
    const response = await AssetApi.getAssetData(filters);
    // Add 'id' property to each asset for entity adapter compatibility
    return response.data.map((asset: Asset) => ({
      ...asset,
      id: asset.TRADE_ID, // Add `id` for Redux entity adapter compatibility
    }));
  }
);

// Thunk: Upload asset file (Excel, CSV) to the server
export const uploadAssetFile = createAsyncThunk<
  any,            // Response type, passe ggf. an
  File            // Parameter type (Excel file)
>(
  "assets/uploadAssetFile",
  async (file: File) => {
    const response = await AssetApi.uploadAssetFile(file);
    return response.data;  // z.B. { message, total, successful, failed, errors }
  }
);

// Slice with status and error fields in initial state
const assetSlice = createSlice({
  name: "assets",
  // Initialize state with entity adapter's getInitialState plus additional fields
  initialState: assetAdapter.getInitialState<AssetState>({
    status: "idle",
    error: null,
    uploadStatus: "idle",
    uploadError: null,
  }),
  reducers: {
    // Reset the entire assets state
    resetAssets: (state) => {
      assetAdapter.removeAll(state);
      state.status = "idle";
      state.error = null;
      state.uploadStatus = "idle";
      state.uploadError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assets loading state
      .addCase(fetchAssets.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // Fetch assets success state - store all assets
      .addCase(fetchAssets.fulfilled, (state, action: PayloadAction<AssetWithId[]>) => {
        state.status = "succeeded";
        assetAdapter.setAll(state, action.payload);
      })
      // Fetch assets error state
      .addCase(fetchAssets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      })
      // Upload asset file loading state
      .addCase(uploadAssetFile.pending, (state) => {
        state.uploadStatus = "uploading";
        state.uploadError = null;
      })
      // Upload asset file success state
      .addCase(uploadAssetFile.fulfilled, (state, _) => {
        state.uploadStatus = "succeeded";
        // Optional: You could call fetchAssets here to refresh the list
        // or store response data if needed
      })
      // Upload asset file error state
      .addCase(uploadAssetFile.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.uploadError = action.error.message || "Upload failed";
      });
  },
});

// Export actions and reducer
export const { resetAssets } = assetSlice.actions;
export default assetSlice.reducer;

// Generate and export selectors from the entity adapter
// These can be used to query assets from components
export const {
  selectAll: selectAllAssets,
  selectById: selectAssetById,
  selectIds: selectAssetIds,
} = assetAdapter.getSelectors((state: RootState) => state.assets);
