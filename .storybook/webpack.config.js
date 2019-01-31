const path = require('path')

module.exports = storybookBaseConfig => {
  // storybookBaseConfig.resolve.alias['backbone'] = path.resolve(__dirname, '../shims/backbone.js')
  //storybookBaseConfig.resolve.alias['backbone.marionette'] = path.resolve(__dirname, '../shims/marionette.js')

  storybookBaseConfig.module.rules.push({
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader'],
    include: path.resolve(__dirname, '../')
  })


  const cssModuleRegex = /\.module\.css$/;
  storybookBaseConfig.module.rules.push({
    test: cssModuleRegex,
    loaders: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }
    ]
  })
 
  // Have to exclude the shims/ so they don't get babel pre-compiled
  storybookBaseConfig.module.rules[0].exclude.push(path.resolve(__dirname, '../shims'))


  storybookBaseConfig.module.rules.push( {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader"
    }
  })

  // console.log(JSON.stringify(storybookBaseConfig, null, '\t'));
  return storybookBaseConfig
}

