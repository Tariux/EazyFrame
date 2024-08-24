const TemplateEngine = {
  /**
   * Compiles a template string by replacing placeholders with data and handling loops and conditionals.
   * @param {string} template - The template string containing placeholders, loops, and conditionals.
   * @param {Object} data - The data object containing values to replace in the template.
   * @returns {string} - The compiled HTML string with all placeholders replaced.
   */
  compile(template, data) {
    // Switch-case handling
    template = template.replace(
      /\{\{\s*switch\s+(\w+)\s*\}\}(.*?)\{\{\s*case\s+(\w+)\s*\}\}(.*?)\{\{\s*endswitch\s*\}\}/gs,
      (match, variable, content, caseValue, caseContent) => {
        return data[variable] === caseValue ? caseContent : '';
      }
    );

    // if-elseif-else handling
    template = template.replace(
      /\{\{\s*if\s+(\w+)\s*\}\}(.*?)\{\{\s*elseif\s+(\w+)\s*\}\}(.*?)\{\{\s*else\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
      (
        match,
        condition1,
        ifContent,
        condition2,
        elseifContent,
        elseContent
      ) => {
        return data[condition1]
          ? ifContent
          : data[condition2]
          ? elseifContent
          : elseContent;
      }
    );

    // if-else without elseif
    template = template.replace(
      /\{\{\s*if\s+(\w+)\s*\}\}(.*?)\{\{\s*else\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
      (match, condition, ifContent, elseContent) => {
        return data[condition] ? ifContent : elseContent;
      }
    );

    // if-only handling (without else)
    template = template.replace(
      /\{\{\s*if\s+(\w+)\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
      (match, condition, ifContent) => {
        return data[condition] ? ifContent : '';
      }
    );

    // isTrue and isFalse handling
    template = template.replace(
      /\{\{\s*if\s+isTrue\((\w+)\)\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
      (match, variable, ifContent) => {
        return data[variable] === true ? ifContent : '';
      }
    );

    template = template.replace(
      /\{\{\s*if\s+isFalse\((\w+)\)\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
      (match, variable, ifContent) => {
        return data[variable] === false ? ifContent : '';
      }
    );

    // isEmpty handling
    template = template.replace(
      /\{\{\s*if\s+isEmpty\((\w+)\)\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
      (match, variable, ifContent) => {
        return !data[variable] || data[variable].length === 0 ? ifContent : '';
      }
    );

    // isObject handling
    template = template.replace(
      /\{\{\s*if\s+isObject\((\w+)\)\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
      (match, variable, ifContent) => {
        return typeof data[variable] === 'object' &&
          !Array.isArray(data[variable])
          ? ifContent
          : '';
      }
    );

    // foreach loop handling
    template = template.replace(
      /\{\{\s*foreach\s+(\w+)\s*\}\}(.*?)\{\{\s*endfor\s*\}\}/gs,
      (match, arrayName, loopContent) => {
        let result = '';
        if (Array.isArray(data[arrayName])) {
          data[arrayName].forEach((item) => {
            let currentContent = loopContent;
            currentContent = currentContent.replace(
              /\{\{\s*(\w+)\s*\}\}/g,
              (match, key) => (item[key] !== undefined ? item[key] : match)
            );
            result += currentContent;
          });
        }
        return result;
      }
    );

    // count function
    template = template.replace(
      /\{\{\s*count\s*\((\w+)\)\s*\}\}/g,
      (match, arrayName) => {
        return Array.isArray(data[arrayName]) ? data[arrayName].length : 0;
      }
    );

    // Regular placeholders (variables)
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  },

  /**
   * Renders the compiled HTML string into the DOM at the specified selector.
   * @param {string} selector - The CSS selector where the compiled HTML will be rendered.
   * @param {string} compiledHtml - The compiled HTML string to render.
   */
  renderToDOM(selector, compiledHtml) {
    document.querySelector(selector).innerHTML = compiledHtml;
  },
};

module.exports = {
  TemplateEngine,
};
