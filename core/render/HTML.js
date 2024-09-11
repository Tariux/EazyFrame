import { readFileSync } from 'fs';
import { logThe } from '../../utility/Logger.js';
import { minify } from 'html-minifier';
import { History } from '../../storage/history.js';
import { minifyHtml } from './utility.js';
import Handlebars from "handlebars";

export default class HTML {
  static minify(html) {
    return minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyCSS: true,
      minifyJS: true,
    });
  }
  static async load(filename, minify = false) {
    let filedata,finalResponse
    if (false) { // enable or disable cache here
      // if (History.get(filename)) {
      logThe(filename + ' theme called from cache');
      filedata = History.get(filename).data;
    } else {
      logThe(filename + ' theme called from server');
      filedata = readFileSync('./theme/' + filename + '.html', 'utf8');
      History.add(filename, {
        data: filedata,
      });
    }

    if (minify) {
      finalResponse = minifyHtml(filedata.toString())
    } else {
      finalResponse =  filedata.toString()
    }

    if (finalResponse) {
      return Handlebars.compile(finalResponse)
    } else {
      return ''
    }

  }
}
