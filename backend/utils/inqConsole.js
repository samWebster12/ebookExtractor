const inquirer = require('inquirer');
const EbookResource = require('../classes/EbookResource');

function inqConsole(allResources) {
  inquirer
    .prompt([
      {
        type: 'rawlist',
        message: 'Select Ebook to Download',
        name: 'bookChoice',
        choices: allResources[0]
          ? allResources.map((resource, index) => {
              if (resource instanceof EbookResource) {
                return {
                  name: `${resource.title} | ${resource.author} `,
                  value: resource,
                };
              }
            })
          : ['Nothing Found. Presss Ctrl+C to quit.'],
      },
    ])
    .then(({ bookChoice }) => {
      if (typeof bookChoice == 'string') {
        console.log('here');
        process.exit();
      } else {
        bookChoice.download();
      }
    });
}

module.exports = inqConsole;