module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
      },
      dist: {
        files: {
          'lib/build/octicons.css': 'index.scss'
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({ browsers: '> 5%' })
        ]
      },
      build: {
        src: 'lib/build/**/*.*css'
      }
    },

    cssnano: {
      options: {
        sourcemap: true
      },
      dist: {
        files: {
          'lib/build/octicons.min.css': 'lib/build/octicons.css',
          'lib/build/font/octicons.min.css': 'lib/build/font/octicons.css'
        }
      }
    },

    svgmin: {
      dist: {
        options: {
          plugins: [
            {removeTitle: true},
            {removeStyleElement: true},
            {removeAttrs: { attrs: ['id', 'class', 'data-name', 'fill', 'fill-rule'] }},
            {removeEmptyContainers: true},
            {sortAttrs: true},
            {removeUselessDefs: true},
            {removeEmptyText: true},
            {removeEditorsNSData: true},
            {removeEmptyAttrs: true},
            {removeHiddenElems: true}
          ]
        },
        files: [{
          expand: true,
          cwd: 'lib/svg',
          src: ['*.svg'],
          dest: 'lib/build/svg'
        }]
      }
    },

    svg_sprite: {
      octicons: {
        expand: true,
        cwd: 'lib/svg',
        src: ['*.svg'],
        dest: 'lib/build/',
        options: {
          mode: {
            symbol: {
              dest: "",
              sprite: "sprite.octicons.svg"
            }
          }
        }
      }
    },

    webfont: {
      options: {
        font: "octicons",
        fontFamilyName: "Octicons",
        types: 'eot,woff,woff2,ttf,svg',
        fontHeight: 96,
        normalize: false,
        ascent: 84,
        descent: 12,
        htmlDemo: false,
        codepointsFile: 'lib/font/codepoints.json',
        templateOptions: {
          baseClass: 'octicon',
          classPrefix: 'octicon-',
          mixinPrefix: 'octicon-',
          fontFamilyName: "Octicons"
        }
      },
      octicons_css: {
        src: 'lib/svg/*.svg',
        dest: 'lib/build/font',
        options: {
          template: 'lib/font/template.css'
        }
      },
      octicons_scss: {
        src: 'lib/svg/*.svg',
        dest: 'lib/build/font',
        options: {
          stylesheet: 'scss',
          template: 'lib/font/template.scss'
        }
      }
    },

    clean: {
      font: [
        'lib/build/font/*'
      ],
      svg: [
        'lib/build/svg/*',
        'lib/build/sprite.octicons.svg',
        'lib/build/octicons.*'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-svg-sprite');
  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-cssnano');
  grunt.loadNpmTasks('grunt-sass');

  // build tasks
  grunt.registerTask('css',  ['sass', 'postcss', 'cssnano']);
  grunt.registerTask('font', ['clean:font', 'webfont']);
  grunt.registerTask('svg', ['clean:svg', 'svgmin', 'svg_sprite']);

  // default task, build /dist/
  grunt.registerTask('default', [ 'svg', 'font', 'css']);
};
