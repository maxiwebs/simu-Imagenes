colores_principales_en = ['white','black','red','green','blue','yellow','orange','purple'];

diccionario_codificacion = {};

dump_memoria = [];
dump_memoria_index = 0;
imagen_usuario = [];

var tamanio_palabra = 0;
var cantidad_palabras = 100; //Este parametro sirve para modificar el tamaño de la pantalla pero lo hardcodeo a 100 para simplificar
var color_seleccionado = colores_principales_en[0];

//Genera la codificación,memoria y pantalla según el tamaño de palabra seleccionado por el usuario
function generar_instancia_vacia(){

  cargar_valores_por_default();
  mostrar_entradas_salidas();

  //Oculto campos de generar y cargar archivo
  var tabla_salidas = document.getElementById("generar_cargar");
  tabla_salidas.style.visibility = 'hidden';

}

//Muestra memoria y pantalla con el dump de memoria importado. La codificación segun tamaño de palabra.
function generar_instancia_desde_archivo(){

  //Carga el archivo del usuario y setea valores de memoria, codificacion y tamanio_palabra
  mostrar_entradas_salidas();

  //Oculto campos de generar y cargar archivo
  var tabla_salidas = document.getElementById("generar_cargar");
  tabla_salidas.style.visibility = 'hidden';
}

//Muestra las tablas de codificacion, memoria, pantalla, entrada de texto y botones
function mostrar_entradas_salidas(){

  mostrar_memoria();
  mostrar_pantalla();

  var tabla_salidas = document.getElementById("tabla_salidas");
  tabla_salidas.style.visibility = 'visible';

  //Tabla con caracteres y sus códigos
  mostrar_tabla_codificacion();

  generar_campo_color_actual()

  //Color seleccionado
  var campo_color_actual = document.getElementById("campo_color_actual");
  campo_color_actual.style.visibility = 'visible';
}


//Carga los valores por defecto segun el tamanio de palabra seleccionado por el usuario
function cargar_valores_por_default(){

  //Tomo el tamaño de la palabra definido por el usuario en "Bits por caracter"
  tamanio_palabra = document.getElementById("tamanio_palabra").value;
  
  for (i = 0; i < tamanio_palabra*cantidad_palabras; i++){
    dump_memoria[i] = "0";
  }

  //Define el diccionario de codificación, con valores por defecto (no definidos por usuario)
  diccionario_codificacion = definir_codificacion(tamanio_palabra,colores_principales_en);
  color_seleccionado = colores_principales_en[0];
}

//Devuelve un diccionario con los colores del array y una codificacion binaria incremental
function definir_codificacion(tamanio_palabra,colores){

  diccionario_local = {};

    for (var i = 0; i < 2**tamanio_palabra; i++) {
      diccionario_local[i] = colores[i];   
    }

  return diccionario_local;
}

