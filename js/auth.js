var btnChange = true;
var arrAuth = [];
var arr = [];
var store;
var grid;
var gridAuth=1;
var emptyStore;
var updateItem=false;
var selectedItem;
var token ;

var idTarefa;

var txtEmail ;
var txtToken;

var Auth = {
  email: "",
  token:""
}


function atualizaArray(){

  if (localStorage.getItem("Auth") !== null){
    var auth = localStorage.getItem("Auth");  
    
    arr = eval(auth);
/*
    for (var i = 0; i < arr.length; i++) {
        arr[i].value = select.options[localStorage.getItem('txtTarefa')].selected = true;
    }
*/  

}

}

  
function salvaAuth(email,token){   

  if (updateItem){

    updateItem=false;
          
      arrAuth[selectedItem].email = dojo.byId("email").value;
      arrAuth[selectedItem].token=dojo.byId("token").value;

      localStorage.setItem("Auth", JSON.stringify(arrAuth));                                     
         
  }else{

  if (localStorage.getItem("Auth") !== null){
    arrAuth=eval(localStorage.getItem("Auth"));
  }

    arrAuth.push({"email":email,"token":token});
    localStorage.setItem("Auth", JSON.stringify(arrAuth));     
  }
 limpaCampos();
 preencheGridAuth();
}

function preencheGridAuth(){

  require(['dojo/_base/lang', 'dojo/data/ItemFileWriteStore', 'dojo/dom', 'dojo/domReady!'],
    function(lang, ItemFileWriteStore, dom){

      if (localStorage.getItem("Auth") !== null){

        var auth = localStorage.getItem("Auth");
        arrAuth = eval(auth);

        if (arrAuth!=null){

            var data = {
              id: "id",
              items: []
            };
                
            store = new ItemFileWriteStore({data: data});            

            for (var i = 0; i < arrAuth.length; i++) {              
              var itemAuth =  { id: i, email: arrAuth[i].email,token:arrAuth[i].token}; 
              store.newItem(itemAuth);            
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
                   
            txtEmail = dojo.byId("email").value;
            txtToken = dojo.byId("token").value;


            salvaAuth(txtEmail,txtToken);
            salvarAuthRemoto(txtEmail,txtToken);

            
            preencheGridAuth(); 
                             
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
              localStorage.setItem("Auth", JSON.stringify(arrAuth));                                   

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
      {'name': 'Email', 'field': 'email', 'width': '50%'},
      {'name': 'Token', 'field': 'token', 'width': '50%'}
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
      preencheGridAuth();

      // assuming our grid is stored in a variable called "myGrid":
      grid.on("RowClick", function(evt){
        var idx = evt.rowIndex;
        rowData = grid.getItem(idx);
        dojo.byId("email").value=rowData.email[0];
        dojo.byId("token").value=rowData.token[0];

        updateItem=true;
        selectedItem=idx;
              
      }, true);

    });

  });
});

idUsuario=1;
id=1;

function salvarAuthRemoto(email,token){
  $.ajax({
    type: "POST",
    url:"http://localhost:8080/gko-taskapp-service/auth/salvar",


    data: {email:emaiol,token: token,idUsuario:1, hash: $.md5(token+email+idUsuario)}


  }).error(function(){

  }).done(function(data){

      if(data.ajaxResult.codigo = 200){
        id = data.Auth.id;
        salvaAuth(email, token, id);
        console.log(data.ajaxResult.mensagem);

      }else if(data.ajaxResult.codigo = 501){
        salvaAuth(email, token);
        console.log(data.ajaxResult.mensagem);
      }
   
  });
   limpaCampos();
}


function editaAuth(i, txtEmail, txtToken, sync){
  arrAuth[i].email = txtEmail;
  arrAuth[i].nome = txtToken;
  arrAuth[i].isSync = sync;
  localStorage.setItem("Auth", JSON.stringify(arrAuth));
  console.log(arrTarefas);
}

function editaAuthAjax(i, txtEmail, txtToken){
  $.ajax({
    type: "POST",
    url:"http://localhost:8080/gko-taskapp-service/auth/editar",
    data: {email:email,token: token,id:id}

  }).error(function(){
    editaAuth(i, txtEmail, txtToken, false);

  }).done(function(data){
    editaAuth(i, txtEmail, txtToken, true);
  });
}
