// types/Asset.ts

export interface Asset {
  TRADE_ID: string;
  BANK: string;
  PORTFOLIO: string;
  TRADE_DATE: string;
  ASSET_CLASS: string;
  ASSET_TICKER: string;
  ASSET_NAME: string;
  DIRECTION: string;
  QUANTITY: number;
  PRICE_USD: number;
  TRADE_AMOUNT_USD: number;
  CURRENCY: string;
  PRICE_LOCAL: number;
  TRADE_AMOUNT_LOCAL: number;
}

export interface AssetState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  uploadStatus: "idle" | "uploading" | "succeeded" | "failed";
  uploadError: string | null;
}