function mostrar_tabla_codificacion(){

  var tabla_generar_codificacion = document.getElementById("tabla_generar_codificacion");
  tabla_generar_codificacion.style.visibility = 'visible';
  var boton_actualizar = document.getElementById("boton_actualizar");
  boton_actualizar.style.visibility = 'visible';


  if (document.contains(document.getElementById("campos_codificacion"))) {
    document.getElementById("campos_codificacion").remove();
  }

  //Obtengo el div donde voy a meter la tabla
  var div_campos_codificacion = document.getElementById("tabla_generar_codificacion");

  // Crea un elemento <table> y un elemento <tbody>
  var tabla   = document.createElement("table");
  tabla.setAttribute("id", "campos_codificacion");
  var tblBody = document.createElement("tbody");

  var hilera = document.createElement("tr");

  //Celda con titulo Nro
  var celda = document.createElement("td");
  celda.style.border = "0";
  var textoCelda = document.createTextNode("N°");
  celda.appendChild(textoCelda);
  hilera.appendChild(celda);

  //Celda con titulo caracter
  var celda = document.createElement("td");
  celda.style.border = "0";
  var textoCelda = document.createTextNode("Color");
  celda.appendChild(textoCelda);
  hilera.appendChild(celda);

  //Celda con titulo codificacion
  var celda = document.createElement("td");
  celda.style.border = "0";
  celda.style.textAlignLast = "center";
  var textoCelda = document.createTextNode("Binario");
  celda.appendChild(textoCelda);
  hilera.appendChild(celda);
  tblBody.appendChild(hilera);

  // Crea las celdas
  for (var i = 0; i < 2**tamanio_palabra; i++) {
    color_actual = diccionario_codificacion[i];
    // Crea las hileras de la tabla
    var hilera = document.createElement("tr");
    var celda = document.createElement("td");
    celda.style.border = "0";
    var textoCelda = document.createTextNode(i);
    celda.appendChild(textoCelda);
    hilera.appendChild(celda);

    var celda = document.createElement("td");
    celda.style.border = "0";
    var boton_color = document.createElement("INPUT");
    boton_color.setAttribute("type","text");
    boton_color.setAttribute("class","campo_color");
    boton_color.setAttribute("id","boton_select_color"+i);
    funcion_con_parametro = "seleccionar_color('"+color_actual+"')";
    boton_color.setAttribute("onclick",funcion_con_parametro);
    boton_color.style.backgroundColor = color_actual;
    boton_color.setAttribute("value",color_actual);
    if (color_actual == "white" || color_actual == "yellow" || i >= 8){
      boton_color.style.color = "black";
    }
    celda.appendChild(boton_color);
    hilera.appendChild(celda);

    var celda = document.createElement("td");
    celda.style.border = "0";
    var entrada = document.createElement("INPUT");
    entrada.setAttribute("id", "codificacion"+i);
    entrada.setAttribute("type","INPUT");
    entrada.setAttribute("maxlength",tamanio_palabra);
    entrada.setAttribute("size",5);
    entrada.setAttribute("readonly",true);
    indiceEnBinario = createBinaryString (i,tamanio_palabra);
    entrada.setAttribute("value",indiceEnBinario);
    celda.appendChild(entrada);
    hilera.appendChild(celda);

    // agrega la hilera al final de la tabla (al final del elemento tblbody)
    tblBody.appendChild(hilera);
  }

  tabla.appendChild(tblBody);
  tabla.setAttribute("border", "1");
  div_campos_codificacion.appendChild(tabla);

}


//Si cambian los valores originales, se rehace la codificación
function actualizar_codificacion(){

  //Capturo los datos ingresados en los campos
  tamanio_palabra = document.getElementById("tamanio_palabra").value;

  //Obtengo las codificaciones cargadas
  for (var i = 0; i<2**tamanio_palabra;i++){
    color = document.getElementById("boton_select_color"+i).value;
    codigo_color_actual = document.getElementById("codificacion"+i).value;
    //Parseo string del código binario a decimal
    codificacion = parseInt(codigo_color_actual,2);

    diccionario_codificacion[codificacion] = color;
    if (color == ""){
      break;
    }
  }

  //Limpia memoria, pantalla y campo de entrada
  limpiar_todo();
  mostrar_tabla_codificacion();
  //Actualizo el color seleccionado con el primero de la lista
  color_actual = document.getElementById("color_actual");
  color_actual.style.backgroundColor = diccionario_codificacion[0];
  color_seleccionado = diccionario_codificacion[0];
}



//Muestra el campo con el color seleccionado
function generar_campo_color_actual(){

  var div_color_actual = document.getElementById("div_color_actual");

  var color_actual = document.createElement("INPUT");
  color_actual.setAttribute("type","text");
  color_actual.setAttribute("id", "color_actual");
  color_actual.setAttribute("class", "campo_color");
  color_actual.style.backgroundColor = color_seleccionado;
  div_color_actual.appendChild(color_actual);
}



