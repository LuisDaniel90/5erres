//Fran Macías 2011.
//Licencia GNU-GPL
//http://educalim.com/cinicio.htm
var obj_API = null;
var tempo_ini;
var objl='';
var conscorm=false;
var controlp=new Array();
var intentos=new Array();
var tp=0;
var ta=0;
var tb=0;
var completo=false;
var valmax=100;
var numint=0;
function tempo_total(){
var currentTime = new Date();
var endTime = currentTime.getTime()
var calculatedTime = endTime-tempo_ini;
var totalHours = Math.floor(calculatedTime/1000/60/60);
calculatedTime = calculatedTime - totalHours*1000*60*60;
if ( totalHours < 1000 && totalHours > 99 ) {
totalHours = "0"+totalHours;
} else if ( totalHours < 100 && totalHours > 9 ) {
totalHours = "00"+totalHours;
} else if ( totalHours < 10 ) {
totalHours = "000"+totalHours;
}
var totalMinutes = Math.floor(calculatedTime/1000/60);
calculatedTime = calculatedTime - totalMinutes*1000*60;
if ( totalMinutes < 10 ) {
totalMinutes = "0"+totalMinutes;
}
var totalSeconds = Math.floor(calculatedTime/1000);
if ( totalSeconds < 10 ) {
totalSeconds = "0"+totalSeconds;
}
var sessionTime = totalHours+":"+totalMinutes+":"+totalSeconds;
return sessionTime;
}
function lim_getAPI()
{
var oAPI = null;
var tries = 0, triesMax = 500;
while (tries < triesMax &&  oAPI == null)
{
oAPI = findAPI(window);
if ( oAPI == null && typeof(window.parent) != 'undefined')  oAPI = findAPI(window.parent)
if ( oAPI == null && typeof(window.top) != 'undefined')  oAPI = findAPI(window.top);
if ( oAPI == null && typeof(window.opener) != 'undefined') if (window.opener != null && !window.opener.closed)  oAPI = findAPI(window.opener);
tries++;
}
if ( oAPI == null)
{
window.status = 'X API';
}
else
{
obj_API =  oAPI;
window.status = 'v API SCORM';
conscorm=true;
}
}
function findAPI(win)
{
if (typeof(win) != 'undefined' ? typeof(win.API) != 'undefined' : false)
{
if (win.API != null )  return win.API;
}
if (win.frames.length > 0)  for (var i = 0 ; i < win.frames.length ; i++);
{
if (typeof(win.frames[i]) != 'undefined' ? typeof(win.frames[i].API) != 'undefined' : false)
{
if (win.frames[i].API != null)  return win.frames[i].API;
}
}
return null;
}
function iniscorm(){    
var currentTime = new Date();
tempo_ini = currentTime.getTime();
lim_getAPI();
if (conscorm){
err = obj_API.LMSInitialize( "" );
exitPageStatus = false;
var status = obj_API.LMSGetValue( "cmi.core.lesson_status" );
if (status == "not attempted")
{
obj_API.LMSSetValue( "cmi.core.lesson_status", "incomplete" );
}
var vmax=obj_API.LMSGetValue( "cmi.core.score.max");
if (vmax==''){
valmax=100;
}else{
valmax=parseFloat(vmax);
}
}
}
function lim_sc(variable,valor){
var nvalor=parseFloat(valor)-1;
tc="cmi.interactions."+nvalor+".";
st=nvalor+1;
if (variable=="totalp") {
objl=document.getElementById('objlim');
tp=parseFloat(valor); 
ta=objl.lim_dat('get','total_activ');


for (var t=0;t<tp;t++){
controlp[t]='0';
var tc='';
var st=0;
tc="cmi.interactions."+t+".";
st=t+1;
err = obj_API.LMSSetValue( tc+"id", "Pagina"+st.toString() );
err = obj_API.LMSSetValue( tc+"result", 'neutral' );
err = obj_API.LMSSetValue( tc+"score.raw", 0);
err = obj_API.LMSSetValue( tc+"student_response", "" );
intentos[t]=0;
}
objl.lim_dat('nome_usuario',obj_API.LMSGetValue( "cmi.core.student_name") );
var nints = obj_API.LMSGetValue( "cmi.comments");
var aints=nints.split("-");
numint=aints.length;

}else if (variable=="paxina") {
controlp[nvalor]='0';
if (nvalor==tp-1){
completo=true;
}
}else if (variable=="avben"){  
err = obj_API.LMSSetValue( tc+"id", "Pagina"+st.toString() );
err = obj_API.LMSSetValue( tc+"result", 'correct' );
if (controlp[nvalor]!='1') {
controlp[nvalor]='1';
intentos[nvalor]++;
err = obj_API.LMSSetValue( tc+"student_response", "Correcta   | Intentos:"+intentos[nvalor]+'' );
}
}else if (variable=="avmal") {
if (controlp[nvalor]!='1') {
err = obj_API.LMSSetValue( tc+"id", "Pagina"+st.toString() );
err = obj_API.LMSSetValue( tc+"result", 'wrong' );
controlp[nvalor]='2';
intentos[nvalor]++;
err = obj_API.LMSSetValue( tc+"student_response", "Incorrecta   | Intentos:"+intentos[nvalor]+'' );
}
}

tb=objl.lim_dat('get','total_ben');
}
function salir(){
if (conscorm){
err = obj_API.LMSSetValue( "cmi.core.session_time", tempo_total());
var tbb=parseFloat(tb);
tb=(Math.round((tbb*valmax)/ta)).toString();
ta=String(valmax);
if (completo==true){
err = obj_API.LMSSetValue( "cmi.core.lesson_status", "completed" );
err = obj_API.LMSSetValue( "cmi.comments","["+numint+"] Completado con "+tb+" sobre "+ta+" - ");
}else{
err = obj_API.LMSSetValue( "cmi.core.lesson_status", "incomplete" );
err = obj_API.LMSSetValue( "cmi.comments","["+numint+"] No completado"+" - ");
}
err = obj_API.LMSSetValue( "cmi.core.score.raw", tb );
err = obj_API.LMSSetValue( "cmi.core.score.max", ta );
err = obj_API.LMSFinish('');
}
}
window.onload = function() {
iniscorm();
}
window.onunload = function() {
salir();
}

