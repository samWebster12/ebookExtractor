const inquirer = require("inquirer");

function inqConsole(allResources) {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Select Ebook to Download",
        name: "bookChoice",
        choices: allResources[0]
          ? allResources.map((resource, index) => {
              return {
                name: `${index + 1}. ${resource.title} | ${resource.title} ${
                  resource.author
                } `,
                value: resource,
              };
            })
          : ["Nothing Found. Presss Ctrl+C to quit."],
      },
    ])
    .then(({ bookChoice }) => {
      if (typeof bookChoice == "string") {
        console.log("here");
        process.exit();
      } else {
        bookChoice.download();
      }
    });
}

module.exports = inqConsole;
