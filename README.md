# React Asset Management

A comprehensive financial asset management application built with React, TypeScript, and Redux. This application provides powerful tools for tracking, visualizing, and analyzing asset performance across multiple portfolios.

## 🚀 Features

- **Interactive Dashboard**: Overview of assets with key performance metrics
- **Portfolio Management**: Organize assets across multiple portfolios and banks
- **Performance Analysis**: Track asset performance with customizable date ranges
- **Data Visualization**: Interactive charts powered by Highcharts
- **Asset Filtering**: Advanced filtering capabilities by bank, portfolio, and asset name
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Real-time Updates**: State management with Redux for efficient updates

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI library with hooks for state and effects |
| TypeScript | Type-safe JavaScript development |
| Redux Toolkit | State management with entity adapters |
| Material UI | Component library for consistent, responsive UI |
| Highcharts | Interactive and customizable charts |
| Axios | HTTP client for API communication |
| Vite | Modern, fast build tool and dev server |
| ESLint & Prettier | Code quality and formatting |

## 📂 Project Structure

```
app/
├── public/                # Static assets
├── src/
│   ├── api/               # API services and data fetching
│   │   └── asset.api.ts   # Asset API service
│   ├── components/        # UI components
│   │   ├── common/        # Shared components
│   │   └── pages/         # Page-specific components
│   │       ├── Performance/   # Performance analysis components
│   │       └── ...
│   ├── store/             # Redux store configuration
│   │   ├── slices/        # Redux slices for state management
│   │   │   └── asset.slice.ts  # Asset state management
│   │   └── store.ts       # Central Redux store configuration
│   ├── types/             # TypeScript type definitions
│   │   └── Asset.ts       # Asset type definitions
│   ├── utils/             # Utility functions
│   └── views/             # Main view containers
│       └── types/         # View-related type definitions
├── App.tsx                # Main application component
└── main.tsx              # Application entry point
```

## 🔧 Prerequisites

- Node.js 16+ 
- npm 7+

## 🚀 Getting Started

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd react-asset-management
   ```

2. Install dependencies
   ```bash
   cd app
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173

## 💻 Development Workflow

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview the production build locally

### Code Quality and Best Practices

This project follows established React and TypeScript best practices:

- **TypeScript**: Strict type checking and interfaces
- **ESLint**: Code quality rules with React-specific configurations
- **Prettier**: Consistent code formatting
- **Performance Optimization**: 
  - Memoization with useMemo and useCallback
  - Efficient Redux state management
  - Optimized rendering cycles

## 🔄 State Management

The application uses Redux Toolkit with entity adapters for efficient state management:

```typescript
// Creating the entity adapter
const adapter = createEntityAdapter<Asset>();

// Async thunks for API calls
export const fetchAssets = createAsyncThunk<Asset[], void, { rejectValue: string }>(
  "assets/fetchAssets",
  async (_, thunkAPI) => {
    try {
      const response = await AssetApi.getAssetData();
      return response.data as Asset[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch assets");
    }
  }
);
```

## 📊 Data Visualization

The application uses Highcharts for data visualization with custom type definitions:

```typescript
// Portfolio pie chart configuration
const options: Highcharts.Options = {
  chart: {
    type: 'pie',
    height: 250,
    width: 250,
  },
  series: [{
    name: 'Portfolio Amount',
    colorByPoint: true,
    type: 'pie',
    data: data.map((item, index) => ({
      name: item.portfolio,
      y: item.amount,
      color: COLORS[index % COLORS.length],
    })),
  } as any],
};
```

## 🔍 Performance Optimization

The application implements several performance optimizations:

1. **Memoization**: Using `useMemo` and `useCallback` to prevent unnecessary recalculations
   ```typescript
   const filteredAssets = useMemo(() => {
     return assets.filter(asset => /* filtering logic */);
   }, [assets, selectedBank, selectedPortfolio]);
   ```

2. **Custom Hooks**: Extracting and reusing logic in custom hooks
   ```typescript
   const useAssetProcessing = (assets: Asset[]) => {
     // State and memoized values
     return {
       // Values and handlers
     };
   };
   ```

3. **Optimized Rendering**: Preventing unnecessary re-renders
   ```typescript
   // Only update when data changes
   useEffect(() => {
     if (benchmarkData.length > 0) return;
     // Fetch data
   }, [fromDate, toDate, benchmarkData.length]);
   ```

## 🔌 API Integration

The application uses a dedicated API service for asset data:

```typescript
// Asset API service
class AssetApiService {
  async getAssetData() {
    try {
      const response = await axios.get<Asset[]>(`${API_BASE_URL}/assets`);
      return response;
    } catch (error) {
      console.error('Error fetching asset data:', error);
      throw error;
    }
  }
  
  // Other API methods...
}
```

## 🏗️ Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🧩 Extending the Application

### Adding New Features

1. Create new components in the appropriate directory
2. Add Redux slices for new state requirements
3. Create API services for new data requirements
4. Update views to incorporate new features

### Adding New Asset Types

1. Extend the Asset type definition in `src/types/Asset.ts`
2. Update the asset adapter in the Redux slice
3. Add UI components to support the new asset type

## 🔧 Troubleshooting

### Common Issues

- **API Connection Issues**: Check the API URL configuration in `src/api/asset.api.ts`
- **Type Errors**: Ensure types match the actual data structure from the API
- **Performance Issues**: 
  - Use React DevTools to identify unnecessary re-renders
  - Check dependency arrays in useEffect and useMemo hooks
  - Look for expensive calculations that could be memoized

## 👥 Contributing

1. Create a feature branch
2. Make your changes with appropriate tests
3. Ensure code quality with linting and formatting
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
