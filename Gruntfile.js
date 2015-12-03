module.exports = function(grunt) {



  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);



  grunt.initConfig({



    less: {
      style: {
        options: {
          compress: false,
          yuicompress: false,
          optimization: 2,
          sourceMap: true,
          sourceMapFilename: "build/css/style.css.map",
          sourceMapURL: 'style.css.map',
          sourceMapRootpath: '../../',
        },
        files: {
          'build/css/style.css': ['src/less/style.less']
        },
      }
    },



    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 11'],
        map: true,
      },
      style: {
        src: 'build/css/style.css'
      }
    },



    cmq: {
      style: {
        files: {
          'build/css/style.min.css': ['build/css/style.min.css']
        }
      }
    },



    cssmin: {
      style: {
        options: {
          keepSpecialComments: 0
        },
        files: {
          'build/css/style.min.css': ['build/css/style.css']
        }
      }
    },



    concat: {
      start: {
        src: [
          // 'src/js/plugin.js',
          'src/js/script.js'
        ],
        dest: 'build/js/script.min.js'
      }
    },



    uglify: {
      start: {
        files: {
          'build/js/script.min.js': ['build/js/script.min.js']
        }
      }
    },



    imagemin: {
      build: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ['build/img/*.{png,jpg,gif,svg}']
        }]
      }
    },


    // потребует в package.json:  "grunt-replace": "^0.8.0",
    // replace: {
    //   dist: {
    //     options: {
    //       patterns: [
    //         {
    //           match: /<script src=\"js\/plugins.js/g,
    //           replacement: '<script src="js/plugins.min.js'
    //         },
    //         {
    //           match: /<script src=\"js\/script.js/g,
    //           replacement: '<script src="js/script.min.js'
    //         }
    //       ]
    //     },
    //     files: [
    //       {
    //         expand: true,
    //         src: ['src/*.html']
    //       }
    //     ]
    //   }
    // },



    clean: {
      build: [
        'build/fonts',
        'build/css',
        'build/img',
        'build/js',
        'build/*.html',
      ]
    },



    copy: {
      img: {
        expand: true,
        cwd: 'src/img/',
        src: ['**'],
        dest: 'build/img/',
      },
      css_min: {
        src: ['build/css/style.css'],
        dest: 'build/css/style.min.css',
      },
      fonts: {
        expand: true,
        cwd: 'src/fonts/',
        src: ['*.{eot,svg,woff,woff2,ttf}'],
        dest: 'build/fonts/',
      },
    },



    includereplace: {
      html: {
        src: '*.html',
        dest: 'build/',
        expand: true,
        cwd: 'src/'
      }
    },



    svgstore: {
      options: {
        // formatting : {
        //   indent_size: 2
        // },
        includeTitleElement: false,
      },
      default : {
        files: {
          'src/img/sprite.svg': ['src/img/sprite_svg/*.svg'],
        },
      },
    },



    watch: {
      style: {
        files: ['src/less/**/*.less'],
        tasks: ['style'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      scripts: {
        files: ['src/js/script.js'],
        tasks: ['js'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      images: {
        files: ['src/img/**/*.{png,jpg,gif,svg}'],
        tasks: ['img'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      html: {
        files: ['src/*.html', 'src/_html_inc/*.html'],
        tasks: ['includereplace:html'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      fonts: {
        files: ['src/fonts/*.{eot,svg,woff,woff2,ttf}'],
        tasks: ['copy:fonts'],
        options: {
          spawn: false,
          livereload: true
        },
      },
    },



    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'build/css/*.css',
            'build/js/*.js',
            'build/img/*.{png,jpg,gif,svg}',
            'build/*.html',
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: "build/",
          },
          // startPath: "/index.html",
          ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
          }
        }
      }
    }

  });



  grunt.registerTask('default', [
    'less',                   // компилируем стили в          build/css/style.css
    'autoprefixer',           // обрабатываем автопрефиксером build/css/style.css
    'copy:css_min',           // создаем                      build/css/style.min.css
    'cmq',                    // объединяем медиа-правила в   build/css/style.min.css
    'cssmin',                 // минифицируем                 build/css/style.min.css
    'concat',                 // объединяем все указанные JS-файлы в build/js/script.min.js
    'uglify',                 // минифицируем                        build/js/script.min.js
    'copy:fonts',             // копируем всё из src/fonts/ в build/fonts/
    'svgstore',               // собираем SVG-спрайт
    'copy:img',               // копируем всё из src/img/ в build/img/
    'imagemin',               // минифицируем картинки в build/img/
    'includereplace:html',    // собираем HTML-файлы в build/
    'browserSync',            // запускаем плюшки автообновления
    'watch'                   // запускаем слежение за изменениями файлов
  ]);



  grunt.registerTask('build', [
    'clean:build',            // удаляем build/
    'less',                   // компилируем стили в          build/css/style.css
    'autoprefixer',           // обрабатываем автопрефиксером build/css/style.css
    'copy:css_min',           // создаем                      build/css/style.min.css
    'cmq',                    // объединяем медиа-правила в   build/css/style.min.css
    'cssmin',                 // минифицируем                 build/css/style.min.css
    'concat',                 // объединяем все указанные JS-файлы в build/js/script.min.js
    'uglify',                 // минифицируем                        build/js/script.min.js
    'copy:fonts',             // копируем всё из src/fonts/ в build/fonts/
    'svgstore',               // собираем SVG-спрайт
    'copy:img',               // копируем всё из src/img/ в build/img/
    'imagemin',               // минифицируем картинки в build/img/
    'includereplace:html',    // собираем HTML-файлы в build/
  ]);



  grunt.registerTask('js', [
    'concat',
    'uglify',
  ]);



  grunt.registerTask('style', [
    'less',
    'autoprefixer',
    'cmq',
    'cssmin'
  ]);



  grunt.registerTask('img', [
    'svgstore',
    'copy:img',
    'imagemin',
    'less',
    'autoprefixer',
    'cmq',
    'cssmin'
  ]);

};