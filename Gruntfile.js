module.exports = function(grunt) {

  grunt.initConfig({
    nodewebkit: {
      options: {
        build_dir: './build', // Where the build version of my node-webkit app is saved
        // Build all platforms we can
        mac: true,
        win: true,
        linux32: true,
        linux64: true,

        // This will be set from the package.json, but add if you want a different version
        // app_version: '0.1.0',
        app_name: 'Glitter for Artemis'
        // TODO: you'll want to have a credits.html somewhere then enable the following:
        // credits: 'credits.html',
        // TODO: When you get a proper icon :-)
        // mac_icns: 'glitter.icns'
      },
      src: ['*.js', '*.html', '*.json', 'node_modules/**/*', 'packets/**/*', 'public/**/*',
            'routes/**/*', 'views/**/*', 'LICENSE', 'package.json', 'README.md']
    },
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['nodewebkit']);

};
