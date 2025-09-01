const fs = require('fs');
const path = require('path');

function createModule(moduleName, targetPath, folderStructure) {
  if (!moduleName || !targetPath) {
    console.error('Please provide both the module name and target path.');
    process.exit(1);
  }

  const modulePath = path.join(targetPath, moduleName);
  const helperContent = `const mainHelper = require("../../../utils/helper");
  
            module.exports = {
            ...mainHelper,
            };`;
  const messagesContent = `const mainMessages = require("../../../utils/messages");
  
            module.exports = {
            ...mainMessages,
            };`;
  const staticDataContent = `const mainData = require("../../../utils/staticData");
  
            module.exports = {
            ...mainData,
            };`;

  try {
    // Create the base module directory
    if (!fs.existsSync(modulePath)) {
      fs.mkdirSync(modulePath, { recursive: true });
    }

    // Loop through the folder structure to create folders and files dynamically
    Object.entries(folderStructure).forEach(([folder, files]) => {
      const folderPath = path.join(modulePath, folder);

      // Create the folder if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      // Create each file in the folder, dynamically naming it based on the moduleName
      files.length > 0 &&
        files.forEach((fileTemplate) => {
          let fileName = fileTemplate;
          if (fileName.includes('moduleName')) {
            fileName = fileTemplate.replace('{moduleName}', moduleName);
          }

          const filePath = path.join(folderPath, fileName);

          if (!fs.existsSync(filePath)) {
            if (folder == 'utils' && fileName == 'helper.js') {
              fs.writeFileSync(filePath, `${helperContent}`);
            } else if (folder == 'utils' && fileName == 'messages.js') {
              fs.writeFileSync(filePath, `${messagesContent}`);
            } else if (folder == 'utils' && fileName == 'staticData.js') {
              fs.writeFileSync(filePath, `${staticDataContent}`);
            } else {
              fs.writeFileSync(filePath, `// Content for ${fileName}`);
            }
          }
        });
    });

    console.log(
      `Module '${moduleName}' created successfully at '${targetPath}'.`
    );
  } catch (error) {
    console.error('Error creating module:', error);
  }
}

// Define the folder structure with dynamic filenames
const folderStructure = {
  controllers: ['{moduleName}.js'],
  manager: ['{moduleName}.js'],
  middlewares: [],
  migrations: [],
  models: [],
  routes: ['{moduleName}.js', 'index.js', 'fields.js'],
  seeders: [],
  services: ['{moduleName}.js'],
  utils: ['helper.js', 'messages.js', 'staticData.js'],
  validations: ['{moduleName}.js'],
};

// Get arguments from the command line
const args = process.argv.slice(2);
const [moduleName, targetPath] = args;

// Execute the function
createModule(moduleName, targetPath, folderStructure);
