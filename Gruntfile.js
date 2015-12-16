module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    less: {
      style: {
        options: {
          compress: true,
          yuicompress: false,
          optimization: 2,
        },
        files: {
          'build/css/style.css': ['src/less/style.less']
        },
      }
    },

    postcss: {
      options: {
        processors: [
          require("autoprefixer")({browsers: "last 2 versions"})
        ]
      },
      style: {
        src: "build/css/*.css"
      }
    },

    cmq: {
      style: {
        files: {
          'build/css/style.css': ['build/css/style.css']
        }
      }
    },

    cssmin: {
      style: {
        options: {
          keepSpecialComments: 0
        },
        files: [{
          expand: true,
          cwd: 'build/css',
          src: ['*.css', '!*.min.css'],
          dest: 'build/css',
          ext: '.min.css'
        }]
      }
    },

    concat: {
      start: {
        src: [
          // 'src/js/plugin.js',
          'src/js/script.js'
        ],
        dest: 'build/js/script.js'
      }
    },

    uglify: {
      start: {
        files: {
          'build/js/script.min.js': ['build/js/script.js']
        }
      }
    },

    clean: {
      build: [
        'build/css',
        'build/img',
        'build/js',
        'build/*.html',
        'build/*.ico',
      ]
    },

    copy: {
      img: {
        expand: true,
        cwd: 'src/img/',
        src: ['**/*.{png,jpg,gif,svg}'],
        dest: 'build/img/',
      },
      favicon: {
        expand: true,
        src: ['src/img/favicons/favicon.ico'],
        dest: 'build/',
        flatten: true,
        filter: 'isFile'
      },
      css_add: {
        expand: true,
        cwd: 'src/css/',
        src: ['**'],
        dest: 'build/css/',
      },
      fonts: {
        expand: true,
        cwd: 'src/fonts/',
        src: ['**'],
        dest: 'build/fonts/',
      },
    },

    imagemin: {
      build: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ['build/img/**/*.{png,jpg,gif,svg}']
        }]
      }
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
      livereload: {
        options: { livereload: true },
        files: ['build/**/*'],
      },
      style: {
        files: ['src/less/**/*.less'],
        tasks: ['style'],
        options: {
          spawn: false,
        },
      },
      style_add: {
        files: ['src/css/**/*.css'],
        tasks: ['style'],
        options: {
          spawn: false
        },
      },
      scripts: {
        files: ['src/js/script.js'],
        tasks: ['js'],
        options: {
          spawn: false
        },
      },
      images: {
        files: ['src/img/**/*.{png,jpg,gif,svg}'],
        tasks: ['img'],
        options: {
          spawn: false
        },
      },
      html: {
        files: ['src/*.html', 'src/_html_inc/*.html'],
        tasks: ['includereplace:html'],
        options: {
          spawn: false
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
    // 'copy:fonts',
    'style',
    'js',
    'img',
    'includereplace:html',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:build',
    // 'copy:fonts',
    'style',
    'js',
    'img',
    'includereplace:html',
  ]);

  grunt.registerTask('js', [
    'concat',                 // объединяем все указанные JS-файлы в build/js/script.min.js
    'uglify',                 // минифицируем build/js/script.min.js
  ]);

  grunt.registerTask('style', [
    'copy:css_add',           // копируем добавочные файлы
    'less',                   // компилируем стили в build/css/style.css
    'postcss',                // обрабатываем postcss-ом все файлы .css в build/css/
    'cmq',                    // объединяем медиа-правила в build/css/style.css
    'cssmin',                 // минифицируем
  ]);

  grunt.registerTask('img', [
    'svgstore',               // собираем SVG-спрайт
    'copy:img',               // копируем всё из src/img/ в build/img/
    'copy:favicon',           // копируем favicon
    'imagemin',               // минифицируем картинки в build/img/
  ]);

};
