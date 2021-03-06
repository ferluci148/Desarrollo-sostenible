
let posicionImagen = 0;
let anterior = null;
let orden = null;
let dataBase = null;
let puntosMapa = "";

document.getElementById('files').addEventListener('change', VisualizarVideoSleccionado, false);
document.getElementById('leerBd').addEventListener('click', leerTareaPorIndiceClasificacion, false);

document.getElementById('opcionGaleria').addEventListener('click', galeriaTareasSuperior, false);//VisualizarBD, false);

document.getElementById('opcionBorrar').addEventListener('click', BorrarTareaSeleccionada, false);//VisualizarBD, false);

// Copia la tarea seleccionada en la select na Nombre de la Tarea, pñara seleccionarla 
// por Galeria o por leer
tareasCreadas.addEventListener("change", ()=>{
    cclasificacion.value= tareasCreadas.options[tareasCreadas.selectedIndex].text
    idImagenSeleccionadaEnGaleria= tareasCreadas.options[tareasCreadas.selectedIndex].value;
 
}, false);

window.URL = window.URL || window.webkitURL;
dataBase = null;
var porFoto = document.querySelector("#botonFoto");
porFoto.onclick = CapturaFoto;
var video = document.getElementById("Video1");
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia ||
    function () {
        alert('Su navegador no soporta navigator.getUserMedia().');
    };

var grabarFoto = document.querySelector("#botonGrabar");
grabarFoto.onclick = GrabaTarea;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var tabla = null;
function abrirBD() {


   let yaCreada=false;
    var cajaGrabar = document.querySelector("#cajaGrabar");
    cajaGrabar.style.display = "block";

    indexedDB.deleteDatabase("contactos", 1);
    dataBase = indexedDB.open("galeria", 1);

    dataBase.onupgradeneeded = function (e) {
        orden = dataBase.result;
        // onden es un objeto que nos permite ejecutar acciones contra la base de datos creada, como crear un tabla
        var tabla = orden.createObjectStore("galeria", { keyPath: 'id', autoIncrement: true });
        tabla.createIndex('by_clasificacion', 'clasificacion', { unique: false });
    }


    dataBase.onsuccess = function (e) {       
      // Rellenar select tareas ya existentes
      orden = dataBase.result;
      var transacion = orden.transaction(["galeria"], "readonly");
      var tabla = transacion.objectStore("galeria");
      request = tabla.openCursor(null, 'next');
       
      
      request.onerror = function (event) {
          alert("Error lectura secuencial de la tabla libro ");
      };
      request.onsuccess = function (event) {
          cursor = event.target.result;          
          if (cursor) {    
             yaCreada=chequearTareaEnSelect(cursor.value.clasificacion);
             
             if(yaCreada==false){
              tareasCreadas.innerHTML= tareasCreadas.innerHTML+"<option value='"+cursor.value.id+"'>"+cursor.value.clasificacion+"</option>"
             }
             yaCreada=false
              cursor.continue();
          } 
       

        }
       
    };
    dataBase.onerror = function (e) {
        // Si se produce un error se ejecuta este método. Ocurre cuando cambiamos de versión
        alert('Error cargandoo la base de datos ' + e.target);
    };
}

// Comprueba que la tarea no este ya en la select que visualiza un
//option por cada tarea ya creada
function chequearTareaEnSelect(nombreTarea)
{ 
    let existe=false;
    for(let i=0;i< tareasCreadas.options.length;i++){
     if(tareasCreadas.options[i].text == nombreTarea)
        {  existe=true;
            break
        }
    }
    return existe;
    
}

