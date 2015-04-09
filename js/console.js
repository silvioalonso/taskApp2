var btnChange = true;
var arrTarefas = [];
var arr = [];
var store;
var grid;
var gridTempo;
var emptyStore;
var updateItem=false;
var selectedItem;
var senha = "@123";
var idUsuario;
var idAuth=1;

var txtId ;
var txtNome;

var Tarefas = {
  identificador: "",
  nome:""
}


function atualizaArray(){

  if (localStorage.getItem("Tarefas") !== null){
    var tarefas = localStorage.getItem("Tarefas");  
    
    arr = eval(tarefas);
/*
    for (var i = 0; i < arr.length; i++) {
        arr[i].value = select.options[localStorage.getItem('txtTarefa')].selected = true;
    }
*/  

}

}

  
function salvaTarefa(id,nome){   

  if (updateItem){

    updateItem=false;
          
      arrTarefas[selectedItem].nome = dojo.byId("nome").value;
      arrTarefas[selectedItem].identificador=dojo.byId("identificador").value;

      localStorage.setItem("Tarefas", JSON.stringify(arrTarefas));                                     
         
  }else{

  if (localStorage.getItem("Tarefas") !== null){
    arrTarefas=eval(localStorage.getItem("Tarefas"));
  }

    arrTarefas.push({"identificador":id,"nome":nome});
    localStorage.setItem("Tarefas", JSON.stringify(arrTarefas));     
  }
 limpaCampos();
 preencheGridTarefas();
}

function preencheGridTarefas(){

  require(['dojo/_base/lang', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
    function(lang, ItemFileWriteStore, dom){

      if (localStorage.getItem("Tarefas") !== null){

        var tarefas = localStorage.getItem("Tarefas");
        arrTarefas = eval(tarefas);

        if (arrTarefas!=null){

            var data = {
              id: "id",
              items: []
            };
                
            store = new ItemFileWriteStore({data: data});            

            for (var i = 0; i < arrTarefas.length; i++) {              
              var itemTarefa =  { id: i, nome: arrTarefas[i].nome,identificador:arrTarefas[i].identificador}; 
              store.newItem(itemTarefa);            
            }

            grid.setStore(store);
          }       
      }
    }); 
  }



require(["dojo/ready"], function(ready){
  ready(function(){
  
    require(["dijit/form/Button", "dojo/dom", "dojo/domReady!"], function(Button, dom){
          
      var btnSave = new Button({  

        iconClass:'dijitEditorIcon dijitEditorIconSave', 
        showLabel: false,          
          onClick: function(){
                   
            var txtId = dojo.byId("identificador").value;
            var txtNome = dojo.byId("nome").value;


            salvaTarefa(txtId,txtNome);
            salvarTarefaRemoto(txtId,txtNome);

            
            preencheGridTarefas(); 
                             
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

              arrTarefas.splice(selectedItem, 1);
              localStorage.setItem("Tarefas", JSON.stringify(arrTarefas));                                   

            } 
          });
        }
        limpaCampos();            
      }
    }, "btnDelete").startup();

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
    emptyStore = new ItemFileWriteStore({data: data});

    /*set up layout*/
    var layout = [[
      {'name': 'Identificador', 'field': 'identificador', 'width': '50%'},
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

      // assuming our grid is stored in a variable called "myGrid":
      grid.on("RowClick", function(evt){
        var idx = evt.rowIndex;
        rowData = grid.getItem(idx);
        dojo.byId("nome").value=rowData.nome[0];
        dojo.byId("identificador").value=rowData.identificador[0];

        updateItem=true;
        selectedItem=idx;
              
        console.debug(rowData);
      }, true);

    });

  });
});

idUsuario=1;
id=1;

function salvarTarefaRemoto(identificador,nome){
  $.ajax({
    type: "POST",
    url:"http://localhost:8080/gko-taskapp-service/tarefa/salvar",


    data: {identificador:identificador,nome: nome,idUsuario:1, hash: $.md5(senha+identificador+nome)}


  }).error(function(){

  }).done(function(data){
    console.log(data);

      if(data.ajaxResult.codigo = 200){
        id = data.Tarefa.idAuth;
        salvaTarefa(identificador, nome, idAuth);
        console.log(data.ajaxResult.mensagem);

      }else if(data.ajaxResult.codigo = 501){
        salvaTarefa(identificador, nome);
        console.log(data.ajaxResult.mensagem);
      }
   
  });
   limpaCampos();
}


function editaTarefas(i, txtId, txtNome, sync){
  arrTarefas[i].identificador = txtId;
  arrTarefas[i].nome = txtNome;
  arrTarefas[i].isSync = sync;
  localStorage.setItem("Tarefas", JSON.stringify(arrTarefas));
  console.log(arrTarefas);
}

function editaTemposAjax(i, txtId, txtNome){
  $.ajax({
    type: "POST",
    url:"http://localhost:8080/gko-taskapp-service/tarefa/editar",
    data: {identificador:identificador,nome: nome,id:id}

  }).error(function(){
    editaTarefas(i, txtId, txtNome, false);

  }).done(function(data){
    editaTarefas(i, txtId, txtNome, true);
  });
}
