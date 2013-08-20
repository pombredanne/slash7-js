/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: [
            // The order matters!
            'third-party/**/*.js',
            'lib/util.js',
            'lib/cookie.js',
            'lib/network.js',
            'lib/user.js',
            'lib/tracker.js'
        ],
        dest: 'dist/slash7.js'
      }
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: 'dist/slash7.min.js'
      }
    },
    watch: {
      files: ['<config:lint.files>', 'test/**/*.js'],
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint concat qunit min');

};
