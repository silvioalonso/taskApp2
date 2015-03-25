var btnChange = true;
var arrTarefas = [];
var arr = [];
var store;
var grid
var emptyStore;
var updateItem=false;
var selectedItem;
var timeFormat = 'DD/MM/YYYY, H:mm:ss';

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




var dif = new Date(dataHoraFim-dataHoraIni);
moment(dif).format(timeFormat).split(",")[1] ;

  var tempos = {
    nome:"",
    inicio: "",
    fim: "",
    tempogasto: dif
  }

  

  function preencheGridTarefas(){

    require(['dojo/_base/lang', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
    function(lang, ItemFileWriteStore, dom){

      if (localStorage.getItem("Tarefas") !== null){

        var tarefas = localStorage.getItem("tempos");
        arrTarefas = eval(tarefas);

          if (arrTarefas!=null){

            var data = {
              id: "id",
              
              items: []
            };
                
            store = new ItemFileWriteStore({data: data});           
                  
            for (var i = 0; i < arrTarefas.length; i++) {    
              var itemTarefa =  { id: i, nome: arrTarefas[i].nome,inicio:arrTarefas[i].inicio,fim:arrTarefas[i].fim,tempogasto:moment(tempogasto).format(timeFormat).split(",")[1]}; 
                store.newItem(itemTarefa);                     
            }
           
            grid.setStore(store);
          }       
      }
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
   
      {'name': 'Tarefa', 'field': 'nome', 'width': '50%'},
      {'name': 'Inicio', 'field': 'inicio', 'width': '50%'},
      {'name': 'Fim', 'field': 'fim', 'width': '50%'},
      {'name': 'Tempo gasto', 'field': 'tempogasto', 'width': '50%'}
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
      preencheGridTarefas();

      // assuming our grid is stored in a variable called "myGrid":
      grid.on("RowClick", function(evt){
        var idx = evt.rowIndex;
        rowData = grid.getItem(idx);
        
      
        dojo.byId("nome").innerText = rowData.nome[0];
        dojo.byId("inicio").innerText = rowData.inicio[0];
        dojo.byId("fim").innerText = rowData.fim[0];
        dojo.byId("tempogasto").innerText = rowData.tempogasto[0];

        updateItem=true;
        selectedItem=idx;
              
        console.debug(rowData);
      }, true);

    });

  });
});


