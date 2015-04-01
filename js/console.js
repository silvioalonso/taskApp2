var btnChange = true;
var arrTarefas = [];
var arr = [];
var store;
var grid;
var gridTempo;
var emptyStore;
var updateItem=false;
var selectedItem;
var txtNome;

var Tarefas = {
  identificador: "",
  nome:""
}

var Lista = {
  data: "",
  tarefa:"",
  inicio: "",
  fim: ""
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

function montaLista() {

  atualizaArray();
  
  Lista.data = dojo.byId("data").value;
  Lista.tarefa = dojo.byId("nome").value;
  Lista.inicio = dojo.byId("inicio").value;
  Lista.fim = dojo.byId("fim").value;

  var resultado = "<ol>";

    for (i in arr){
      container = container + "<li>" +"Data :"+ arr[i].data + " - " +"Tarefa :"+ arr[i].tarefa + " - " +"Inicio :"+ arr[i].inicio + " - " +"Fim :"+ arr[i].fim + "</li>";
    }

    resultado = container + "</ol>";

  el = dojo.byId("resultado");
  el.innerHTML = resultado;
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}
  
function salvaTarefa(id,nome){   

  if (updateItem){
          
    updateItem=false;
          
      arrTarefas[selectedItem].nome=dojo.byId("nome").value;
      arrTarefas[selectedItem].identificador=dojo.byId("identificador").value;

      localStorage.setItem("Tarefas", JSON.stringify(arrTarefas));                                     
         
  }else{

    if (localStorage.getItem("Tarefas") !== null){
      arrTarefas=eval(localStorage.getItem("Tarefas"));
  }

    arrTarefas.push({"identificador":id,"nome":nome});
    localStorage.setItem("Tarefas", JSON.stringify(arrTarefas));     

  }
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
          salvar(txtId,txtNome);

          syncTarefas();
          preencheGridTarefas(); 
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

              arrTarefas.splice(selectedItem, 1);
              localStorage.setItem("Tarefas", JSON.stringify(arrTarefas));                                   

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
            syncTarefas();                               
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




function salvar(identificador,nome){
  $.ajax({
    type: "POST",
    url:"http://localhost:8080/gko-taskapp-service/tarefa/salvar",
    data: {identificador:identificador,nome: nome}


  }).error(function(){

          //txtId = dojo.byId("identificador").value;
          txtNome = dojo.byId("nome").valu.value;
        
        salvaTarefa(txtNome);


  }).done(function(data){
      identificador = data.tarefa.identificador;

          //txtId = dojo.byId("identificador").value;
          txtNome = dojo.byId("nome").value;
 
      salvaTarefa(txtNome);
      syncTarefas();
  });
}

function syncTarefas(){
  
  for(var i = 0; i < arrTarefas.length; i++){
    if(arrTarefas[i].identificador == null){
      salvar(arrTarefas[i].identificador,arrTarefas[i].nome);
      arrTarefas.splice(i,1);
    }
  }
}

