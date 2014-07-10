"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        'ftp-deploy': {
            build: {
                auth: {
                    host: 'qaagent.com',
                    port: 21,
                    authKey: 'key1'
                },
                src: '.',
                dest: 'public_html/beta',
                exclusions: ['']
            }
        }
    });

    grunt.loadNpmTasks('grunt-ftp-deploy');

    // A very basic default task.
    grunt.registerTask('default', 'Log some stuff.', function() {
        grunt.log.write('Logging some stuff...').ok();
    });
};