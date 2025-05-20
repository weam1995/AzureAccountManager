import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { protectedResources } from '@/lib/msal';
import { api } from '@/lib/api';
import { authenticatedFetch } from '@/lib/queryClient';
import { 
  PaginatedResponse, 
  StandardAccount, 
  UnixAccount, 
  AccountFilterOptions 
} from '@/types/account';

// Define the state interface
interface AccountsState {
  standardAccounts: {
    data: PaginatedResponse<StandardAccount> | null;
    loading: boolean;
    error: string | null;
  };
  unixAccounts: {
    data: PaginatedResponse<UnixAccount> | null;
    loading: boolean;
    error: string | null;
  };
  currentPage: number;
  pageSize: number;
  filterOptions: AccountFilterOptions;
}

// Initial state
const initialState: AccountsState = {
  standardAccounts: {
    data: null,
    loading: false,
    error: null
  },
  unixAccounts: {
    data: null,
    loading: false,
    error: null
  },
  currentPage: 1,
  pageSize: 10,
  filterOptions: {
    search: '',
    status: '',
    department: ''
  }
};

// Define async thunks for fetching accounts
export const fetchStandardAccountsThunk = createAsyncThunk(
  'accounts/fetchStandardAccounts',
  async (
    { 
      page, 
      pageSize, 
      filterOptions, 
      accessToken 
    }: { 
      page: number; 
      pageSize: number; 
      filterOptions: AccountFilterOptions; 
      accessToken: string; 
    }, 
    { rejectWithValue }
  ) => {
    try {
      // Build the request configuration
      const request = api.getStandardAccounts({
        page,
        pageSize,
        search: filterOptions.search,
        status: filterOptions.status,
        department: filterOptions.department
      });

      // Make the API call using the access token
      const data = await authenticatedFetch(
        request.url,
        accessToken,
        'GET'
      );

      return data as PaginatedResponse<StandardAccount>;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch standard accounts');
    }
  }
);

export const fetchUnixAccountsThunk = createAsyncThunk(
  'accounts/fetchUnixAccounts',
  async (
    { 
      page, 
      pageSize, 
      filterOptions, 
      accessToken 
    }: { 
      page: number; 
      pageSize: number; 
      filterOptions: AccountFilterOptions; 
      accessToken: string; 
    }, 
    { rejectWithValue }
  ) => {
    try {
      // Build the request configuration
      const request = api.getUnixAccounts({
        page,
        pageSize,
        search: filterOptions.search,
        status: filterOptions.status,
        department: filterOptions.department
      });

      // Make the API call using the access token
      const data = await authenticatedFetch(
        request.url,
        accessToken,
        'GET'
      );

      return data as PaginatedResponse<UnixAccount>;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch unix accounts');
    }
  }
);

// Create the accounts slice
const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setFilterOptions: (state, action: PayloadAction<AccountFilterOptions>) => {
      state.filterOptions = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Handle standard accounts thunk
    builder
      .addCase(fetchStandardAccountsThunk.pending, (state) => {
        state.standardAccounts.loading = true;
        state.standardAccounts.error = null;
      })
      .addCase(fetchStandardAccountsThunk.fulfilled, (state, action) => {
        state.standardAccounts.loading = false;
        state.standardAccounts.data = action.payload;
      })
      .addCase(fetchStandardAccountsThunk.rejected, (state, action) => {
        state.standardAccounts.loading = false;
        state.standardAccounts.error = action.payload as string;
      })
      
      // Handle unix accounts thunk
      .addCase(fetchUnixAccountsThunk.pending, (state) => {
        state.unixAccounts.loading = true;
        state.unixAccounts.error = null;
      })
      .addCase(fetchUnixAccountsThunk.fulfilled, (state, action) => {
        state.unixAccounts.loading = false;
        state.unixAccounts.data = action.payload;
      })
      .addCase(fetchUnixAccountsThunk.rejected, (state, action) => {
        state.unixAccounts.loading = false;
        state.unixAccounts.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const { setCurrentPage, setFilterOptions } = accountsSlice.actions;
export default accountsSlice.reducer;