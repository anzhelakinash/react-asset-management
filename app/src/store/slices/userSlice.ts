import { User, UserRole, SelectedUser } from './../../types/User';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import UserApi from '../../api/users.api';
import type { RootState } from '../../store/store'; // Adjust path as needed

// State interface for user slice
interface UserState {
  selectedUser: SelectedUser | null;
  users: User[];
  userRoles: UserRole[];
  loading: boolean;
  error: string | null;
}

// Initial state values
const initialState: UserState = {
  selectedUser: null,
  users: [],
  userRoles: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all users
export const getUsers = createAsyncThunk(
  'users/fetchAll',
  async (params?: { user_id?: string }) => {
    const response = await UserApi.getUserData(params);
    return response.data as User[];
  }
);

// Async thunk to fetch user roles
export const getUserRoles = createAsyncThunk(
  'users/fetchRoles',
  async (params?: { user_id?: string }) => {
    const response = await UserApi.getUserRoleData(params);
    return response.data as UserRole[];
  }
);

// Create the user slice with reducers and extra reducers for async actions
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Reset all user data
    clearUserData(state) {
      state.selectedUser = null;
      state.users = [];
      state.userRoles = [];
      state.error = null;
      state.loading = false;
    },
    // Set the currently selected user
    setSelectedUser(state, action: PayloadAction<SelectedUser | null>) {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Users fetch states
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })

      // User Roles fetch states
      .addCase(getUserRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserRoles.fulfilled, (state, action: PayloadAction<UserRole[]>) => {
        state.loading = false;
        state.userRoles = action.payload;
      })
      .addCase(getUserRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user roles';
      });
  },
});

// Selectors

// Find a specific user by ID
export const selectUserById = (state: RootState, userId: string): User | undefined =>
  state.users.users.find(user => user.USER_ID === userId);

// Get the currently selected user
export const selectSelectedUser = (state: RootState): SelectedUser | null => state.users.selectedUser;

export const { clearUserData, setSelectedUser } = userSlice.actions;

export default userSlice.reducer;
