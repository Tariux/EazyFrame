// class TemplateEngine {
//   static compile(template, data) {
//     let compiledTemplate = template;

//     // foreach handling with $ prefixed variables
//     compiledTemplate = compiledTemplate.replace(
//       /\{\{\s*foreach\s+\$(\w+)\s+as\s+\$(\w+)\s*\}\}(.*?)\{\{\s*endforeach\s*\}\}/gs,
//       (match, arrayName, itemName, loopContent) => {
//         if (Array.isArray(data[`$${arrayName}`])) {
//           return data[`$${arrayName}`]
//             .map(item => {
//               return loopContent.replace(/\{\{\s*\$(\w+)\s*\}\}/g, (match, key) => {
//                 return item[key] !== undefined ? item[key] : match;
//               });
//             })
//             .join('');
//         } else {
//           return ''; // If the data is not an array, return an empty string
//         }
//       }
//     );

//     // isObject handling (checks for both objects and arrays)
//     compiledTemplate = compiledTemplate.replace(
//       /\{\{\s*isObject\s+\$(\w+)\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
//       (match, objectName, objectContent) => {
//         return (typeof data[`$${objectName}`] === 'object' && data[`$${objectName}`] !== null) ? objectContent : '';
//       }
//     );

//     // if-elseif-else handling with comparison operations
//     compiledTemplate = compiledTemplate.replace(
//       /\{\{\s*if\s+\$(\w+)\s*([\!\=\<\>\!]+)\s*\$(\w+)\s*\}\}(.*?)\{\{\s*elseif\s+\$(\w+)\s*([\!\=\<\>\!]+)\s*\$(\w+)\s*\}\}(.*?)\{\{\s*else\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
//       (match, var1, operator1, var2, ifContent, var3, operator2, var4, elseifContent, elseContent) => {
//         return TemplateEngine.evaluateCondition(data[`$${var1}`], operator1, data[`$${var2}`]) 
//           ? ifContent 
//           : (TemplateEngine.evaluateCondition(data[`$${var3}`], operator2, data[`$${var4}`]) 
//             ? elseifContent 
//             : elseContent);
//       }
//     );

//     // if-else without elseif, with comparison operations
//     compiledTemplate = compiledTemplate.replace(
//       /\{\{\s*if\s+\$(\w+)\s*([\!\=\<\>\!]+)\s*\$(\w+)\s*\}\}(.*?)\{\{\s*else\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
//       (match, var1, operator, var2, ifContent, elseContent) => {
//         return TemplateEngine.evaluateCondition(data[`$${var1}`], operator, data[`$${var2}`]) 
//           ? ifContent 
//           : elseContent;
//       }
//     );

//     // if-only handling (without else) with comparison operations
//     compiledTemplate = compiledTemplate.replace(
//       /\{\{\s*if\s+\$(\w+)\s*([\!\=\<\>\!]+)\s*\$(\w+)\s*\}\}(.*?)\{\{\s*endif\s*\}\}/gs,
//       (match, var1, operator, var2, ifContent) => {
//         return TemplateEngine.evaluateCondition(data[`$${var1}`], operator, data[`$${var2}`]) 
//           ? ifContent 
//           : '';
//       }
//     );

//     // count function
//     compiledTemplate = compiledTemplate.replace(
//       /\{\{\s*count\s*\(\$(\w+)\)\s*\}\}/g,
//       (match, arrayName) => {
//         return Array.isArray(data[`$${arrayName}`]) ? data[`$${arrayName}`].length : 0;
//       }
//     );

//     // Regular placeholders (variables)
//     return compiledTemplate.replace(/\{\{\s*\$(\w+)\s*\}\}/g, (match, key) => {
//       return data[`$${key}`] !== undefined ? data[`$${key}`] : match;
//     });
//   }

//   static evaluateCondition(left, operator, right) {
//     switch (operator) {
//       case '===': return left === right;
//       case '!==': return left !== right;
//       case '<=': return left <= right;
//       case '>=': return left >= right;
//       case '<': return left < right;
//       case '>': return left > right;
//       case '!': return !left;
//       default: return false;
//     }
//   }

//   static renderToDOM(selector, compiledHtml) {
//     document.querySelector(selector).innerHTML = compiledHtml;
//   }
// }

// module.exports = {
//   TemplateEngine,
// };
