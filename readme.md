## Documentacion de codigo 

## Para modulos: 

============================================================
MODULOS 2 y 3
// Cada modulo recibe el texto que escribe el usuario y devuelve el
// resultado como texto. Corre en el navegador, sin servidor.
//
//   id          identificador unico (sin espacios)
//   titulo      nombre que aparece en el menu
//   descripcion una linea que explica el modulo
//   video       URL para incrustar (YouTube "embed", SharePoint, Stream...).
//               Dejalo vacio ("") para mostrar un recuadro "aqui ira el video".
//   entrada     texto de ayuda dentro del cuadro de entrada
//   ejecutar    function (texto) { ...; return "resultado"; }
============================================================

 ------------------------------------------------------------
### Modulo 2: extractor de logs (port de azure.py)
### Busca cada campo con una lista de patrones, en orden de prioridad,
### y devuelve una fila separada por tabuladores lista para pegar en Excel.
// ------------------------------------------------------------