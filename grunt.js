/*global module:false*/
module.exports = function(grunt) {

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
      files: 'lib/**/*.ts',
      tasks: 'typescript qunit'
    },
    typescript: {
      base: {
        src: ["lib/**/*.ts"],
        dest: "target/"
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'typescript qunit concat min');
  grunt.loadNpmTasks("grunt-typescript");
};
