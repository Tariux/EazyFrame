function minifyCSS(css_input) {
  // Remove whitespace
  let css = css_input.replace(/\s+/g, '');

  // Remove comments
  css = css.replace(/\/\*.*?\*\//g, '');

  // Remove empty lines
  css = css.replace(/\n\s*\n/g, '\n');

  // Remove leading and trailing whitespace
  css = css.replace(/^\s+|\s+$/g, '');

  return css;
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
  minifyCSS,
  checkUpdated
};
