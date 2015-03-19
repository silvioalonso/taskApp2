  var btnChange = true;
  var arrTarefas = [];
var arr = [];
var Tarefas = {
  id: "",
  nome:""
}


  function atualizaArray(){

    if (localStorage.getItem("tarefas") !== null){
      var tarefas = localStorage.getItem("tarefas");
      arrTarefas = eval(tarefas);
    }
  }
  
  function salvaTarefa(id,nome){
    arrTarefas.push([id,nome]);
    localStorage.setItem("Tarefas", JSON.stringify(arrTarefas));
    atualizaArray();
    alert(arrTarefas);
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
