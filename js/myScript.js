var arr = [];
var Lista = {
	data: "",
	tarefa:"",
	inicio: "",
	fim: ""
}

function atualizaArray(){

	if (localStorage.getItem("lista") !== null){
		var tarefas = localStorage.getItem("lista");
		console.log(tarefas);
		console.log(eval("["+tarefas+"]"));
		arr = eval(tarefas);
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
		document.getElementById('parar').style.display = "block";
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
	document.getElementById('comeca').style.display = "block";
}

function volta() {
	var valor= document.getElementById('txtFim').innerHTML += document.getElementById('hora').firstChild.data + "" + document.getElementById('minuto').firstChild.data + "" + document.getElementById('segundo').firstChild.data ";
}

function limpa() {
	document.getElementById('txtFim').innerHTML = "";
}
window.onload=tempo;
