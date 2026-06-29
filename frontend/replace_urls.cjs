const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist = [...filelist, dirFile];
      else throw err;
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src')).filter(f => f.endsWith('.jsx'));
let changed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace single quotes: 'http://localhost:5000/api...'
  content = content.replace(/'http:\/\/localhost:5000(\/api[^']*)'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
  
  // Replace in template literals: `http://localhost:5000/api...`
  content = content.replace(/`http:\/\/localhost:5000(\/api[^`]*)`/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
    changed++;
  }
});

console.log(`Updated ${changed} files.`);
