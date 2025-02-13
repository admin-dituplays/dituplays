import fileInclude from "gulp-file-include";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";
import posthtml from "gulp-posthtml";
import expressions from "posthtml-expressions";
import fs from "fs";

export const html = () => {
  const contactInfo = JSON.parse(fs.readFileSync(app.path.src.contactInfo, 'utf-8'));
  // const productsData = JSON.parse(fs.readFileSync(app.path.src.productsData, 'utf-8'));

  // const templateLocals = {
  //   contact: contactInfo,
  //   products: productsData
  // };

  return app.gulp.src(app.path.src.html)
    .pipe(fileInclude())
    .pipe(app.plugins.replace(/@img\//g, 'img/'))
    .pipe(
      app.plugins.if(
        app.isBuild,
        webpHtmlNosvg()
      )
    )
    .pipe(
      app.plugins.if(
        app.isBuild,
        versionNumber({
          'value': '%DT%',
          'append': {
            'key': '_v',
            'cover': 0,
            'to': [
              'css',
              'js',
            ]
          },
          'output': {
            'file': 'gulp/version.json'
          }
        })
      )
    )
    .pipe(posthtml([
      expressions({ locals: contactInfo })
      // expressions({ locals: templateLocals })
    ]))
    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugins.browsersync.stream());
}