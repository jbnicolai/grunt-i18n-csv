/*
 * grunt-i18n-csv
 * https://github.com/wet-boew/grunt-i18n-csv
 *
 * Copyright (c) 2014 Laurent Goderre
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    i18n_csv: {
      options: {
        csv: 'test/fixtures/i18n.csv'
      },
      json: {
        options: {
          format: 'json'
        },
        dest: 'tmp/json'
      },
      yaml: {
        options: {
          format: 'yaml'
        },
        dest: 'tmp/yaml'
      },
      override_offsets: {
        options: {
          csv: 'test/fixtures/i18n_offset.csv',
          startRow: 1,
          startCol: 1,
          format: 'json'
        },
        dest: 'tmp/override_offsets'
      },
      template: {
        options: {
          template: 'test/fixture/template.json'
        },
        dest: 'tmp/template'
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'i18n_csv', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
