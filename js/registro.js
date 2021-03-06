var btnDelete = true;

var arrRegistros = [];
var store;
var grid
var emptyStore;
var updateItem=false;
var selectedItem;
var timeFormat = 'DD/MM/YYYY, H:mm:ss';
var timeDiff=new Date();

var txtId ;
var txtNome;
var txtInicio;
var txtFim;
var txtTempoGasto;

var senha = "@123";
var idUsuario;

  var tempos = {
    nome:"",
    inicio: "",
    fim: "",
    tempogasto:timeDiff
  }


function salvaTempos(nome,inicio,fim,tempogasto){   

  if (updateItem){
          
    updateItem=false;
          
    arrRegistros[selectedItem].nome=dojo.byId("nome").innerText;
    arrRegistros[selectedItem].inicio=dojo.byId("inicio").value;
    arrRegistros[selectedItem].fim=dojo.byId("fim").value;
    arrRegistros[selectedItem].tempogasto=dojo.byId("tempogasto").innerText;

    localStorage.setItem("tempos", JSON.stringify(arrRegistros));                                     
         
  }else{

    if (localStorage.getItem("tempos") !== null){
      arrRegistros=eval(localStorage.getItem("tempos"));
  }

    arrRegistros.push({"nome":nome,"inicio":inicio,"fim":fim,"tempogasto":tempogasto});
    localStorage.setItem("tempos", JSON.stringify(arrRegistros));     

  }
  preencheGridRegistros();
  limpaCampos();
}

