var r = 0;
var x = 0;
var TituloL = getColumn("Libros3", "Título");
var IdiomaL = getColumn("Libros3", "Idioma");
var ExtensionL = getColumn("Libros3", "Extensión");
var ColeccionL = getColumn("Libros3", "Colección");
var ImagenesL = getColumn("Libros3", "ImageURL");
var LinkDescargaL = getColumn("Libros3", "link_descarga");
var LinkEpubL = getColumn("Libros3", "link_epub");

var Recomendado = [];
var ImagenesR = [];
var LinksDescargaR = [];
var LinksEpubR = [];
var SavedTitles = [];
var SavedImages = [];
var SavedDescargaLinks = [];
var SavedEpubLinks = [];
var savedIndex = 0;

onEvent("button2", "click", function() {
  // Reiniciar las listas de recomendaciones
  Recomendado = [];
  ImagenesR = [];
  LinksDescargaR = [];
  LinksEpubR = [];
  x = 0;
  r = 0;

  var idiomaSeleccionado = getText("Idioma");
  var extensionSeleccionada = getText("Extension");
  var coleccionSeleccionada = getText("Coleccion");

  for (var i = 0; i < IdiomaL.length; i++) {
    if ((idiomaSeleccionado == "Cualquiera" || idiomaSeleccionado == IdiomaL[i]) &&
        (extensionSeleccionada == "Cualquiera" || extensionSeleccionada == ExtensionL[i]) &&
        (coleccionSeleccionada == "Cualquiera" || coleccionSeleccionada == ColeccionL[i])) {
      insertItem(Recomendado, x, TituloL[i]);
      insertItem(ImagenesR, x, ImagenesL[i]);
      insertItem(LinksDescargaR, x, LinkDescargaL[i]);
      insertItem(LinksEpubR, x, LinkEpubL[i]);
      x = x + 1;
    }
  }

  // Aleatorizar las recomendaciones
  var tempArray = [];
  for (var j = 0; j < Recomendado.length; j++) {
    tempArray.push({
      titulo: Recomendado[j],
      imagen: ImagenesR[j],
      descarga: LinksDescargaR[j],
      epub: LinksEpubR[j]
    });
  }

  tempArray = shuffleArray(tempArray);

  Recomendado = [];
  ImagenesR = [];
  LinksDescargaR = [];
  LinksEpubR = [];

  for (var k = 0; k < tempArray.length; k++) {
    Recomendado.push(tempArray[k].titulo);
    ImagenesR.push(tempArray[k].imagen);
    LinksDescargaR.push(tempArray[k].descarga);
    LinksEpubR.push(tempArray[k].epub);
  }

  setScreen("screen2");
  if (Recomendado.length > 0) {
    setProperty("image1", "image", ImagenesR[r]);
    setProperty("label2", "text", Recomendado[r]);
    setProperty("buttonX", "hidden", false);
    setProperty("buttonLike", "hidden", false);
    setProperty("buttonPrev", "hidden", r <= 0);
  } else {
    setProperty("label2", "text", "Lo siento, no he encontrado ningún libro con tus preferencias.");
    setProperty("image1", "image", "assets/imagen1.jpg");
    setProperty("buttonX", "hidden", true);
    setProperty("buttonLike", "hidden", true);
    setProperty("buttonPrev", "hidden", true);
  }
});

onEvent("buttonX", "click", function() {
  r = r + 1;
  if (r < Recomendado.length) {
    setProperty("image1", "image", ImagenesR[r]);
    setProperty("label2", "text", Recomendado[r]);
    setProperty("buttonPrev", "hidden", false);
  } else {
    setScreen("screen3"); // Mostrar pantalla de "No hay más resultados"
  }
});

onEvent("buttonPrev", "click", function() {
  if (r > 0) {
    r = r - 1;
    setProperty("image1", "image", ImagenesR[r]);
    setProperty("label2", "text", Recomendado[r]);
  }
  setProperty("buttonPrev", "hidden", r <= 0);
});

onEvent("buttonLike", "click", function() {
  insertItem(SavedTitles, SavedTitles.length, Recomendado[r]);
  insertItem(SavedImages, SavedImages.length, ImagenesR[r]);
  insertItem(SavedDescargaLinks, SavedDescargaLinks.length, LinksDescargaR[r]);
  insertItem(SavedEpubLinks, SavedEpubLinks.length, LinksEpubR[r]);
  r = r + 1;
  if (r < Recomendado.length) {
    setProperty("image1", "image", ImagenesR[r]);
    setProperty("label2", "text", Recomendado[r]);
    setProperty("buttonPrev", "hidden", false);
  } else {
    setScreen("screen3"); // Mostrar pantalla de "No hay más resultados"
  }
});

