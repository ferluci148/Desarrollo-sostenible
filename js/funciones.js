 
let posicionImagen = 0;
let anterior = null;
let orden = null;
let dataBase = null;
let puntosMapa="";

document.getElementById('files').addEventListener('change', VisualizarVideoSleccionado, false);
document.getElementById('leerBd').addEventListener('click', leerTareaPorIndiceClasificacion, false);

document.getElementById('opcionGaleria').addEventListener('click', galeriaTareasSuperior,false);//VisualizarBD, false);

document.getElementById('opcionBorrar').addEventListener('click',BorrarTareaSeleccionada,false);//VisualizarBD, false);


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
var tabla =null;
function abrirBD() {



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
}


function leerTareaPorIndiceClasificacion()
{   var orden = dataBase.result;
    var transacion = orden.transaction(["galeria"], "readonly");
    var tabla = transacion.objectStore("galeria");
    var index = tabla.index("by_clasificacion");
    index.get(cclasificacion.value).onsuccess = function (evt) {
        var datos = evt.target.result;
       //  alert(datos.clasificacion);
        
/* * **         **  Visualizar los datos de la Tarea  **            ** */
/* ------------------------------------------------------------------- */
    TituloActividad.value=datos.clasificacion;
    tDescripcion.value=datos.descripcion;
    tMedidas.value=datos.medidas;
    tDesarrollo.value=datos.desarrollo;
//                   -------------------------------------
 //Dibujar Imagen de la tarea en el canvas
//                   -------------------------------------
    let ctxImagenTarea=oFoto.getContext("2d"); 
     let imagenLeidaIDB=new Image();
    // alert(datos.imagen)
   //  contenedor.appendChild(imagenLeidaIDB)
    imagenLeidaIDB.src=datos.imagen;
    imagenLeidaIDB.addEventListener("load",(event)=>{       
        ctxImagenTarea.drawImage(imagenLeidaIDB,0,0); 
    });
//                   -------------------------------------
// Puntos DEL MAPA
//                   -------------------------------------
   // visualizarMapaMundi();
   let imagen = new Image();
imagen.src = "Mapa.png"
 
      ctx.drawImage(imagen,0,0,imagen.width,imagen.height,100,0,1024,600);

 
    let puntosM= datos.puntosMapa.split(",");
  //  alert(puntosM.length+puntosM[0])
    for(let i=1; i<puntosM.length;i++)
    {
          let x= puntosM[i];
          i++
          let y= puntosM[i];    
          
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
        console.log(myImage)

        var request = tabla.put({
            "clasificacion": cclasificacion.value,
            "imagen": myImage,
            "descripcion":tDescripcion.value,
            "medidas":tMedidas.value,
            "desarrollo":tDesarrollo.value,
            "puntosMapa":puntosMapa
            
        });
        dataBase.onerror = function (e) {
            // Si se produce un error se ejecuta este método. Ocurre cuando cambiamos de versión
            alert('Error cargandoo la base de datos ' + e.target);
        };
    }
    botonGrabar.disabled = true;
}
function CapturaFoto(){

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
    if(cclasificacion.value=="" ){
        botonGrabar.disabled = true; 
        cclasificacion.style.color="red";
        cclasificacion.value="Da un nombre a la tarea"
    }
    if(TituloActividad.value=="" ){
        botonGrabar.disabled = true; 
        TituloActividad.style.color="red";
        TituloActividad.value="Es obligatorio poner un título-- No olvides crear el resto de los datos y los puntos en el mapa"
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
function visualizarMapaMundi(){
let imagen = new Image();
imagen.src = "Mapa.png"

imagen.addEventListener("load", (event) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#b6f30e";
  //  ctx.drawImage(imagen, 1, 1);

    //lienzo.width=2280;
    //lienzo.height=1524;
      ctx.drawImage(imagen,0,0,imagen.width,imagen.height,100,0,1024,600);

})
 
lienzo.addEventListener("click", (event) => {

    
    // Dibujo a mano alzada
    let x = event.clientX;
    let y = event.clientY;
    if (event.pageX || event.pageY) 
    {
         x = event.pageX; y = event.pageY; 
    }
     else 
     { x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
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

    puntosMapa=puntosMapa+","+x+","+y;
    
}, false)
}
// Visualiza mapa Mundi
visualizarMapaMundi();

//                         Visualizar las Traea en la Galeria Superior
//********************** */
let estadoVistaGS=0;
function galeriaTareasSuperior(){
    claves = new Array();
    posicion = 0;
    let gGaleria=document.getElementById("GaleriaSuperior");
    //gGaleria.innerHTML = "";
   if(estadoVistaGS ==0){
        gGaleria.style.display== "block"
        gGaleria.style.height="auto";
        estadoVistaGS=1;
    }
    else{       
  
        estadoVistaGS=0;
      //  gGaleria.style.height="0px";
      while (gGaleria.getElementsByTagName("img").length > 1) {    
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
            claves.push(cursor.value.id);
            imagenesBD.push(cursor.value.imagen);
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
            cclasificacion.value=this.alt;
            idtareABorrar=imagenleida.title;
            leerTareaPorIndiceClasificacion();
        }, false)
        
    };
}

function BorrarTareaSeleccionada(){
    alert(idtareABorrar)
    var orden = dataBase.result;
    var transacion = orden.transaction(["galeria"], "readwrite");
    var tabla = transacion.objectStore("galeria");
    var request = tabla.delete(parseInt(idtareABorrar));
    request.onsuccess = function () {
        alert("Registro Borrado Indice:" + tabla.keyPath ); 
      }
      
}