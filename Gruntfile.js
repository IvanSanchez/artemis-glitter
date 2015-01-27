module.exports = function(grunt) {

  // Get app name and version from package.json, append them so the built files
  //   have the version in the filename.
  var pkg = grunt.file.readJSON('package.json');
  var app_name = pkg.name + '-' + pkg.version;

  var common_files = ['LICENSE','README.md', 'config/default.yaml'];

  grunt.initConfig({
    nodewebkit: {
      options: {
        buildDir: './build', // Where the build version of my node-webkit app is saved
        // Build all platforms we can
        osx32: true,
        osx64: true,
        win32: true,
        win64: true,
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
    copy: {
        main: {
            files: [
            {expand: true, src: common_files, dest: 'build/' + app_name + '/osx32/' + '.app/', filter: 'isFile'},
            {expand: true, src: common_files, dest: 'build/' + app_name + '/osx64/' + '.app/', filter: 'isFile'},
            {expand: true, src: common_files, dest: 'build/' + app_name + '/win32/' + '/', filter: 'isFile'},
            {expand: true, src: common_files, dest: 'build/' + app_name + '/win64/' + '/', filter: 'isFile'},
            {expand: true, src: common_files, dest: 'build/' + app_name + '/linux32/' + '/', filter: 'isFile'},
            {expand: true, src: common_files, dest: 'build/' + app_name + '/linux64/' + '/', filter: 'isFile'},
            ]
        }
    },
    zip: {
        'osx32': {
            cwd: 'build/' + app_name + '/osx32/',
            src: [
                 'build/' + app_name + '/osx32/' + app_name + '.app/**/*'
                ,'build/' + app_name + '/osx32/' + app_name + '.app/LICENSE'
                ,'build/' + app_name + '/osx32/' + app_name + '.app/README.md'
                ,'build/' + app_name + '/osx32/' + app_name + '.app/config/default.yaml'
            ],
            dest: 'build/' + app_name + '/' + app_name + '-osx32.zip'
        },
        'osx64': {
            cwd: 'build/' + app_name + '/osx64/',
            src: [
                 'build/' + app_name + '/osx64/' + app_name + '.app/**/*'
                ,'build/' + app_name + '/osx64/' + app_name + '.app/LICENSE'
                ,'build/' + app_name + '/osx64/' + app_name + '.app/README.md'
                ,'build/' + app_name + '/osx64/' + app_name + '.app/config/default.yaml'
            ],
            dest: 'build/' + app_name + '/' + app_name + '-osx64.zip'
        },
        'win32': {
            cwd: 'build/' + app_name + '/win32/',
            src: [
                 'build/' + app_name + '/win32/' + '/**/*'
                ,'build/' + app_name + '/win32/' + '/LICENSE'
                ,'build/' + app_name + '/win32/' + '/README.md'
                ,'build/' + app_name + '/win32/' + '/config/default.yaml'
            ],
            dest: 'build/' + app_name + '/' + app_name + '-win32.zip'
        },
        'win64': {
            cwd: 'build/' + app_name + '/win64/',
            src: [
                 'build/' + app_name + '/win64/' + '/**/*'
                ,'build/' + app_name + '/win64/' + '/LICENSE'
                ,'build/' + app_name + '/win64/' + '/README.md'
                ,'build/' + app_name + '/win64/' + '/config/default.yaml'
            ],
            dest: 'build/' + app_name + '/' + app_name + '-win64.zip'
        },
        'linux32': {
            cwd: 'build/' + app_name + '/linux32/',
            src: [
                 'build/' + app_name + '/linux32/' + '/**/*'
                ,'build/' + app_name + '/linux32/' + '/LICENSE'
                ,'build/' + app_name + '/linux32/' + '/README.md'
                ,'build/' + app_name + '/linux32/' + '/config/default.yaml'
            ],
            dest: 'build/' + app_name + '/' + app_name + '-linux32.zip'
        },
        'linux64': {
            cwd: 'build/' + app_name + '/linux64/',
            src: [
                 'build/' + app_name + '/linux64/' + '/**/*'
                ,'build/' + app_name + '/linux64/' + '/LICENSE'
                ,'build/' + app_name + '/linux64/' + '/README.md'
                ,'build/' + app_name + '/linux64/' + '/config/default.yaml'
            ],
            dest: 'build/' + app_name + '/' + app_name + '-linux64.zip'
        },
    }
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['nodewebkit','copy','zip']);

};
