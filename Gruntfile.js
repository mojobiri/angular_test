module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: process.env.AWS_S3_BUCKET, // That's how we can access system env and we can inject '<%= env %>'
    ngconstant: {
      // Options for all targets
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'config',
      },
      // Environment targets
      development: {
        options: {
          dest: 'app/js/config.js'
        },
        constants: {
          ENV: {
            name: 'development',
            uploadUrl: 'http://localhost:3003/upload.json',
            communityPhotosUrl: 'http://localhost:3003/list.json'
          }
        }
      },
      production: {
        options: {
          dest: 'app/js/config.js'
        },
        constants: {
          ENV: {
            name: 'production',
            uploadUrl: 'http://localhost:3003/upload.json',
            communityPhotosUrl: 'http://localhost:3003/list.json'
          }
        }
      }
    }
  });

  // Load the plugin that provides task.
  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.registerTask('const', ['ngconstant:development']);
  grunt.registerTask('constprod', ['ngconstant:production']);

  // Default task(s).
  grunt.registerTask('default', ['ngconstant:development']);

};