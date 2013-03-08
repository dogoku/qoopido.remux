/*global module:false*/
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta:{
			banner:'/*!\n' +
				'* Qoopido REMux: an REM and JS based approach to responsive web design\n' +
				'*\n' +
				'* Source:  <%= pkg.title || pkg.name %>\n' +
				'* Version: <%= pkg.version %>\n' +
				'* Date:    <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* Author:  <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
				'* Website: <%= pkg.homepage %>\n' +
				'*\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				'*\n' +
				'* Licensed under the <%= _.pluck(pkg.licenses, "type").join(" and ") %> license.\n' +
				'*  - <%= _.pluck(pkg.licenses, "url").join("\\n*  - ") %>\n' +
				'*/\n'
		},
		jshint:{
			options: {
				jshintrc: '.jshintrc'
			},
			dist:[
				'Gruntfile.js',
				'src/**/*.js'
			]
		},
		clean: {
			options: {
				force: true
			},
			dist: ['min/**/*', 'packages/**/*']
		},
		concat:{
			options:{
				stripBanners: true,
				banner: '<%= meta.banner %>'
			},
			dist:{
				src:[
					'assets/vendor/qoopido.js/src/base.js',
					'assets/vendor/qoopido.js/src/emitter.js',
					'src/remux.js'
				],
				dest:'packages/qoopido.remux.js'
			}
		},
		uglify:{
			options:{
				preserveComments: 'some'
			},
			dist:{
				files: {
					'packages/qoopido.remux.min.js': ['packages/qoopido.remux.js']
				}
			}
		},
		uglifyrecursive: {
			dist: {
				files: [
					{ strip: 'src', src: ['src/**'], dest: 'min/'}
				]
			}
		},
		compress:{
			dist:{
				options:{
					archive:'packages/qoopido.remux.zip',
					mode:'zip',
					level:1,
					pretty:true
				},
				files: [
					{ src: ['packages/qoopido.remux*.js', 'assets/remux.less'] }
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-uglifyrecursive');

	grunt.registerTask('default', ['jshint', 'clean', 'concat', 'uglify', 'uglifyrecursive', 'compress']);
};