const gulp = require('gulp');
const gulpts = require('gulp-typescript');
const browersync = require('browser-sync');
const through = require('through2');
const path = require('path');
const fs = require('fs');
const util = require('util');

gulp.task("build",()=>{
    BuildScript();
    BuildTemplate();
    BuildShader();
});

gulp.task("watch",()=>{

    BuildScript();
    BuildTemplate();
    BuildShader();

    gulp.watch('./src/script/**/*.ts',BuildScript);
    gulp.watch('./src/template/**.*',BuildTemplate);
    gulp.watch('./src/shader/*.glsl',BuildShader);

    browersync.init({
        server: {
            baseDir: './dist/'
        },
        port: 6633,
        files: ['./dist/*.js', './dist/*.html']
    })
});

function BuildScript(){
    console.log('[sync script]');
    gulp.src('./src/script/**/*.ts').pipe(gulpts({
        module: 'amd',
        declaration: true,
        outFile: 'stablefluids.js',
        target: 'es5',
    }))
    .pipe(gulp.dest('./dist/'));
}

function BuildTemplate(){
    console.log('[sync template]');
    gulp.src('./src/template/**.*').pipe(gulp.dest('./dist'));
}

function BuildShader(){
    console.log('[sync shader]');
    gulp.src('./src/shader/*.glsl').pipe(gulpGLSLMerge('/src/script/ShaderLibs.ts'));
}


function gulpGLSLMerge(targetFile) {
    var tarFile = targetFile;
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }
        if (file.isBuffer()) {
            var fname = path.basename(file.path);
            let contents = file.contents;
            let tspath = path.join(process.cwd(), targetFile);
            let tscontent = fs.readFileSync(tspath, { encoding: 'utf8' });
            tscontent = MergeShaderLibTs(fname, contents.toString(), tscontent);
            fs.writeFileSync(tspath, tscontent, { encoding: 'utf8' });
            cb(null, file);
            return;
        }
        if (file.isStream()) {
            console.log("stream: skip");
            cb(null, file);
            return;
        }
    });
}

function MergeShaderLibTs(fname, source, ts) {
    fname = fname.toString();
    if (fname.endsWith('.glsl')) fname = fname.substr(0, fname.length - 5);
    fname = 'GLSL_' + fname.toUpperCase();
    let srcSplit = source.split('\n');

    for (var i = 0; i < srcSplit.length; i++) {
        srcSplit[i] = srcSplit[i].trim();
    }

    let mergetdGlsl = srcSplit.join('\\n');
    mergetdGlsl = '\'' + mergetdGlsl + '\';';

    let tsSplit = ts.split('\n');
    let shLines = {};
    tsSplit.forEach(line => {
        if (line.includes('export const')) {
            let match = line.match(/export const\s+([\w\d_]+)\s*=(.+)/);
            if (match) {
                shLines[match[1]] = match[2];
            }
        }
    });
    shLines[fname] = mergetdGlsl;

    let result = '';// 'namespace cis {\n';
    for (var sh in shLines) {
        result += util.format('export const %s = %s \n', sh, shLines[sh]);
    }
    //result+='}';
    return result;
}