// Evento para el botón que redirige a la pantalla principal desde screen 2
onEvent("buttonBacktoMain", "click", function() {
  setScreen("screen1"); // Reemplaza "screen1" con el ID de tu pantalla principal
});

// Evento para el botón que redirige a la pantalla principal
onEvent("buttonBackToMain", "click", function() {
  setScreen("screen1"); // Reemplaza "screen1" con el ID de tu pantalla principal
});

// Evento para ver la lista de seleccionados guardados
onEvent("buttonViewSaved", "click", function() {
  savedIndex = 0;
  if (SavedTitles.length > 0) {
    updateSavedScreen();
    setScreen("screenSavedList");
  } else {
    setProperty("textAreaSavedList", "text", "No has guardado ningún libro.");
    setScreen("screenSavedList");
  }
});

// Evento para volver a la pantalla principal desde la lista guardada
onEvent("buttonBackToMainFromSaved", "click", function() {
  setScreen("screen1"); // Reemplaza "screen1" con el ID de tu pantalla principal
});

onEvent("buttonViewSavedFromNoMoreResults", "click", function() {
  savedIndex = 0;
  if (SavedTitles.length > 0) {
    updateSavedScreen();
    setScreen("screenSavedList");
  } else {
    setProperty("textAreaSavedList", "text", "No has guardado ningún libro.");
    setScreen("screenSavedList");
  }
});

// function updateSavedScreen: this function stores all the elements the user has previously liked so that they show up
// on a list along with the image and download and epub link
function updateSavedScreen() {
  setProperty("image3", "image", SavedImages[savedIndex]);
  setProperty("textAreaSavedList", "text", SavedTitles[savedIndex]);
  setProperty("buttonDownload", "hidden", false);
  setProperty("buttonEpub", "hidden", false);

  // Deshabilitar botones si no hay más elementos
  setProperty("buttonNextSaved", "hidden", savedIndex >= SavedTitles.length - 1);
  setProperty("buttonPrevSaved", "hidden", savedIndex <= 0);
}

// Evento para el botón de descarga en screenSavedList
onEvent("buttonDownload", "click", function() {
  open(SavedDescargaLinks[savedIndex], "_blank");
});

// Evento para el botón de ver EPUB en screenSavedList
onEvent("buttonEpub", "click", function() {
  open(SavedEpubLinks[savedIndex], "_blank");
});

// Evento para el botón de siguiente en screenSavedList
onEvent("buttonNextSaved", "click", function() {
  if (savedIndex < SavedTitles.length - 1) {
    savedIndex++;
    updateSavedScreen();
  }
});

// Evento para el botón de anterior en screenSavedList
onEvent("buttonPrevSaved", "click", function() {
  if (savedIndex > 0) {
    savedIndex--;
    updateSavedScreen();
  }
});

// Evento para el botón de eliminar en screenSavedList
onEvent("buttonRemoveSaved", "click", function() {
  removeItem(SavedTitles, savedIndex);
  removeItem(SavedImages, savedIndex);
  removeItem(SavedDescargaLinks, savedIndex);
  removeItem(SavedEpubLinks, savedIndex);

  if (savedIndex >= SavedTitles.length) {
    savedIndex--;
  }

  if (SavedTitles.length > 0) {
    updateSavedScreen();
  } else {
    setProperty("textAreaSavedList", "text", "No tienes ningún libro guardado.");
    setProperty("image3", "image", "assets/imagen_vacia2.jpg")
    setProperty("buttonDownload", "hidden", true);
    setProperty("buttonEpub", "hidden", true); 
    setScreen("screenSavedList");
  }
});

// Evento para el botón de vaciar lista de guardados
onEvent("buttonClearList", "click", function() {
  SavedTitles = [];
  SavedImages = [];
  SavedDescargaLinks = [];
  SavedEpubLinks = [];
  setProperty("textAreaSavedList", "text", "No tienes ningún libro guardado.");
  setProperty("image3", "image", "assets/imagen_vacia2.jpg")
  setProperty("buttonDownload", "hidden", true);
  setProperty("buttonEpub", "hidden", true);
  setProperty("buttonNextSaved", "hidden", true)
  setProperty("buttonPrevSaved", "hidden", true)
  setScreen("screenSavedList");
});

//function suffleArray: this function aims to ramdonly order the elements of an array. In this particular case, the function takes the elements
// that meet the criteria the person selected, and randomizes the order which they show up, so that the results aren't ordered always the same way
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

