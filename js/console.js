  var btnChange = true;
  var arrTarefas = [];
  var arr = [];
  var store;
  var grid;

  var Tarefas = {
    id: "",
    nome:""
  }
  
  function salvaTarefa(id,nome){   

    if (localStorage.getItem("Tarefas") !== null){
        arrTarefas=eval(localStorage.getItem("Tarefas"));
        
        if(arrTarefas==null){
          arrTarefas=[];  
        }

        localStorage.setItem("Tarefas",[]);
    }

    arrTarefas.push({"id":id,"nome":nome});
    localStorage.setItem("Tarefas", JSON.stringify(arrTarefas));     

    preencheGridTarefas();
 }

  function preencheGridTarefas(){

    if (localStorage.getItem("Tarefas") !== null){

        var tarefas = localStorage.getItem("Tarefas");
        arrTarefas = eval(tarefas);

        if (arrTarefas!=null){

          for (var i = 0; i < arrTarefas.length; i++) {
            var itemTarefa =  { id: i, nome: arrTarefas[i].nome}; 

            store.newItem(itemTarefa);
          }
        }       
    }
  }



require(["dojo/ready"], function(ready){
  ready(function(){
  
    require(["dijit/form/Button", "dojo/dom", "dojo/domReady!"], function(Button, dom){
          
      var btnSave = new Button({  

        iconClass:'dijitEditorIcon dijitEditorIconSave', 
        showLabel: false,          
        onClick: function(){
        
            var txtId = dojo.byId("id").value;
            var txtNome = dojo.byId("nome").value;

              salvaTarefa(txtId,txtNome);
              preencheGridTarefas(); 
              limpaCampos();                 
            }
          }, "btnSave").startup();


          var btnDelete = new Button({  

              iconClass:'dijitEditorIcon dijitEditorIconDelete', 
              showLabel: false,          
              onClick: function(){
                  cleanLocalStorage();                               
             }
          }, "btnDelete").startup();

      var btnClear = new Button({  

          iconClass:'dijitEditorIcon dijitEditorIconClear', 
          showLabel: false,          
          onClick: function(){
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
}

function cleanLocalStorage() {
    for(key in localStorage) {
        delete localStorage[key];
    }
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

    /*set up layout*/
    var layout = [[
      {'name': 'ID', 'field': 'id', 'width': '50%'},
      {'name': 'Nome', 'field': 'nome', 'width': '50%'}
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
});


  });
});


/*
             { col1: "normal", col2: false, id: 1},
                { col1: "important", col2: false, id: 2},
                { col1: "important", col2: false, id: 3}
   

*/   