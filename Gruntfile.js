module.exports = function(grunt) {

  // Get app name and version from package.json, append them so the built files
  //   have the version in the filename.
  var pkg = grunt.file.readJSON('package.json');
  var app_name = pkg.name + '-' + pkg.version;

  grunt.initConfig({
    nodewebkit: {
      options: {
        build_dir: './build', // Where the build version of my node-webkit app is saved
        // Build all platforms we can
        mac: true,
        win: true,
        linux32: true,
        linux64: true,

        app_name: app_name

        // TODO: you'll want to have a credits.html somewhere then enable the following:
        // credits: 'credits.html',
        // TODO: When you get a proper icon :-)
        // mac_icns: 'glitter.icns'
      },
      src: ['*.js', '*.html', '*.json', 'node_modules/**/*', 'packets/**/*', 'public/**/*',
            'routes/**/*', 'views/**/*', 'LICENSE', 'package.json', 'README.md']
    },
    zip: {
        'mac': {
            cwd: 'build/releases/' + app_name + '/mac/',
            src: ['build/releases/' + app_name + '/mac/' + app_name + '.app/**/*'],
            dest: 'build/releases/' + app_name + '/' + app_name + '-mac.zip'
        },
        'win': {
            cwd: 'build/releases/' + app_name + '/win/',
            src: ['build/releases/' + app_name + '/win/' + app_name + '/**/*'],
            dest: 'build/releases/' + app_name + '/' + app_name + '-win.zip'
        },
        'linux32': {
            cwd: 'build/releases/' + app_name + '/linux32/',
            src: ['build/releases/' + app_name + '/linux32/' + app_name + '/**/*'],
            dest: 'build/releases/' + app_name + '/' + app_name + '-linux32.zip'
        },
        'linux64': {
            cwd: 'build/releases/' + app_name + '/linux64/',
            src: ['build/releases/' + app_name + '/linux64/' + app_name + '/**/*'],
            dest: 'build/releases/' + app_name + '/' + app_name + '-linux64.zip'
        },
    }
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.loadNpmTasks('grunt-zip');
  grunt.registerTask('default', ['nodewebkit','zip']);

};
