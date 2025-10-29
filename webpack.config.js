const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('./package.json').dependencies;

// Convert module.exports to a function to access the command line arguments (argv)
// This allows us to dynamically set the publicPath based on the 'mode' argument (development or production)
module.exports = (env, argv) => {
  // Check if Webpack mode is production (i.e., when running 'npm run build -- --mode production')
  const isProduction = argv.mode === 'production';
  
  // Define the publicPath based on the mode:
  // 1. Development (Local): Full URL with port for webpack-dev-server and MFE dynamic loading
  const devPath = 'http://localhost:8082/'; 
  
  // 2. Production (Vercel): Root-relative path to ensure assets load correctly on the live domain
  // const prodPath = '/online-banking-mfe-2/'
  const prodPath = '/';

  const publicPath = isProduction ? prodPath : devPath;

  console.log(`[WEBPACK CONFIG] Building in ${argv.mode} mode. Public Path: ${publicPath}`);

  return {
    entry: './src/index.js', 
    // NOTE: The 'mode' is now passed via the CLI (e.g., --mode production), 
    // so we don't set it here explicitly for 'development'.
    
    devServer: {
      port: 8082,
      open: true,
      // The publicPath setting here in devServer is often redundant when output.publicPath is set.
    },
    
    output: {
      // FIX: Set a publicPath that is instantly overridden by the MFE's runtime code
      publicPath: 'auto', // Use 'auto' to ensure Webpack defaults are disabled
      path: path.resolve(__dirname, 'dist'),
    },
    
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
            },
          },
        },
      ],
    },
    
    plugins: [
      new ModuleFederationPlugin({
        name: 'onlineBankingMFE1',
        filename: 'remoteEntry.js',
        exposes: {
          './OnlineBankingComponent': './src/OnlineBankingMFE.jsx',
        },
        shared: {
          // CRITICAL FIX FOR ISOLATION: Setting eager: true loads the dependency immediately
          react: {
            singleton: true,
            requiredVersion: deps.react,
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
            eager: true,
          },
          redux: {
            singleton: true,
            requiredVersion: deps.redux,
            eager: true,
          },
          'react-redux': {
            singleton: true,
            requiredVersion: deps['react-redux'],
            eager: true,
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
  };
};