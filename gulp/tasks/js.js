import webpack from "webpack-stream";
import path from 'path';
import fs from 'fs';

const getEntries = () => {
  const entries = {};
  fs.readdirSync(app.path.src.js).forEach(file => {
    if (file.endsWith('.js')) {
      const name = path.basename(file, path.extname(file));
      entries[name] = path.resolve(app.path.src.js, file);
    }
  });
  return entries;
};

export const js = () => {
  return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev })
    .pipe(webpack({
      mode: app.isBuild ? 'production': 'development',
      entry: getEntries(),
      output: {
        filename: '[name].min.js',
      }
    }))
    .pipe(app.gulp.dest(app.path.build.js))
    .pipe(app.plugins.browsersync.stream());
}