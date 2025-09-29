const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  mode: 'production',
  output: { 
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  resolve: { extensions: ['.js', '.jsx'] },
  module: { 
    rules: [
      { 
        test: /\.jsx?$/, 
        loader: 'babel-loader', 
        exclude: /node_modules/ 
      }, 
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      }
    ] 
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe_cab',
      filename: 'remoteEntry.js',
      exposes: { 
        './CabApp': './src/App.jsx', 
        './CabSummary': './src/components/CabSummary.jsx' 
      },
      remotes: {
        base_app: 'base_app@https://baseapp111.netlify.app/remoteEntry.js'  // ✅ Updated URL
      },
      shared: { 
        react: { 
          singleton: true, 
          requiredVersion: false,
          eager: false
        }, 
        'react-dom': { 
          singleton: true, 
          requiredVersion: false,
          eager: false
        }, 
        'react-redux': { 
          singleton: true, 
          requiredVersion: false,
          eager: false
        }, 
        '@reduxjs/toolkit': { 
          singleton: true, 
          requiredVersion: false,
          eager: false
        } 
      }
    }),
    new HtmlWebpackPlugin({ 
      template: path.resolve(__dirname, 'public', 'index.html'),
      minify: true,
      inject: true
    })
  ],
  
  // Add optimization
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      }
    }
  }
};