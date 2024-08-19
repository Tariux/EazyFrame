const fs = require('fs');

class HTML {
    static async load(filename) {
        const html = fs.readFileSync('./theme/' + filename + '.html', 'utf8');
        return html.toString(); // Return the html as a string
    }
}

module.exports = {
    HTML
}