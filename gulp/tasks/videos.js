export const videos = () => {
  return app.gulp.src(app.path.src.videos, { dot: true })
    .pipe(app.gulp.dest(app.path.build.videos))
}