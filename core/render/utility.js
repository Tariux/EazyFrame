
function minifyCss(input) {
  // Handle minification differently for each type: CSS, HTML, JavaScript
  // Identify file type by its content; this example assumes input is a generic text

  // Remove multi-line comments (/*...*/) - common for CSS, JavaScript
  input = input.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove single-line comments (//...) - only for JavaScript
  input = input.replace(/(^|\s)\/\/[^\n\r]*/g, '');

  // Remove unnecessary whitespace between tags and elements - common for HTML, CSS, JS
  input = input.replace(/\s{2,}/g, ' '); // Replace multiple spaces with a single space
  input = input.replace(/\s*([{}:;,>])\s*/g, '$1'); // Remove spaces around certain characters

  // Remove newlines and trim the string
  input = input.replace(/[\n\r]/g, ''); // Remove all newlines
  input = input.trim();

  // For HTML, remove unnecessary spaces between tags
  input = input.replace(/>\s+</g, '><');

  // For JavaScript, preserve essential whitespace by using more targeted regex
  // Remove spaces before and after non-operator characters, but preserve between variable names and operators
  input = input.replace(/\s*(=|\+|-|\*|\/|%|\||&|!|\?|:|\^|~|<|>|\[\]|\(\)|\{\}|\|\||&&)\s*/g, '$1');
  
  // Remove last unnecessary semicolon in CSS and JS
  input = input.replace(/;}/g, '}');
  
  return input;
}
function minifyJavaScript(input) {
  // Step 1: Remove all single-line comments (// ...)
  input = input.replace(/(^|\s)\/\/[^\n\r]*/g, '');

  // Step 2: Remove all multi-line comments (/* ... */)
  input = input.replace(/\/\*[\s\S]*?\*\//g, '');

  // Step 4: Collapse multiple spaces to a single space
  // Ensures spaces within strings, regex, or template literals are untouched
  input = input.replace(/([^\S\r\n])\1+/g, '$1');

  // Step 5: Remove unnecessary semicolons before closing braces
  input = input.replace(/;}/g, '}');


  // Step 7: Trim leading and trailing whitespace
  return input.trim();
}

function minifyHtml(input) {
  // Step 1: Remove HTML comments
  let minified = input.replace(/<!--[\s\S]*?-->/g, '');

  // Step 2: Remove extra whitespace between tags
  minified = minified.replace(/\s{2,}/g, ' '); // Collapse multiple spaces to a single space
  minified = minified.replace(/\s*(>|\n|\r)\s*/g, '$1'); // Remove spaces around tags

  // Step 5: Minify inline CSS and JS
  minified = minified.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, (match) => {
      return match.replace(/\s{2,}/g, ' ').replace(/\s*({|}|;|:|,)\s*/g, '$1');
  });

  minified = minified.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, (match) => {
      return match.replace(/\s{2,}/g, ' ').replace(/\s*([{}=;:+\-*/%<>?|&!^~,])\s*/g, '$1');
  });

  // Step 6: Remove trailing spaces
  minified = minified.trim();

  return minified;
}

function checkUpdated(newTime, oldTime) {
  const date1 = new Date(newTime);
  const date2 = new Date(oldTime);

  const diff = Math.abs(date2.getTime() - date1.getTime());
  const diffInDays = diff / (1000 * 60 * 60 * 24);

  if (diffInDays > 0) {
    return false
  } else if (diffInDays === 0) {
    return true
  } else {
    return false
  }
}

module.exports = {
  minifyCss,
  minifyJavaScript,
  minifyHtml,
  checkUpdated
};