function leerTareaPorIndiceClasificacion() {
    var orden = dataBase.result;
    var transacion = orden.transaction(["galeria"], "readonly");
    var tabla = transacion.objectStore("galeria");
   // var index = tabla.index("by_clasificacion");
     //var request = tabla.get(claves[idImagenSeleccionadaEnGaleria]);
        //index.get(cclasificacion.value).onsuccess = function (evt) {
    //alert(idImagenSeleccionadaEnGaleria)
    var request = tabla.get(parseInt(idImagenSeleccionadaEnGaleria));
    //var request = tabla.get(claves[idImagenSeleccionadaEnGaleria]);
    request.onsuccess = function (evt) {
    //index.get(cclasificacion.value).onsuccess = function (evt) {
        var datos = evt.target.result;
        //  alert(datos.clasificacion);

        /* * **         **  Visualizar los datos de la Tarea  **            ** */
        /* ------------------------------------------------------------------- */
        TituloActividad.value = datos.clasificacion;
        pregunta1.value=datos.pregunta1;
        tDescripcion.value = datos.descripcion;
        pregunta2.value=datos.pregunta2;
        tMedidas.value = datos.medidas;
        pregunta3.value=datos.pregunta3;
        tDesarrollo.value = datos.desarrollo;
        //                   -------------------------------------
        //Dibujar Imagen de la tarea en el canvas
        //                   -------------------------------------
        let ctxImagenTarea = oFoto.getContext("2d");
        let imagenLeidaIDB = new Image();
       console.log(datos.imagen)
        //  contenedor.appendChild(imagenLeidaIDB)
        imagenLeidaIDB.src = datos.imagen;
        imagenLeidaIDB.addEventListener("load", (event) => {
            ctxImagenTarea.drawImage(imagenLeidaIDB, 0, 0,300,150);
        });
        //                   -------------------------------------
        // Puntos DEL MAPA
        //                   -------------------------------------
        // visualizarMapaMundi();
        let imagen = new Image();
        imagen.src = "Mapa.png"

        let ancho = screen.width - 220;
        let alto = (ancho / 2) + 100;
        ctx.drawImage(imagen, 0, 0, imagen.width, imagen.height, 80, 0, ancho, alto);


        //    ctx.drawImage(imagen,0,0,imagen.width,imagen.height,100,0,1024,600);


        let puntosM = datos.puntosMapa.split(",");
        //  alert(puntosM.length+puntosM[0])
        for (let i = 1; i < puntosM.length; i++) {
            let x = puntosM[i];
            i++
            let y = puntosM[i];

            ctx.strokeStyle = "red";
            ctx.lineWidth = 15;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, (Math.PI / 180) * 360, true);
            ctx.stroke();
            ctx.closePath();
        }
        /* * **         **  Visualizar los datos de la Tarea  **            **/

    }
    index.get(cclasificacion.value).onerror = function (event) {
        alert(" error");
    };
}

let oFoto = document.querySelector('#foto');
function GrabaTarea() {
    // Abrir base de datos
    //  dataBaseC = indexedDB.deleteDatabase("imagenes", 1);
    dataBase = indexedDB.open("galeria", 1);
    dataBase.onsuccess = function (e) {

        var orden = dataBase.result;
        var transacion = orden.transaction(["galeria"], "readwrite");
        var tabla = transacion.objectStore("galeria");
        ////////////////////////////////


        var myImage = oFoto.toDataURL("image/png");
        //  console.log(myImage)

        var request = tabla.put({
            "clasificacion": cclasificacion.value,
            "imagen": myImage,
            "pregunta1":pregunta1.value,
            "descripcion": tDescripcion.value,
            "pregunta2":pregunta2.value,
            "medidas": tMedidas.value,
            "pregunta3":pregunta3.value,
            "desarrollo": tDesarrollo.value,
            "puntosMapa": puntosMapa

        });
        dataBase.onerror = function (e) {
            // Si se produce un error se ejecuta este método. Ocurre cuando cambiamos de versión
            alert('Error cargandoo la base de datos ' + e.target);
        };
        visualizarMapaMundi() ;
        puntosMapa="";
    }
    botonGrabar.disabled = true;


}

