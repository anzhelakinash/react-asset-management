import axios from "axios";

class UserApi {
  /**
   * Get User Data
   * --------------------
   * @returns {Object} response
   */
  static getUserData = async (filters?: { user_id?: string }) => {
    // Build query params string dynamically
    const params = new URLSearchParams();

    if (filters?.user_id) params.append('user_id', filters.user_id);

    const url = import.meta.env.VITE_API_USER_ENDPOINT + "/users" + (params.toString() ? `?${params.toString()}` : '');

    const response = await axios.get(url);
    return response;
  };

  /**
   * Get User Role Data
   * --------------------
   * @returns {Object} response
   */
  static getUserRoleData = async (filters?: { user_id?: string }) => {
    // Build query params string dynamically
    const params = new URLSearchParams();

    if (filters?.user_id) params.append('user_id', filters.user_id);

    const url = import.meta.env.VITE_API_USER_ENDPOINT + "/users/roles" + (params.toString() ? `?${params.toString()}` : '');

    const response = await axios.get(url);
    return response;
  };
}

export default UserApi;
