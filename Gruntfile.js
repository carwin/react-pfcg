module.exports = function(grunt) {

  grunt.initConfig({
    serve: {
      options: {
        port: 9000
      }
    },
    babel: {
      options: {
        sourceMap: false,
        presets: ['es2015', 'react']
      },
      dist: {
        files: {
          'dist/helloworld.js': 'src/helloworld.jsx'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-serve');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('default', ['babel', 'serve']);

}
