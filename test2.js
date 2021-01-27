const inquirer = require("inquirer");
const scrapePdfDrive = require("./scrapers/pdfdrive");
const scrapeZLibrary = require("./scrapers/zlibrary");

let pdfName = "";

//Get pdf name from third console argument
if (!process.argv[2] || process.argv[3]) {
  console.log(
    `Please provide a single argument for the pdf you are searching for!
    Wrap your ebook title with double quotation marks if you need to!`
  );
  process.exit();
} else {
  pdfName = process.argv[2];
}

//Scrape pdfdrive for link
(async () => {
  let count = 0;
  const pdfDriveResources = scrapePdfDrive(
    pdfName,
    2,
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
    done
  );
  const zLibraryResources = scrapeZLibrary(
    pdfName,
    2,
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
    done
  );

  function done() {
    if (count < 2) {
      count++;
      return;
    }

    const allResources = [...pdfDriveResources, ...zLibraryResources];
    inquirer
      .prompt([
        {
          type: "list",
          message: "Select Ebook to Download",
          name: "bookChoice",
          choices: allResources[0]
            ? allResources.map((resource, index) => {
                return {
                  name: `${index + 1}. ${resource.info.title} | ${
                    resource.info.title
                  } ${resource.info.author} `,
                  value: resource,
                };
              })
            : ["Nothing Found. Presss Ctrl+C to quit."],
        },
      ])
      .then(({ bookChoice }) => {
        if (typeof bookChoice == "string") {
          process.exit();
        } else {
          bookChoice.download();
        }
      });
  }

  //Keep console running
})();
