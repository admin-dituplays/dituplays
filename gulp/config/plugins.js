import replace from "gulp-replace"; // Search and replace
import browsersync from "browser-sync"; // Local Server
import newer from "gulp-newer"; // Images update checker
import ifPlugin from "gulp-if";

export const plugins = {
  replace: replace,
  browsersync: browsersync,
  newer: newer,
  if: ifPlugin,
} 