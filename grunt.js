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
        src: ['lib/**/*.js', 'third-party/**/*.js'],
        dest: 'dist/tracker.js'
      }
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: 'dist/tracker.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint concat qunit'
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
