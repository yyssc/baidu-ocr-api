module.exports = function(grunt) {

  grunt.initConfig({
    jsdoc : {
        dist : {
            src: ['src/*.js', 'test/*.js'],
            dest: 'out',
            options: {
                /*destination: 'doc',
                "recurse": true,
                "package": "package.json",
                "readme": "README.md",*/
                configure: "conf.json"
            }
        }
    }
    //,jshint: {
    //  files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
    //  options: {
    //    globals: {
    //      jQuery: true
    //    }
    //  }
    //},
    //watch: {
    //  files: ['<%= jshint.files %>'],
    //  tasks: ['jshint']
    //}
  });

  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');

  //grunt.registerTask('default', ['jshint', 'jsdoc']);
  grunt.registerTask('default', ['jsdoc']);

};
