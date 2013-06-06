/*global module:false*/
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta:{
			general:'/*!\n' +
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
			build:[
				'Gruntfile.js',
				'src/**/*.js'
			]
		},
		clean: {
			options: {
				force: true
			},
			build: ['dist/<%= pkg.version %>/**/*', 'packages/qoopido.remux.<%= pkg.version %>*']
		},
		concat:{
			options:{
				stripBanners: true,
				banner: '<%= meta.general %>'
			},
			build:{
				src:[
					'assets/vendor/qoopido.js/src/base.js',
					'assets/vendor/qoopido.js/src/emitter.js',
					'src/remux.js'
				],
				dest:'packages/qoopido.remux.<%= pkg.version %>.js'
			}
		},
		uglify:{
			options:{
				preserveComments: 'some'
			},
			build:{
				files: {
					'packages/qoopido.remux.<%= pkg.version %>.min.js': ['packages/qoopido.remux.<%= pkg.version %>.js']
				}
			}
		},
		copy: {
			build: {
				files: [
					{src: ['src/**/*.js'], dest: 'dist/<%= pkg.version %>/'}
				]
			}
		},
		uglifyrecursive: {
			build: {
				files: [
					{ strip: 'src', src: ['src/**/*.js'], dest: 'dist/<%= pkg.version %>/min/'}
				]
			}
		},
		compress:{
			build:{
				options:{
					archive:'packages/qoopido.remux.<%= pkg.version %>.zip',
					mode:'zip',
					level:1,
					pretty:true
				},
				files: [
					{ src: ['packages/qoopido.remux.<%= pkg.version %>*.js', 'assets/remux.less'] }
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-uglifyrecursive');

	grunt.registerTask('default', ['jshint', 'clean', 'concat', 'uglify', 'copy', 'uglifyrecursive', 'compress']);
};