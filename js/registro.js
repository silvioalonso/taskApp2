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
    tempogasto: timeDiff
  }


function salvaTempos(nome,inicio,fim,tempogasto){   

  if (updateItem){
          
    updateItem=false;
          
    arrRegistros[selectedItem].nome=dojo.byId("nome").innerText;
    arrRegistros[selectedItem].inicio=dojo.byId("inicio").value;
    arrRegistros[selectedItem].fim=dojo.byId("fim").value;
    arrRegistros[selectedItem].tempogasto=dojo.byId("tempogasto").value;

    localStorage.setItem("tempos", JSON.stringify(arrRegistros));                                     
         
  }else{

    if (localStorage.getItem("tempos") !== null){
      arrRegistros=eval(localStorage.getItem("tempos"));
  }

    arrRegistros.push({"nome":nome,"inicio":inicio,"fim":fim,"tempogasto":tempogasto});
    localStorage.setItem("tempos", JSON.stringify(arrRegistros));     

  }
  preencheGridRegistros();
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
                var tg =arrRegistros[i].tempogasto;
                var itemTarefa =  { id: i, nome: arrRegistros[i].nome,inicio:arrRegistros[i].inicio,fim:arrRegistros[i].fim,tempogasto:moment(tg).format(timeFormat).split(",")[1]}; 
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
        //dojo.byId("inicio").innerText = rowData.inicio[0];
        //dojo.byId("fim").innerText = rowData.fim[0];
        //dojo.byId("tempogasto").innerText = rowData.tempogasto[0];

         //dojo.byId("nome").value = rowData.nome[0];
         dojo.byId("inicio").value=rowData.inicio[0];
         dojo.byId("fim").value=rowData.fim[0];
         dojo.byId("tempogasto").value=rowData.tempogasto[0];

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
          

          txtNome = dojo.byId("nome").value;
          txtInicio = dojo.byId("inicio").value;
          txtFim =dojo.byId("fim").value;
          txtTempoGasto =dojo.byId("tempogasto").value;

                   
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
}


