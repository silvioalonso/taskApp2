var arr = [];
var Lista = {
	data: "",
	tarefa:"",
	inicio: "",
	fim: ""
}

function hora() {

    data = new Date();

// Guarda cada pedaço em uma variável
var dia     = data.getDate();           // 1-31
var dia_sem = data.getDay();            // 0-6 (zero=domingo)
var mes     = data.getMonth();          // 0-11 (zero=janeiro)
var ano2    = data.getYear();           // 2 dígitos
var ano4    = data.getFullYear();       // 4 dígitos
var hora    = data.getHours();          // 0-23
var min     = data.getMinutes();        // 0-59
var seg     = data.getSeconds();        // 0-59
var mseg    = data.getMilliseconds();   // 0-999
var tz      = data.getTimezoneOffset(); // em minutos

// Formata a data e a hora (note o mês + 1)
var str_data = dia + '/' + (mes+1) + '/' + ano4;
var str_hora = hora + ':' + min + ':' + seg;

// Mostra o resultado

    document.getElementById("txtData").value = str_data;
    document.getElementById("txtInicio").innerHTML = str_hora;
    document.getElementById("txtFim").innerHTML = str_hora;

}

function atualizaArray(){

	if (localStorage.getItem("lista") !== null){
		var tarefas = localStorage.getItem("lista");
		
		
		arr = eval(tarefas);

		for (var i = 0; i < arr.length; i++) {
        arr[i].value = select.options[localStorage.getItem('txtTarefa')].selected = true;
    }

		
	}

}

function carregaLista(){

	atualizaArray();

}

function limpaCampos(){
	var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
}

function myFunction() {

	atualizaArray();
	
	Lista.data = document.getElementById("txtData").value;
	Lista.tarefa = document.getElementById("txtTarefa").value;
	Lista.inicio = document.getElementById("txtInicio").value;
	Lista.fim = document.getElementById("txtFim").value;

    arr.push(Lista);

    localStorage.setItem("lista", JSON.stringify(arr));

    var resultado = "<ol>";

    for (i in arr){
    	resultado = resultado + "<li>" +"Data :"+ arr[i].data + " - " +"Tarefa :"+ arr[i].tarefa + " - " +"Inicio :"+ arr[i].inicio + " - " +"Fim :"+ arr[i].fim + "</li>";
    }
		resultado = resultado + "</ol>";

	el = document.getElementById("resultado");
	el.innerHTML = resultado;
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";

	limpaCampos();
}
 var intervalo;

function tempo(op) {
	if (op == 1) {
		document.getElementById('parar').style.display = "";
		document.getElementById('comeca').style.display = "none";
	}
	var s = 1;
	var m = 0;
	var h = 0;
	intervalo = window.setInterval(function() {
		if (s == 60) { m++; s = 0; }
		if (m == 60) { h++; s = 0; m = 0; }
		if (h < 10) document.getElementById("hora").innerHTML = "0" + h + "h"; else document.getElementById("hora").innerHTML = h + "h";
		if (s < 10) document.getElementById("segundo").innerHTML = "0" + s + "s"; else document.getElementById("segundo").innerHTML = s + "s";
		if (m < 10) document.getElementById("minuto").innerHTML = "0" + m + "m"; else document.getElementById("minuto").innerHTML = m + "m";		
		s++;
	},1000);
}

function parar() {
	window.clearInterval(intervalo);
	document.getElementById('parar').style.display = "none";
	document.getElementById('comeca').style.display = "";
	hora();
	myFunction();
}

function volta() {
	document.getElementById('voltas').innerHTML += document.getElementById('hora').firstChild.data + "" + document.getElementById('minuto').firstChild.data + "" + document.getElementById('segundo').firstChild.data + "<br>";
}

function limpa() {
	document.getElementById('voltas').innerHTML = "";
}






function mySelectValue() {
    // Add an event listener for the value
    document.getElementById('mySelectValue').addEventListener('change', function() {
      // Get the value of the name field.
      var mySelectValue = document.getElementById('mySelectValue').value;

      // Save the name in localStorage.
      localStorage.setItem('mySelectValue', mySelectValue);
    });
}


window.onload=tempo;
