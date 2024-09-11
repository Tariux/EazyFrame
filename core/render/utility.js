
export function minifyCss(input) {
  input = input.replace(/\/\*[\s\S]*?\*\//g, '');
  input = input.replace(/(^|\s)\/\/[^\n\r]*/g, '');
  input = input.replace(/\s{2,}/g, ' ');
  input = input.replace(/\s*([{}:;,>])\s*/g, '$1');
  input = input.replace(/[\n\r]/g, '');
  input = input.trim();
  input = input.replace(/>\s+</g, '><');
  input = input.replace(/\s*(=|\+|-|\*|\/|%|\||&|!|\?|:|\^|~|<|>|\[\]|\(\)|\{\}|\|\||&&)\s*/g, '$1');
  input = input.replace(/;}/g, '}');
  
  return input;
}

export function minifyJavaScript(input) {
  input = input.replace(/(^|\s)\/\/[^\n\r]*/g, '');
  input = input.replace(/\/\*[\s\S]*?\*\//g, '');
  input = input.replace(/([^\S\r\n])\1+/g, '$1');
  input = input.replace(/;}/g, '');

  return input.trim();
}

export function minifyHtml(input) {
  let minified = input.replace(/<!--[\s\S]*?-->/g, '');
  minified = minified.replace(/\s{2,}/g, ' ');
  minified = minified.replace(/\s*(>|\n|\r)\s*/g, '$1');

  minified = minified.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, (match) => {
      return match.replace(/\s{2,}/g, ' ').replace(/\s*({|}|;|:|,)\s*/g, '$1');
  });

  minified = minified.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, (match) => {
      return match.replace(/\s{2,}/g, ' ').replace(/\s*([{}=;:+\-*/%<>?|&!^~,])\s*/g, '$1');
  });

  minified = minified.trim();

  return minified;
}

export function checkUpdated(newTime, oldTime) {
  const date1 = new Date(newTime);
  const date2 = new Date(oldTime);

  const diff = Math.abs(date2.getTime() - date1.getTime());
  const diffInDays = diff / (1000 * 60 * 60 * 24);

  if (diffInDays > 0) {
    return false;
  } else if (diffInDays === 0) {
    return true;
  } else {
    return false;
  }
}