//Generar memoria RAM con los tamaños y cantidad de posiciones (segun pantalla)
function mostrar_memoria(){

  if (document.contains(document.getElementById("memoria"))) {
      document.getElementById("memoria").remove();
  }

  var tabla_memoria = document.getElementById("tabla_memoria");
 
  // Crea un elemento <table> y un elemento <tbody>
  var tabla   = document.createElement("table");
  tabla.setAttribute("id", "memoria");
  tabla.style.borderColor="#679D08";
  var tblBody = document.createElement("tbody");

  dump_memoria_index = 0;
 
  // Crea las filas segun cantidad de palabras
  for (var i = 0; i < cantidad_palabras; i++) {

    var hilera = document.createElement("tr");
    hilera.setAttribute("id","fila"+i);

    //Creo columnas segun tamaño de palabra
    for (var j = 0; j <= tamanio_palabra; j++) {
      var celda = document.createElement("td");
      
      //Si la columna es la primera, pongo la posición de memoria
      if (j == 0){
        textoCelda = document.createTextNode(i);
        colorTextoFondo = {"colorFondo": "#679D08", "colorTexto": "white"};
        celda.style.fontWeight = '900';
      }else {
        textoCelda = document.createTextNode(dump_memoria[dump_memoria_index]);  
        dump_memoria_index++;
        colorTextoFondo = {"colorFondo": "#CBD6B8", "colorTexto": "black"};
      }

      celda.style.backgroundColor=colorTextoFondo["colorFondo"];
      celda.style.color=colorTextoFondo["colorTexto"];
      celda.style.textAlign = "center";
      celda.appendChild(textoCelda);
      hilera.appendChild(celda);
    }
    //Agrego fila con columnas generadas
    tblBody.appendChild(hilera);
  }
 
  tabla.appendChild(tblBody);
  tabla.setAttribute("border", "2");
  tabla_memoria.appendChild(tabla);
  //Ir al inicio de la memoria
  document.getElementById("fila0").scrollIntoView();
}



function mostrar_pantalla(){

  if (document.contains(document.getElementById("pantalla"))) {
      document.getElementById("pantalla").remove();
  }

  var tabla_pantalla = document.getElementById("tabla_pantalla");

  var tabla   = document.createElement("table");
  tabla.setAttribute("id", "pantalla");
  var tblBody = document.createElement("tbody");

  numero_pixel = 0;
  //Alto de la pantalla
  for (var i = 0; i < Math.sqrt(cantidad_palabras); i++) {
    var hilera = document.createElement("tr");
    hilera.style.border = "0";

    //Ancho de la pantalla, cada "pixel"
    for (var j = 0; j < Math.sqrt(cantidad_palabras); j++) {
      var celda = document.createElement("td");
      celda.setAttribute("align","center");
      celda.style.border = "0";
      celda.style.borderCollapse = "collapse";

      //Cada "pixel" es un botón ("touch")
      var pixel_pantalla = document.createElement("INPUT");
      pixel_pantalla.setAttribute("type","button");
      pixel_pantalla.setAttribute("class","pixel_pantalla");

      //Obtengo el color correspondiente a la codificación actual
      let codigo_color_actual = "";
      let color_vacio = true;

      //agrupo segun el tamanio_palabra para obtener el codigo del color
      for (var k = 0; k< tamanio_palabra; k++){
        //Obtengo el codigo del color de memoria
        codigo_color_actual+=dump_memoria[(numero_pixel)*tamanio_palabra+k];

        //Si encuentra un codigo "-", quiere decir que no está definida la palabra
        if (codigo_color_actual[k] == "-"){
          //Termino el ciclo
          break;
        }
        //Si finalizo, hay codigo
        color_vacio = false;
      }

      if (!color_vacio){
        pixel_pantalla.style.backgroundColor = dame_color(codigo_color_actual);
      }

      pixel_pantalla.setAttribute("id","pixel_pantalla"+numero_pixel);
      //Genero funcion para que cambie el color
      funcion_con_parametro = "cambiar_color_pixel("+numero_pixel+")"
      pixel_pantalla.setAttribute("onclick",funcion_con_parametro);
      
      celda.appendChild(pixel_pantalla);
      hilera.appendChild(celda);

      numero_pixel++;
    }

    tblBody.appendChild(hilera);
  }

  tabla.appendChild(tblBody);
  tabla.setAttribute("border", "2");
  tabla_pantalla.appendChild(tabla);  
}



