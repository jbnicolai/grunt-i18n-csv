/*
 * grunt-i18n-csv
 * https://github.com/wet-boew/grunt-i18n-csv
 *
 * Copyright (c) 2014 Laurent Goderre
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var csv = require('csv');
var chalk = require('chalk');
var simple = require('../lib/simple');
var template = require('../lib/template');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('i18n_csv', 'Create internationalized files from a CSV translations file', function () {

    var done = this.async();

    var task = this;

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      startRow: 0,
      startCol: 0,
      format: 'json',
      useDefaultOnMissing : false,
      headerRowHasKey: false
    });

    var languages, processor;

    if (options.csv === undefined) {
      grunt.fail.warn('Missing required options \'csv\'');
    }

    if (options.template !== undefined) {
      options.templateContent = grunt.file.read(options.template);
      options.ext = path.extname(options.template);
      processor = template(options);
    } else {
      if (options.format === 'json') {
        options.ext = ".json";
      } else if (options.format === 'yaml') {
        options.ext = ".yml";
      }
      processor = simple(options);
    }

    csv().from.stream(
      fs.createReadStream(options.csv)
    ).on(
      'error', 
      function(error) { 
        grunt.fail.warn(error);
      }
    ).on(
        'record',
        function(row, index) {
          var newRow = row.splice(options.startCol);

          if (index === options.startRow) {
            languages = newRow.slice(1);
          }
          if (index > options.startRow || (index === options.startRow && options.headerRowHasKey)) {
            processor.process(newRow);
          }
        }
    ).on(
      'end', function () {
        var contents = processor.complete();
        contents.forEach(function(content, index){
          var file = path.join(task.files[0].dest, languages[index] + options.ext);
          grunt.file.write(file, content);
          grunt.log.writeln('File ' + chalk.cyan(file) + ' created.');
        });
        done();
      }
    );
  });

};
