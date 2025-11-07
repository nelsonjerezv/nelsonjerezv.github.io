const fs = require('fs');
const path = require('path');

// Carpeta donde están las imágenes
const imagesDir = path.join(__dirname, 'images');

function urlEncodePath(filePath) {
  // Codifica cada parte del path para URL, incluyendo espacios
  return filePath.split(path.sep).map(encodeURIComponent).join('/');
}

function walkDir(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file, baseDir));
    } else {
      results.push(path.relative(baseDir, file));
    }
  });
  return results;
}

// Construye events.json
function buildEventsJson() {
  const allFiles = walkDir(imagesDir);
  const eventsMap = {};

  allFiles.forEach(relativePath => {
    // Ignora cualquier archivo o carpeta que sea '.DS_Store' o archivos que empiecen con '.'
    if (relativePath.includes('.DS_Store') || relativePath.split(path.sep).some(part => part.startsWith('.'))) {
      return;
    }

    const parts = relativePath.split(path.sep);
    const eventName = parts[0]; // Carpeta raíz = evento
    const fileName = parts.slice(1).join('/');

    if (!eventsMap[eventName]) {
      eventsMap[eventName] = {
        name: eventName,
        photos: []
      };
    }

    const url = `https://cdn.jsdelivr.net/gh/tuusuario/tu-repo@main/images/${urlEncodePath(relativePath)}`;

    eventsMap[eventName].photos.push({
      id: fileName,
      name: fileName,
      url: url
    });
  });

  const eventsArray = Object.values(eventsMap);
  // Escribir events.json
  fs.writeFileSync('events.json', JSON.stringify(eventsArray, null, 2));
  console.log('events.json generado con', eventsArray.length, 'eventos.');
}

buildEventsJson();
