'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	browserSync = require('browser-sync'),
	rigger = require('gulp-rigger'),
	cleanCSS = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	rimraf = require('gulp-rimraf');

// пути к файлам
const path = {
	public: {
		html: 'public/',
		js: 'public/js/',
		css: 'public/css/',
		img: 'public/img/',
		fonts: 'public/fonts/',
		lib: 'public/lib'
	},

	src: {
		html: 'src/*.html',
		js: 'src/js/**/*.js',
		style: 'src/sass/**/*.sass',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},

	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/sass/**/*.sass',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},

	lib: {
		jquery: "./node_modules/jquery/dist/jquery.min.js"
	},
	
	clean: './public/*'
};

// настройка сервера
var config = {
	server: {
		baseDir: './public'
	},
	port: 3050
};

// Запуск сервера
gulp.task('browserSync', function() {
	browserSync(config);
});


// перенос HTML-кода
function buildHtml() {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.public.html))
		.pipe(browserSync.reload({stream: true}));

}

// Компиляция Sass в css
function compileSassToCss() {
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}))
		.pipe(rename({ suffix: '.min' }))
		// .pipe(cleanCSS())
		.pipe(gulp.dest(path.public.css))
		.pipe(browserSync.reload({ stream: true }));

}

//перенос js-кода
function buildJs() {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(path.public.js))
		.pipe(browserSync.reload({ stream: true }));
}

// перенос jquery в public
function buildLib() {
	return gulp.src(path.lib.jquery)
		.pipe(gulp.dest(path.public.lib))
}

// перенос шрифтов
function buildFonts() {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.public.fonts));
}

// обработка картинок
function processImages() {
	return gulp.src(path.src.img)
		.pipe(imagemin())
		.pipe(gulp.dest(path.public.img));
}

// удаление содержимого каталога public
function cleanPublic() {
	return gulp.src(path.clean)
		.pipe(rimraf());
}

// билды
gulp.task('html:build', buildHtml);
gulp.task('js:build', buildJs);
gulp.task('css:build', compileSassToCss);
gulp.task('fonts:build', buildFonts);
gulp.task('image:build', processImages);
gulp.task('lib:build', buildLib);

// Отслеживание изменений
function watchFiles() {
	gulp.watch(path.watch.html, gulp.series('html:build'));
	gulp.watch(path.watch.style, gulp.series('css:build'));
	gulp.watch(path.watch.js, gulp.series('js:build'));
	gulp.watch(path.watch.img, gulp.series('image:build'));
	gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
}

gulp.task('clean:public', cleanPublic)

// билд проекта
gulp.task('build',
	gulp.series('clean:public',
		gulp.parallel(
			'html:build',
			'js:build',
			'css:build',
			'fonts:build',
			'image:build',
			'lib:build'
		)
	)
);

// запуск задач при изменении файлов
gulp.task('watch', watchFiles);

// задача по умолчанию
gulp.task('default', 
	gulp.series(
		'build',
		gulp.parallel('browserSync', 'watch')
	)
);