// Project folder name
import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./dist`;
const srcFolder = `./src`;

export const path = {
  build: {
    js: `${buildFolder}/js/`,
    css: `${buildFolder}/css/`,
    images: `${buildFolder}/img/`,
    videos: `${buildFolder}/video/`,
    html: `${buildFolder}/`,
    files: `${buildFolder}/`,
  },
  src: {
    js: `${srcFolder}/js/`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
    videos: `${srcFolder}/video/**/*.{webm,mp4}`,
    svg: `${srcFolder}/img/**/*.svg`,
    scss: `${srcFolder}/scss/*.scss`,
    html: [
      `${srcFolder}/**/*.html`,
      `!${srcFolder}/html/**`,
    ],
    files: `${srcFolder}/files/**/*.*`,
    contactInfo: `${srcFolder}/contact-info.json`,
    // productsData: `${srcFolder}/products.json`,
    svgIcons: `${srcFolder}/svgicons/*.svg`
  },
  watch: {
    js: `${srcFolder}/js/**/*.js`,
    scss: `${srcFolder}/scss/**/*.scss`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
    videos: `${srcFolder}/video/**/*.{webm,mp4}`,
    html: `${srcFolder}/**/*.html`,
    files: `${srcFolder}/files/**/*.*`,
    contactInfo: `${srcFolder}/contact-info.json`
    // productsData: `${srcFolder}/products.json`
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  rootFolder: rootFolder,
}
