var btnChange = true;
var arrTarefas = [];
var arrTempos = [];
var senha = "@123";


function testesMD5(){
  console.log($.md5("aiosj"));
}

function atualizaArray(){

  if (localStorage.getItem("Tarefas") !== null){
    var tarefas = localStorage.getItem("Tarefas");
    arrTarefas = eval(tarefas);
  }

  if (localStorage.getItem("tempos") !== null){
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
    data: {tarefa: tarefa, inicio: tInicial, fim: tFinal, idUsuario: 1, hash: $.md5(senha+tarefa+tInicial+tFinal+1)}

  }).error(function(){
    salvaTempos(tarefa, tInicial, tFinal);
    console.log("Não há conexão com a rede. Registro salvo localmente.")

  }).done(function(data){
    if(data.ajaxResult.codigo == 200){
      id = data.ajaxResult.objeto.id;
      salvaTempos(tarefa, tInicial, tFinal, id);

    }else if(data.ajaxResult.codigo == 501){
      salvaTempos(tarefa, tInicial, tFinal);

    }
    console.log(data.ajaxResult.mensagem);
  });
}

function synchronize(){
  //atualizaArray();
  for(var i = 0; i < arrTempos.length; i++){
    if(arrTempos[i].id == null){
      salvaTemposAjax(arrTempos[i].nome, arrTempos[i].inicio, arrTempos[i].fim);
      arrTempos.splice(i,1);
      i--;
    } else if(arrTempos[i].isSync == false){
      editaTemposAjax(i, arrTempos[i].inicio, arrTempos[i].fim);
    }
  }
}

function editaTempos(i, tInicial, tFinal, sync){
  arrTempos[i].inicio = tInicial;
  arrTempos[i].fim = tFinal;
  arrTempos[i].isSync = sync;
  localStorage.setItem("tempos", JSON.stringify(arrTempos));
}

function editaTemposAjax(i, tInicial, tFinal){
  $.ajax({
    type: "POST",
    url:"http://localhost:8080/gko-taskapp-service/registro/editar",
    data: {id: arrTempos[i].id, tarefa: arrTempos[i].nome, inicio: tInicial, fim: tFinal, idUsuario: 1, hash: $.md5(senha+arrTempos[i].nome+tInicial+tFinal+1)}

  }).error(function(){
    editaTempos(i, tInicial, tFinal, false);
    console.log("Não há conexão com a rede. Registro salvo localmente.")

  }).done(function(data){
    if(data.ajaxResult.codigo == 200){
      editaTempos(i, tInicial, tFinal, true);

    }else if(data.ajaxResult.codigo == 501){
      editaTempos(i, tInicial, tFinal, false);     
    }
    console.log(data.ajaxResult.mensagem); 
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
      atualizaArray();
      chronometer.start();
      btnChange=false;
      $("#reset").trigger( "click" );
      $("#start_pause_resume").trigger("click");

    } else if(btnChange == false){
      $(this).removeClass("btn-success btn-danger").prop("disabled",true).text("Selecione uma nova tarefa");
      $("#sel1").prop('disabled', false);
      $(".fim").show();
      atualizaArray();
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
    atualizaArray();
    synchronize();
  });

});
