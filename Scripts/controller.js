var controller = function() {
  var model = new tdModel(),
      form = document.querySelector('form'),
      list = document.querySelector('#list'),
      todoTemplate = document.querySelector('#templates > [data-name="list"]'),
      /**
        * initialize the controller to add logic for each of the handlers
      **/
      init = function(calKeys) {
          registerKeys(calKeys);
          updateCounters(model);
      },
      /**
        * Calculate and track teh count of remaining and total items in Todo list.
      **/
      updateCounters = function(model) {
        var count = 0,
            notDone = 0,
            remaining = document.getElementById('remaining'),
            total = document.getElementById('length');
            countElem = document.getElementById('count');
        for (var id in model.todos) {
          count++;
          if ( ! model.todos[id].completed ) {
            notDone ++;
          }
        }
        remaining.innerHTML = notDone;
        total.innerHTML = count;
        (count >= 1) ? countElem.classList.remove('count') : countElem.classList.add('count');
      },
      /**
        * Update the item element in regards to its state and description from the model.
      **/
      updateItems = function(model) {
        var todoElement = list.querySelector('li[data-id="'+model.id+'"]');
        if (todoElement) {
          var checkbox = todoElement.querySelector('input[type="checkbox"]');
          var desc = todoElement.querySelector('span');
          checkbox.checked = model.completed;
          desc.innerText = model.text;
          desc.className = "done-"+model.completed;
        }
      },
      /**
       * clone from the template, set its Id and add it to the DOM,
       * Add a listener to the newly added checkbox, so it can trigger the state flip
       * when the checkbox is clicked.
       **/
      drawItems = function(todoObj, container) {
        var el = todoTemplate.cloneNode(true);
        el.setAttribute('data-id', todoObj.id);
        container.appendChild(el);
        updateItems(todoObj);
        var checkbox = el.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function(e) {
          model.setTodoState(todoObj.id, e.target.checked);
        });
      },
      /**
       * update the list based on the changes
      **/
      showUpdatedUI = function(data, status, value) {
        var items;
        list.innerHTML='';
        //filter items based  on its status
        function filterItems(items, value) {
              var result = [];
              for(var id in items){
                if(items[id].hasOwnProperty("completed") && 
                   items[id].completed === value){
                  result.push(items[id]);
                }
              }
              return result;
        };
        if(status == "completed") {
          items = filterItems(data, value)
        }else{
          items = data
        }
        for (var id in items) {
          drawItems(items[id], list);
        }
      },
      registerKeys = function(inputs) {
        //attach event handlers for each of the links
        for(var i=0;i<inputs.length;i++) {
              inputs[i].addEventListener("click", handleCalcKey, false);
          }
        //add a new item and clear input
        form.addEventListener('submit', function(e) {
          var textEl = e.target.querySelector('input[type="text"]');
          model.addTodo(textEl.value, false);
          textEl.value=null;
          e.preventDefault();
        });
      },
      /**
        * handle  each of the links in the footer
      **/
      handleCalcKey = function(e) {
        var button = (e.target) ? e.target : e.srcElement,
            btnVal = button.innerHTML,
            data = model.todos;
        //sort the inorder list in reverse fashion
        function sort (data){
          var sortedArray = Object.keys(data).sort(function(a,b){
                return parseInt(b) - parseInt(a);
              }).map(function(sortedKeys){
              return data[sortedKeys];
          });
          return sortedArray;
        };
        switch (btnVal) {
          case 'Active':
              showUpdatedUI(data, 'completed', false);
              break;
          case 'Completed':
              showUpdatedUI(data, 'completed', true);
              break;
          case 'Sort by latest':
              var rev = sort(data);
              showUpdatedUI(rev);
              break;
          case 'Clear List':
              model.clearTodos();
              break;
          case 'All':
              showUpdatedUI(data);
               break;
        }
        // prevent page jumps
        e.preventDefault();
      };
      /**
        * Based on changes in the model and trigger the appropriate changes in the view
      **/
      model.addListener(function(model, changeType, param) {
        if (changeType ==='removed') {
          showUpdatedUI();
        } else if ( changeType === 'added' ) {
          drawItems(model.todos[param], list);
        } else if ( changeType === 'stateChanged') {
          updateItems(model.todos[param]);
        }
        updateCounters(model);
      });
  return {
    init : init
  };
}();