
fis.match('require.config.*.js', {
  // fis-optimizer-uglify-js 
  optimizer: fis.plugin('uglify-js'),
  useHash:true
});
