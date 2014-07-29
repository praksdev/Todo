(function(todoapp) {
  var nextId = 1;
  var tdModel = function() {
    this.todos = {};
    this.listeners = [];
  }

  tdModel.prototype.addListener = function(listener) {
    this.listeners.push(listener);
  }

  tdModel.prototype.notifyListeners = function(change, param) {
    var that = this;
    this.listeners.forEach(function(listener) {
      listener(that, change, param);
    });
  }

  tdModel.prototype.setTodoState = function(id, completed) {
    if ( this.todos[id].completed != completed ) {
      this.todos[id].completed = completed;
      this.notifyListeners('stateChanged', id);
    }
  }

  tdModel.prototype.addTodo = function(text, completed) {
    var id = nextId++;
    this.todos[id]={'id': id, 'text': text, 'completed': completed};
    this.notifyListeners('added', id);
  }

  tdModel.prototype.clearTodos = function() {
    this.todos = {};
    this.notifyListeners('removed');
  }
  todoapp.tdModel = tdModel;

})(window);