function CapturaFoto() {

    oFoto = document.querySelector('#foto');
    // Definen la resolución de la fotofrafia capturada.La Calidad de la imagen
    w = 600; //oCamara.width();
    h = 400; //oCamara.height();
    oFoto.width = w;
    oFoto.height = h;
    /* oFoto.attr({
     'width': w,
     'height': h
     });*/

    //  oContexto = oFoto[0].getContext('2d');
    oContexto = oFoto.getContext('2d');
    oContexto.drawImage(video, 0, 0, w, h);
    //   alert(cclasificacion.value)
    botonGrabar.disabled = false;
    if (cclasificacion.value == "") {
        botonGrabar.disabled = true;
        cclasificacion.style.color = "red";
        cclasificacion.value = "Da un nombre a la tarea"
    }
    if (TituloActividad.value == "") {
        botonGrabar.disabled = true;
        TituloActividad.style.color = "red";
        TituloActividad.value = "Es obligatorio poner un título-- No olvides crear el resto de los datos y los puntos en el mapa"
    }

}
////////////////////////////
function VisualizarVideoSleccionado(evt) {
    document.querySelector("#cajaGrabar").style.visibility = "visible"
    var cajaGrabar = document.querySelector("#cajaGrabar");
    cajaGrabar.style.display = "block";

    var files = evt.target.files; // Se crea el array files con los ficheros seleccioandos

    f = files[0]; // Solo no interesa el primero. Sera un fichero .xml con los datos de la biblioteca
    reader = new FileReader(); // El objeto reader leera el archivo cuando ocurra el evento onload

    VideoReproduciendose.value = f.name;
    var ElElFichero = f.name;
    reader.onload = (function (ElFichero) {
        return function (e) {
            try {

                video.src = e.target.result;
                video.currentTime = 0;
                video.load();
                video.play();
            }
            catch (err) {
                //  alert("Error : " + err);
            }

        };
    })(f);
    reader.readAsDataURL(f);
}

var reader = null;
// dataBase = indexedDB.open("imagenesVideo", 1);
var claves = new Array();
var imagenesBD = new Array();
var posicion = 0;
var posicionActual = 0;
abrirBD();
//  setTimeout("visualizaRueda()", 100);


/********************      MAPA DEL LEINZO CANVAS********************* */
let lienzo = document.getElementById("lienzo");
let ctx = lienzo.getContext("2d");

