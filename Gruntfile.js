module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        uglify: {
            my_target: {
                files: {
                    'ajax.min.js': ['ajax.js'],
                    'autocomplete.min.js': ['autocomplete.js']
                }
            }
        },
        qunit: {
            files: ['test/index.html']
        }
    });

    // Load plugin
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');


    // Default task.
    grunt.registerTask('default', 'qunit');

    // Task to run tests
    grunt.registerTask('test', 'qunit');

    // Other task
    grunt.registerTask('min', 'uglify');
};