//Actualizo contenido de ram segun lo modificado en la pantalla
function refrescar_ram(color_seleccionado,id_boton){   

  //Obtengo la codificacion binaria a partir del color_seleccionado
  //codificacionBinaria = diccionario_codificacion[color_seleccionado];
  codificacionBinaria = dame_codificacion_color(color_seleccionado);

  indiceFilaMemoria = id_boton;

  var filaMemoria = document.getElementById("memoria").rows[indiceFilaMemoria].cells;
  
  indiceInicioColumna = 1; //La columna cero es para la posición de memoria

  //La memoria es lineal, así que el inicio será en id_boton*tamanio_palabra
  indiceMemoria = id_boton*tamanio_palabra;

  var indice_codificacion = 0;
  for (i = indiceInicioColumna; i<indiceInicioColumna+parseInt(tamanio_palabra); i++){
      filaMemoria[i].innerHTML = codificacionBinaria[indice_codificacion];
      filaMemoria[i].style.fontWeight = "900";
      dump_memoria[indiceMemoria] =  codificacionBinaria[indice_codificacion];
      indice_codificacion++;
      indiceMemoria++;
  }

  //Pongo en amarillo la posición de memoria que acabo de modificar y limpio el resto
  for (i=0;i<cantidad_palabras;i++){
    var filaMemoria = document.getElementById("memoria").rows[i].cells;

    if(i == id_boton){
      filaMemoria[0].style.fontWeight = "900";
      filaMemoria[0].style.color = "yellow";
    }else {
      filaMemoria[0].style.fontWeight = "normal";
      filaMemoria[0].style.color = "white";
    }
  }

  //Me desplazo hacia la fila que modifiqué
  ver_memoria_modificada(id_boton);
}



//Limpiar pantalla y memoria
function limpiar_todo(){
  limpiar_memoria();
  limpiar_pantalla(); 
}

function limpiar_memoria(){
filasMemoria = cantidad_palabras;

for (var i=0; i< filasMemoria; i++){
  var filaPantalla = document.getElementById("memoria").rows[i].cells;
  filaPantalla[0].style.color = "white";
  filaPantalla[0].style.fontWeight = "normal";
  for (var j=1; j<= tamanio_palabra; j++){
    dump_memoria[i+j] = "0";
    filaPantalla[j].innerHTML = "0";
    filaPantalla[j].style.fontWeight = "normal";
  }
}
//Ir al inicio de la memoria
document.getElementById("fila0").scrollIntoView();
}



function limpiar_pantalla(){
  for (var i=0; i< cantidad_palabras; i++){
    boton = document.getElementById("pixel_pantalla"+i);
    boton.style.backgroundColor = "white";
  }
}



//Cambia de color el pixel de la pantalla
function cambiar_color_pixel(id_boton){
  boton = document.getElementById("pixel_pantalla"+id_boton);
  boton.style.backgroundColor = color_seleccionado;
  refrescar_ram(color_seleccionado,id_boton);
}



//Selecciona color actual
function seleccionar_color(color){
  color_seleccionado = color;
  color_actual = document.getElementById("color_actual");
  color_actual.style.backgroundColor = color_seleccionado;
}



//Cantidad de filas de ram que entran en el frame
var cantidad_por_pantalla = 8;

//Si la posición de memoria no está en la pantalla, scrolleo el frame para ver el cambio
//Para no marear, lo hago en "páginas" dependiendo de la cantidad que entran en pantalla
//Esto "aplasta" los números a 0,8,16,24,etc
function ver_memoria_modificada(actual_modificada){

  //Todo lo que entra en la primer página, "no lo muevo"
  if (actual_modificada <= cantidad_por_pantalla){
    document.getElementById("fila0").scrollIntoView();  
  }else{
    fila_para_centrar = ((~~(actual_modificada / cantidad_por_pantalla)))*cantidad_por_pantalla;
    document.getElementById("fila"+fila_para_centrar).scrollIntoView();
  }
}