function salvaTemposAjax(tnome, tinicio, tfim){
  $.ajax({
    type: "POST",
    url:"http://localhost:8080/gko-taskapp-service/tarefa/salvar",
    data: {nome: tnome, inicio: tinicio, fim: tfim, idUsuario: 1, hash: $.md5(senha+tnome+tinicio+tfim+1)}

  }).error(function(){
          
    txtTempoGasto =dojo.byId("tempogasto").value;

    salvaTempos(tnome, tinicio, tfim,txtTempoGasto);
    console.log("Não há conexão com a rede. Registro salvo localmente.")

  }).done(function(data){
         
    txtTempoGasto =dojo.byId("tempogasto").value;


    if(data.ajaxResult.codigo == 200){
      id = data.ajaxResult.objeto.id;
      salvaTempos(tnome, tinicio, tfim,txtTempoGasto, id);

    }else if(data.ajaxResult.codigo == 501){
      salvaTempos(tnome, tinicio, tfim,txtTempoGasto);

    }
    console.log(data.ajaxResult.mensagem);
  });
  limpaCampos();
}

  function preencheGridRegistros(){

    require(['dojo/_base/lang', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
    function(lang, ItemFileWriteStore, dom){

      if (localStorage.getItem("tempos") !== null){

        var regTarefas = localStorage.getItem("tempos");
        arrRegistros = eval(regTarefas);

          if (arrRegistros!=null){

            var data = {
              id: "id",
              
              items: []
            };
                
            store = new ItemFileWriteStore({data: data});

                     
                  
            for (var i = 0; i < arrRegistros.length; i++) {
                
                var itemTarefa =  { id: i, nome: arrRegistros[i].nome,inicio:arrRegistros[i].inicio,fim:arrRegistros[i].fim,tempogasto:moment(tempogasto).format(timeFormat).split(",")[1]}; 
                store.newItem(itemTarefa);                     
            }
           
            grid.setStore(store);
          }       
      }
    }); 
  }

function editaTempos(i, nome, inicio, fim, tempogasto){
  arrRegistros[i].nome = nome;
  arrRegistros[i].inicio = inicio;
  arrRegistros[i].fim = fim;
  arrRegistros[i].tempogasto = tempogasto;

  localStorage.setItem("tempos", JSON.stringify(arrRegistros));
}

function editaTemposAjax(i, nome,inicio, fim,tempogasto){
  $.ajax({
    type: "POST",
    url:"http://localhost:8080/gko-taskapp-service/tarefa/editar",
    data: {id: arrTempos[i].id, nome: arrTempos[i].nome, inicio: inicio, fim: fim, idUsuario: 1, hash: $.md5(senha+arrTempos[i].nome+inicio+fim+1)}

  }).error(function(){
    editaTempos(i, nome,inicio, fim, false);
    console.log("Não há conexão com a rede. Registro salvo localmente.")

  }).done(function(data){
    if(data.ajaxResult.codigo == 200){
      editaTempos(i, nome, inicio, fim, true);

    }else if(data.ajaxResult.codigo == 501){
      editaTempos(i, nome,inicio,fim, false);     
    }
    console.log(data.ajaxResult.mensagem); 
  });
}

require(["dojo/ready"], function(ready){
  ready(function(){   
 
  //Grid Tarefas
 require(['dojo/_base/lang', 'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
    function(lang, DataGrid, ItemFileWriteStore, dom){

    /*set up data store*/
    var data = {
      id: "id",
      
      items: []
    };
        
    store = new ItemFileWriteStore({data: data});
    emptyStore = new ItemFileWriteStore({data: data});

    /*set up layout*/
    var layout = [[
   
      {'name': 'Tarefa', 'field': 'nome', 'width': '40%'},
      {'name': 'Inicio', 'field': 'inicio', 'width': '20%'},
      {'name': 'Fim', 'field': 'fim', 'width': '20%'},
      {'name': 'Tempo gasto', 'field': 'tempogasto', 'width': '20%'}
    ]];

    /*create a new grid*/
    grid = new DataGrid({
      id: 'grid',
      store: store,
      structure: layout,
      rowSelector: '20px'});

      /*append the new grid to the div*/
      grid.placeAt("gridDiv");

      /*Call startup() to render the grid*/
      grid.startup();
      preencheGridRegistros();

      // assuming our grid is stored in a variable called "myGrid":
      grid.on("RowClick", function(evt){
        var idx = evt.rowIndex;
        rowData = grid.getItem(idx);     
       
        dojo.byId("nome").innerText = rowData.nome[0];
        dojo.byId("inicio").value=rowData.inicio[0];
        dojo.byId("fim").value=rowData.fim[0];
        dojo.byId("tempogasto").innerText=rowData.tempogasto[0];

        updateItem=true;
        selectedItem=idx;
              
      }, true);

    });

  });
});



require(["dojo/ready"], function(ready){
  ready(function(){
  
    require(["dijit/form/Button", "dojo/dom", "dojo/domReady!"], function(Button, dom){
     
     var btnSave = new Button({  

        iconClass:'dijitEditorIcon dijitEditorIconSave', 
        showLabel: false,          
        onClick: function(){
          

          txtNome = dojo.byId("nome").innerText;
          txtInicio = dojo.byId("inicio").value;
          txtFim =dojo.byId("fim").value;
          txtTempoGasto =dojo.byId("tempogasto").innerText;

                   
          salvaTempos(txtNome,txtInicio,txtFim,txtTempoGasto);

          salvaTemposAjax(txtNome, txtInicio, txtFim);

          synchronize();
          
          preencheGridRegistros(); 
          limpaCampos();                 
        }
      }, "btnSave").startup();

      var btnDelete = new Button({  

      iconClass:'dijitEditorIcon dijitEditorIconDelete', 
      showLabel: false,          
        onClick: function(){

          updateItem=false;
          var items = grid.selection.getSelected();
                                
          if(items.length){                  
                   
            dojo.forEach(items, function(selectedItem){
            
            if(selectedItem !== null){
            
              store.deleteItem(selectedItem);

              arrRegistros.splice(selectedItem, 1);
              localStorage.setItem("tempos", JSON.stringify(arrRegistros));                                   
            } 
          });
        }
        limpaCampos();            
      }
    }, "btnDelete").startup();


    var btnSync = new Button({  

      iconClass:'dijitEditorIcon dijitEditorIconClear', 
      showLabel: false,          
        onClick: function(){

          updateItem=false;
            synchronize();                               
        }
      }, "btnSync").startup();


    var btnClear = new Button({  

      iconClass:'dijitEditorIcon dijitEditorIconClear', 
      showLabel: false,          
        onClick: function(){

          updateItem=false;
            limpaCampos();                               
        }
      }, "btnClear").startup();

  
    });

  });
});

function limpaCampos(){
    var inputs = document.getElementsByTagName('input');

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = '';  
    }
    dojo.byId("tempogasto").innerText='';
    txtNome=dojo.byId("nome").innerText;
}

//Tratar objeto data hora

  var strIni=eval(localStorage.getItem("tempos"))[0].inicio.split(",")[0];
    var strHrInicio=eval(localStorage.getItem("tempos"))[0].inicio.split(",")[1];

    var strFim=eval(localStorage.getItem("tempos"))[0].fim.split(",")[0];
    var strHrFim=eval(localStorage.getItem("tempos"))[0].fim.split(",")[1];
 


 
    var diaI;
    var mesI;
    var anoI;

    for (var d=0;d<strIni.length;d++){
      diaI=strIni[d].split("/");
      mesI=strIni[d].split("/");
      anoI=strIni[d].split("/");
    }

    var horaI;
    var minutosI;
    var segundosI;

    for (var h=0;h<strHrInicio.length;h++){
      horaI=strHrInicio[h].split("/");
      minutosI=strHrInicio[h].split("/");
      segundosI=strHrInicio[h].split("/");
    }

    var dataHoraIni = new Date(anoI, mesI, diaI, horaI, minutosI, segundosI,null); 

    var diaF;
    var mesF;
    var anoF;

    for (var f=0;f<strFim.length;f++){
      diaF=strFim[f].split("/");
      mesF=strFim[f].split("/");
      anoF=strFim[f].split("/");
    }

    var horaF;
    var minutosF;
    var segundosF;

    for (var u=0;u<strHrFim.length;u++){
      horaF=strHrFim[u].split("/");
      minutosF=strHrFim[u].split("/");
      segundosF=strHrFim[u].split("/");
    }

    var dataHoraFim = new Date(anoF, mesF, diaF, horaF, minutosF, segundosF,null);
  
    timeDiff = (dataHoraFim) - (dataHoraIni);
    moment(timeDiff).format(timeFormat) ;