function visualizarMapaMundi() {
    let imagen = new Image();
    imagen.src = "Mapa.png"

    imagen.addEventListener("load", (event) => {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#b6f30e";
        //  ctx.drawImage(imagen, 1, 1);



        let ancho = screen.width - 220;
        let alto = (ancho / 2) + 100;


        ctx.drawImage(imagen, 0, 0, imagen.width, imagen.height, 80, 0, ancho, alto);

    })

    lienzo.addEventListener("click", (event) => {
 
        // Dibujo a mano alzada
        let x = event.clientX;
        let y = event.clientY;
        if (event.pageX || event.pageY) {
            x = event.pageX; y = event.pageY;
        }
        else {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= lienzo.offsetLeft;
        y -= lienzo.offsetTop;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 15;
        ctx.beginPath();
        //ctx.arc(x,y,25,Math.PI*3/2,Math.PI/2,true);
        //x=x-80;
        // y=y-521;

        ctx.arc(x, y, 5, 0, (Math.PI / 180) * 360, true);
        ctx.stroke();
        ctx.closePath();

        puntosMapa = puntosMapa + "," + x + "," + y;

    }, false)
}
// Visualiza mapa Mundi
visualizarMapaMundi();

//                         Visualizar las Traea en la Galeria Superior
//********************** */
let estadoVistaGS = 0;
function galeriaTareasSuperior() {
    claves = new Array();
    posicion = 0;
    let gGaleria = document.getElementById("GaleriaSuperior");
    //gGaleria.innerHTML = "";
    if (estadoVistaGS == 0) {
        gGaleria.style.display == "block"
        gGaleria.style.height = "auto";
        estadoVistaGS = 1;
    }
    else {

        estadoVistaGS = 0;
        //  gGaleria.style.height="0px";
        while (gGaleria.getElementsByTagName("img").length > 0) {
            gGaleria.removeChild(gGaleria.lastChild);
            gGaleria.innerHTML = "";
            return
        }



    }

    orden = dataBase.result;
    var transacion = orden.transaction(["galeria"], "readonly");
    var tabla = transacion.objectStore("galeria");
    request = tabla.openCursor(null, 'next');
     
    
    request.onerror = function (event) {
        alert("Error lectura secuencial de la tabla libro ");
    };
    request.onsuccess = function (event) {

        cursor = event.target.result;
  
        if (cursor) {
       //     alert(cursor.value.clasificacion)
            if(cursor.value.clasificacion ==cclasificacion.value)
            {
                claves.push(cursor.value.id);
                imagenesBD.push(cursor.value.imagen);
             }
            cursor.continue();
        }
        else {

            for (i = posicion; i < posicion + 12; i++) {
                pantallazoSuperor(i);
                posicionActual = i;
            }
            //   id = window.setInterval("visualizaRueda()", 1000);
        }



    };
}
let idtareABorrar;
let idImagenSeleccionadaEnGaleria;
let imagenBorraDeGaleria;
function pantallazoSuperor(posicionclaves) {
    //  alert(posicionclaves)
    var cajaImagenes = document.querySelector("#GaleriaSuperior");
    /*cajaImagenes.style.height = "50px"
    cajaImagenes.style.padding = "50px"*/
    var orden = dataBase.result;
    var transacion = orden.transaction(["galeria"], "readonly");
    var tabla = transacion.objectStore("galeria");
    var request = tabla.get(claves[posicionclaves]);
    request.onerror = function (event) {
        alert("Error lectura secuencial de la tabla libro ");
    };
    request.onsuccess = function (event) {


        var registro = request.result;

        var imagenleida = document.createElement("img");
        imagenleida.src = registro.imagen;
        imagenleida.alt = registro.clasificacion;
        imagenleida.title = registro.id;
        imagenleida.style.width = "50px";
        imagenleida.style.height = "50px"
        cajaImagenes.appendChild(imagenleida);
        imagenleida.addEventListener("click", function () {
            cclasificacion.value = this.alt;
            idtareABorrar = imagenleida.title;
            idImagenSeleccionadaEnGaleria= imagenleida.title;
            imagenBorraDeGaleria = imagenleida;
            leerTareaPorIndiceClasificacion();
        }, false)

    };
}
function BorrarTareaSeleccionada() {

    var orden = dataBase.result;
    var transacion = orden.transaction(["galeria"], "readwrite");
    var tabla = transacion.objectStore("galeria");
    var request = tabla.delete(parseInt(idtareABorrar));
    request.onsuccess = function () {
        //   alert("Registro Borrado Indice:" + tabla.keyPath ); 
    }

    // Borra la imagen de la galeria superior
    GaleriaSuperior.removeChild(imagenBorraDeGaleria)
}

// Limpiar error rojo
document.getElementById("cclasificacion").addEventListener("focus", BorraCajas, false)
document.getElementById("TituloActividad").addEventListener("focus", BorraCajas, false)

function BorraCajas() {
    if (cclasificacion.value === "Da un nombre a la tarea" ||
        TituloActividad === "Es obligatorio poner un título-- No olvides crear el resto de los datos y los puntos en el mapa"
    ) {
        cclasificacion.style.color = "black";
        TituloActividad.style.color = "black";
        TituloActividad.value = "";
        cclasificacion.value = "";
        //     document.getElementById("cclasificacion").removeEventListener("focus",BorraCajas,true);
    }
}