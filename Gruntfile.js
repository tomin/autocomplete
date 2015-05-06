module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        qunit: {
            files: ['test/index.html']
        }
    });

    // Load plugin
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Default task.
    grunt.registerTask('default', 'qunit');

    // Task to run tests
    grunt.registerTask('test', 'qunit');
};