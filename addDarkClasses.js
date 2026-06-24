const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src/pages'),
  path.join(__dirname, 'src/components')
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // bg-white -> bg-white dark:bg-slate-900
      content = content.replace(/(?<!dark:)bg-white(?!\/)/g, 'bg-white dark:bg-slate-900');
      // bg-white/x -> bg-white/x dark:bg-slate-900/x
      content = content.replace(/(?<!dark:)bg-white\/(\d+)/g, 'bg-white/$1 dark:bg-slate-900/$1');
      // text-slate-800 -> text-slate-800 dark:text-slate-100
      content = content.replace(/(?<!dark:)text-slate-800/g, 'text-slate-800 dark:text-slate-100');
      // text-black -> text-black dark:text-white
      content = content.replace(/(?<!dark:)text-black/g, 'text-black dark:text-white');
      // border-white -> border-white dark:border-slate-800
      content = content.replace(/(?<!dark:)border-white(?![\/\w])/g, 'border-white dark:border-slate-800');
      
      fs.writeFileSync(fullPath, content);
      console.log(`Processed ${fullPath}`);
    }
  });
}

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
});
