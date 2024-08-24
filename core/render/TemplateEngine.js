class TemplateEngine {
    /**
     * Compiles a template string by replacing placeholders with data and handling loops and conditionals.
     * @param {string} template - The template string containing placeholders, loops, and conditionals.
     * @param {Object} data - The data object containing values to replace in the template.
     * @returns {string} - The compiled HTML string with all placeholders replaced.
     */
    static compile(template, data) {
      // foreach handling
      template = template.replace(
        /\{\{\s*foreach\s+(\w+)\s+as\s+(\w+)\s*\}\}(.*?)\{\{\s*endforeach\s*\}\}/gs,
        (match, arrayName, itemName, loopContent) => {
          if (Array.isArray(data[arrayName])) {
            return data[arrayName]
              .map(item => {
                // Replace placeholders within the loop content with the current item data
                return loopContent.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
                  return item[key] !== undefined ? item[key] : match;
                });
              })
              .join('');
          } else {
            return ''; // If the data is not an array, return an empty string
          }
        }
      );
  
      // isObject handling (checks for both objects and arrays)
      template = template.replace(
        /\{\{\s*isObject\s+(\w+)\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
        (match, objectName, objectContent) => {
          return (typeof data[objectName] === 'object' && data[objectName] !== null) ? objectContent : '';
        }
      );
  
      // if-elseif-else handling with comparison operations
      template = template.replace(
        /\{\{\s*if\s+(\w+)\s*([\!\=\<\>\!]+)\s*(\w+)\s*\}\}(.*?)\{\{\s*elseif\s+(\w+)\s*([\!\=\<\>\!]+)\s*(\w+)\s*\}\}(.*?)\{\{\s*else\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
        (match, var1, operator1, var2, ifContent, var3, operator2, var4, elseifContent, elseContent) => {
          return this.evaluateCondition(data[var1], operator1, data[var2]) 
            ? ifContent 
            : (this.evaluateCondition(data[var3], operator2, data[var4]) 
              ? elseifContent 
              : elseContent);
        }
      );
  
      // if-else without elseif, with comparison operations
      template = template.replace(
        /\{\{\s*if\s+(\w+)\s*([\!\=\<\>\!]+)\s*(\w+)\s*\}\}(.*?)\{\{\s*else\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
        (match, var1, operator, var2, ifContent, elseContent) => {
          return this.evaluateCondition(data[var1], operator, data[var2]) 
            ? ifContent 
            : elseContent;
        }
      );
  
      // if-only handling (without else) with comparison operations
      template = template.replace(
        /\{\{\s*if\s+(\w+)\s*([\!\=\<\>\!]+)\s*(\w+)\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
        (match, var1, operator, var2, ifContent) => {
          return this.evaluateCondition(data[var1], operator, data[var2]) 
            ? ifContent 
            : '';
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
    }
  
    /**
     * Helper function to evaluate conditions with comparison operators.
     * @param {any} left - The left operand of the condition.
     * @param {string} operator - The comparison operator (e.g., ===, !==, <, >, <=, >=).
     * @param {any} right - The right operand of the condition.
     * @returns {boolean} - The result of the evaluation.
     */
    static evaluateCondition(left, operator, right) {
      switch (operator) {
        case '===': return left === right;
        case '!==': return left !== right;
        case '<=': return left <= right;
        case '>=': return left >= right;
        case '<': return left < right;
        case '>': return left > right;
        case '!': return !left;
        default: return false;
      }
    }
  
    /**
     * Renders the compiled HTML string into the DOM at the specified selector.
     * @param {string} selector - The CSS selector where the compiled HTML will be rendered.
     * @param {string} compiledHtml - The compiled HTML string to render.
     */
    static renderToDOM(selector, compiledHtml) {
      document.querySelector(selector).innerHTML = compiledHtml;
    }
  }
  
  module.exports = {
    TemplateEngine,
  };
  