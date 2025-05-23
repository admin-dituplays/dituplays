// Main module
import gulp from "gulp";

// Path object
import { path } from "./gulp/config/path.js"
// Plugins
import { plugins } from "./gulp/config/plugins.js"

global.app = {
  isBuild: process.argv.includes('--build',),
  isDev: !process.argv.includes('--build',),
  path: path,
  gulp: gulp,
	plugins: plugins
}

// Tasks import
import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { videos } from "./gulp/tasks/videos.js";
import { zip } from "./gulp/tasks/zip.js";
import { spriteSvg } from "./gulp/tasks/spriteSvg.js";

// Watcher
function watcher() {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.contactInfo, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
  gulp.watch(path.watch.videos, videos);
}

const mainTasks = gulp.parallel(copy, html, scss, js, images, videos);

// Scenarios
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server)) 
const build = gulp.series(reset, mainTasks)
const deployZIP = gulp.series(reset, mainTasks, zip);

// Scenarios Export
export { dev }
export { build }
export { deployZIP }
export { spriteSvg }

// Default tasks scenarios
gulp.task('default', dev);