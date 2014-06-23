module.exports = function(grunt) {

  grunt.initConfig({
    nodewebkit: {
      options: {
        build_dir: './build', // Where the build version of my node-webkit app is saved
        mac: true, // We want to build it for mac
        win: true, // We want to build it for win
        linux32: true, // We don't need linux32
        linux64: true, // We don't need linux64
        app_version: '0.1',
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
