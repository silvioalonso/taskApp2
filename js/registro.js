var btnChange = true;
var arrTarefas = [];
var arr = [];
var store;
var grid
var emptyStore;
var updateItem=false;
var selectedItem;

var Registro = {
  tarefa:"",
  inicio: "",
  fim: ""
}

  function preencheGridTarefas(){

    require(['dojo/_base/lang', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
    function(lang, ItemFileWriteStore, dom){

      if (localStorage.getItem("Tarefas") !== null){

        var tarefas = localStorage.getItem("Registro");
        arrTarefas = eval(tarefas);

          if (arrTarefas!=null){

            var data = {
              id: "id",
              items: []
            };
                
            store = new ItemFileWriteStore({data: data});            

            for (var i = 0; i < arrTarefas.length; i++) {              
              var itemTarefa =  { id: i, nome: arrTarefas[i].nome,inicio:arrTarefas[i].inicio,fim:arrTarefas[i].fim}; 
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
   
      {'name': 'Nome', 'field': 'nome', 'width': '50%'},
      {'name': 'Inicio', 'field': 'inicio', 'width': '50%'},
      {'name': 'Fim', 'field': 'fim', 'width': '50%'}
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

        updateItem=true;
        selectedItem=idx;
              
        console.debug(rowData);
      }, true);

    });

  });
});




