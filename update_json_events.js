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

    // Estructura esperada: evento/fotografo/archivo
    if (parts.length < 3) {
      // Si no cumple el esquema, se omite
      return;
    }

    const eventName = parts[0];           // Carpeta raíz = evento
    const photographer = parts[1];        // Segundo nivel = fotógrafo
    const fileName = parts.slice(2).join('/'); // Nombre del archivo (por si en el futuro hay subcarpetas)

    if (!eventsMap[eventName]) {
      eventsMap[eventName] = {
        name: eventName,
        photos: []
      };
    }

    const url = `https://cdn.jsdelivr.net/gh/nelsonjerezv/nelsonjerezv.github.io@main/images/${urlEncodePath(relativePath)}`;

    eventsMap[eventName].photos.push({
      id: fileName,
      name: fileName,
      photographer: photographer,
      url: url
    });
  });

  const eventsArray = Object.values(eventsMap);
  // Escribir events.json
  fs.writeFileSync('events.json', JSON.stringify(eventsArray, null, 2));
  console.log('events.json generado con', eventsArray.length, 'eventos.');
}

buildEventsJson();
