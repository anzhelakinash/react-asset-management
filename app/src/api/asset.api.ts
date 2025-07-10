import axios from "axios";

class AssetApi {
  /**
   * Get Asset Data
   * --------------------
   * @returns {Object} response
   */
  static getAssetData = async (filters?: { bank?: string; portfolio?: string; tradeTicker?: string }) => {
    // Build query params string dynamically
    const params = new URLSearchParams();

    if (filters?.bank) params.append('bank', filters.bank);
    if (filters?.portfolio) params.append('portfolio', filters.portfolio);
    if (filters?.tradeTicker) params.append('tradeTicker', filters.tradeTicker);

    const url = import.meta.env.VITE_API_ASSET_ENDPOINT + "/assets" + (params.toString() ? `?${params.toString()}` : '');

    const response = await axios.get(url);
    return response;
  };


  /**
   * Upload Asset Excel File
   * --------------------
   * @param {File} file - Excel file to upload
   * @returns {Object} response
   */
  static uploadAssetFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      import.meta.env.VITE_API_ASSET_ENDPOINT + "/assets/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  };
}

export default AssetApi;
