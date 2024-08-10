const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const path = require('path');
const ignore = require('gulp-ignore');

// Get the current working directory
const cwd = process.cwd();

// Define the source directory relative to the current working directory
const srcDir = path.join(cwd, 'TypeScriptTesting/wwwroot/js');
console.log(srcDir);

// Define the task to minify JavaScript files
gulp.task('minify-js', function() {
    return gulp.src(path.join(srcDir, '**/*.js'))
        .pipe(ignore.exclude('**/*.js.map')) // Exclude .js.map files
        .pipe(ignore.exclude('**/*.min.js')) // Exclude .Min.js files
        .pipe(uglify())                     // Minify the JS files
        .pipe(rename(function (file) {
            file.basename += '.min';        // Append .min to the basename
            file.extname = '.js';           // Ensure the extension is .js
        }))
        .pipe(gulp.dest(srcDir));           // Save the minified files in the original directory
});

// Default task that runs when you run `gulp`
gulp.task('default', gulp.series('minify-js'));
