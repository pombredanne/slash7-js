/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib');
  // Project configuration.
  grunt.initConfig({
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: ["target/**/*.js"],
        dest: 'dist/tracker.js'
      }
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: 'dist/tracker.min.js'
      }
    },
    uglify: {
      mangle: {toplevel: true},
      squeeze: {dead_code: true},
      codegen: {quote_keys: true}
    },
    watch: {
      files: ['lib/**/*', 'test/*'],
      tasks: 'copy typescript concat min qunit'
    },
    typescript: {
      base: {
        src: ["lib/**/*.ts"],
        dest: "target/"
      }
    },
    copy: {
      main: {
        files: [
	  {src: ['lib/**/*.js'], dest: 'target/lib/'}
	]
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'copy typescript concat min qunit');
  grunt.loadNpmTasks("grunt-typescript");
};
