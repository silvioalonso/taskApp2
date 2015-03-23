  var btnChange = true;
  var arrTarefas = [];
  var arrTempos = [];

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

  function salvaTempos(tarefa, tInicial, tFinal){
    var obj = {nome: tarefa, inicio: tInicial, fim: tFinal};
    arrTempos.push(obj);
//    localStorage.setItem("tempos", JSON.stringify(arrTempos));
    localStorage.setItem("tempos", JSON.stringify(arrTempos));
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
        salvaTempos($("#sel1 option:selected").text(), $("#startTime").text(), $("#stopTime").text());
        $("#start_pause_resume").trigger("click");
      }
  	});

    $("#sel1").change(function(){
        $("#controle").addClass("btn-success").prop("disabled",false).text("Iniciar tarefa");
        $(".ini , .fim , #time").hide();
    });  
  });
