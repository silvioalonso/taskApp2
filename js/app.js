var btnChange = true;
var arrTarefas = [];
var arrTempos = [];

function testesMD5(){
  console.log($.md5("aiosj"));
}

function atualizaArray(){

  if (localStorage.getItem("Tarefas") !== null){
    var tarefas = localStorage.getItem("Tarefas");
    arrTarefas = eval(tarefas);
  }

  if (localStorage.getItem("tempos") !== null && localStorage.getItem("tempos") !== ""){
    var tempos = localStorage.getItem("tempos");
    arrTempos = eval(tempos);
  }
}

function carregaComboBox(arr){
  for (var i = 0; i < arr.length; i++){
    $("#sel1").append("<option>" + arr[i].nome + "</option>");
  }
}

function salvaTempos(tarefa, tInicial, tFinal, id){
  id = id || null;
  var obj = {id: id, nome: tarefa, inicio: tInicial, fim: tFinal};
  arrTempos.push(obj);
  localStorage.setItem("tempos", JSON.stringify(arrTempos));
}

function salvaTemposAjax(tarefa, tInicial, tFinal){
  $.ajax({
    type: "POST",
    url:"http://localhost:8080/gko-taskapp-service/registro/salvar",
    data: {tarefa: tarefa, inicio: tInicial, fim: tFinal, idUsuario: 1, hash: "123"}

  }).error(function(){
    salvaTempos(tarefa, tInicial, tFinal);

  }).done(function(data){
    //console.log(data);
    //id = data.registro.id;
    //salvaTempos(tarefa, tInicial, tFinal, id);
    console.log(data);
  });
}

function synchronize(){
  //atualizaArray();
  for(var i = 0; i < arrTempos.length; i++){
    if(arrTempos[i].id == null){
      salvaTemposAjax(arrTempos[i].nome, arrTempos[i].inicio, arrTempos[i].fim);
      arrTempos.splice(i,1);
    }
  }
}

function editaTempos(i, tInicial, tFinal, sync){
  arrTempos[i].inicio = tInicial;
  arrTempos[i].fim = tFinal;
  arrTempos[i].isSync = sync;
  localStorage.setItem("tempos", JSON.stringify(arrTempos));
  console.log(arrTempos);
}

function editaTemposAjax(i, tInicial, tFinal){
  $.ajax({
    type: "POST",
    url:"http://localhost:8080/gko-taskapp-service/registro/editar",
    data: {id: arrTempos[i].id, tarefa: arrTempos[i].nome, inicio: tInicial, fim: tFinal}

  }).error(function(){
    editaTempos(i, tInicial, tFinal, false);

  }).done(function(data){
    editaTempos(i, tInicial, tFinal, true);
  });
}

$(document).ready(function(){

  atualizaArray();

  carregaComboBox(arrTarefas);

	$("#controle").click(function(){

    if (btnChange == true) {
      $(this).toggleClass("btn-success").toggleClass("btn-danger").text("Finalizar tarefa");
      $("#sel1").prop('disabled', true);
      $(".ini , #time").show();
      chronometer.start();
      btnChange=false;
      $("#reset").trigger( "click" );
      $("#start_pause_resume").trigger("click");

    } else if(btnChange == false){
      $(this).removeClass("btn-success btn-danger").prop("disabled",true).text("Selecione uma nova tarefa");
      $("#sel1").prop('disabled', false);
      $(".fim").show();
      chronometer.stop();
      btnChange=true;
      //salvaTempos($("#sel1 option:selected").text(), $("#startTime").text(), $("#stopTime").text());
      salvaTemposAjax($("#sel1 option:selected").text(), $("#startTime").text(), $("#stopTime").text());
      $("#start_pause_resume").trigger("click");
    }
	});


  $("#sel1").change(function(){
    $("#controle").addClass("btn-success").prop("disabled",false).text("Iniciar tarefa");
    $(".ini , .fim , #time").hide();
  });


  $("#sync").click(function(){
    synchronize();
  });

});