//Funciones para importar y exportar desde y hacia archivos con formato json

function cargar_desde_json() {
	var files = document.getElementById('selectFiles').files;
  if (files.length <= 0) {
    return false;
  }
  
  var fr = new FileReader();
  
  fr.onload = function(e) { 
    var result = JSON.parse(e.target.result);

    if(result.hasOwnProperty('colores')){
      lista_colores = Object.keys(result.colores);
      lista_codigos = Object.values(result.colores);
    }else{
      lista_colores = colores_principales_en;
    }

    if(result.hasOwnProperty('tamanio_palabra')){
      tamanio_palabra = result.tamanio_palabra;
    }else{
      tamanio_palabra = 5;
    }

    diccionario_codificacion = definir_codificacion(tamanio_palabra,lista_colores);

    if(result.hasOwnProperty('memoria')){
      dump_memoria = result.memoria;
      imagen_usuario = cargar_pixeles_usuario();
    }
   
    generar_instancia_desde_archivo();
  };
  fr.readAsText(files.item(0));
  
}

function cargar_pixeles_usuario(){
  var pixeles_usuario = [];

  //Recorro hasta el dump de memoria
  var palabras_recorridas = 0;
  while (palabras_recorridas < cantidad_palabras){

    codigo_color_actual = "";
    //agrupo segun el tamanio_palabra
    for (var j = 0; j< tamanio_palabra; j++){
      codigo_color_actual+=dump_memoria[palabras_recorridas*tamanio_palabra+j];
    }
    
    //color_pixel_actual = dame_color_pixel(codigo_color_actual);
    color_pixel_actual = dame_color(codigo_color_actual);
    pixeles_usuario.push(color_pixel_actual);

    palabras_recorridas++;
  }
  return pixeles_usuario;
}

const estado_imagen = {
  tamanio_palabra : 0,
  colores : {},
  memoria : []
};

//Genera json a partir de los datos actuales
function exportar_json(){

  const exportObj = Object.create(estado_imagen);
  exportObj.tamanio_palabra = tamanio_palabra;

  exportObj.memoria = dump_memoria;
  exportName = "output";
  downloadObjectAsJson(exportObj, exportName);
}

function downloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}




///FUNCIONES AUXILIARES

//Con el codigo binario, obtengo el color
function dame_color(codigo_color_actual){

  //Defino default por si no lo encuentra
  let color = "white";

  //Si el codigo tiene un "-", devuelvo el mismo color
  if (codigo_color_actual[0] == "-"){
    color = "white";
  }else{//Si es un codigo de codificación binario

    //Parseo string del código binario a decimal
    i = parseInt(codigo_color_actual,2);

    //Obtengo el color con el índice, sobre el diccionario de codificación
    color = diccionario_codificacion[i];
  }      
  return color;
}


//Dado un color, obtengo su ínidice en el diccionario, y devuelvo codificacion binaria segun tamanio_palabra
function dame_codificacion_color(color_actual){
  indice_color = -1;

  for (i = 0; i < Object.keys(diccionario_codificacion).length; i++){
    if (diccionario_codificacion[i] == color_actual){
      indice_color = i;
      break;
    }
  }
  return createBinaryString(indice_color,tamanio_palabra);
}

//Convierte de decimal a binario, hasta 32 bits para generar codigos
function createBinaryString (nMask,tamanio_palabra) {
  for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
       nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
  //Recorto el substring con la cantidad de finales que necesito    
  return sMask.substring(32-tamanio_palabra);
}



//Funcion de debug
function mostrar_diccionario(dict){
  for (var key in dict) {
    if (dict.hasOwnProperty(key)) {
        console.log(key, dict[key]);
    }
  }
}
