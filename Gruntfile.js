/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    watch: {
      files: ['<%= lint.files %>', 'test/**/*.js'],
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
      },
      files: ['Gruntfile.js', 'lib/**/*.js']
    },
    uglify: {
      slash7: {
        files: {'dist/slash7.min.js': ['<%= concat.dist.dest %>']}
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'qunit', 'uglify']);

};
