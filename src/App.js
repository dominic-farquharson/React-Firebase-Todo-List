import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = {
      todos: {}
    };
    this.deleteTodo = this.deleteTodo.bind(this);
    this.handleNewTodoInput = this.handleNewTodoInput.bind(this);
    this.renderTodoList = this.renderTodoList.bind(this);
  }
  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    axios({url: '/todos.json', baseURL: 'https://todo-34eb3.firebaseio.com/', method: "GET"}).then((response) => {
      this.setState({todos: response.data});
    }).catch((error) => {
      console.log(error);
    });
  }

  createTodo(todoText) {
    let newTodo = {
      title: todoText,
      createdAt: new Date
    };

    axios({url: '/todos.json', baseURL: 'https://todo-34eb3.firebaseio.com/', method: "POST", data: newTodo}).then((response) => {
      let todos = this.state.todos;
      let newTodoId = response.data.name;
      todos[newTodoId] = newTodo;
      this.setState({todos: todos});
    }).catch((error) => {
      console.log(error);
    });
  }
  deleteTodo(todoId) {
    axios({url: `/todos/${todoId}.json`, baseURL: 'https://todo-34eb3.firebaseio.com/', method: "DELETE"}).then((response) => {
      let todos = this.state.todos;
      delete todos[todoId];
      this.setState({todos: todos});
    }).catch((error) => {
      console.log(error);
    });
  }

  handleNewTodoInput(event) {
    if (event.charCode === 13) {
      this.createTodo(event.target.value);
      event.target.value = "";
    }
  }

  renderTodoList() {
    let todoElements = [];

    for (let todoId in this.state.todos) {
      let todo = this.state.todos[todoId]

      todoElements.push(
        <div className="todo d-flex justify-content-between pb-4" key={todoId}>
          <div className="mt-2">
            <h4>{todo.title}</h4>
            <div>{moment(todo.createdAt).calendar()}</div>
          </div>
          <button className="ml-4 btn btn-link" onClick={() => {
            this.deleteTodo(todoId)
          }}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }

    return (
      <div className="todo-list">
        {todoElements}
      </div>
    );
  }

  renderNewTodoBox() {
    return (
      <div className="new-todo-box pb-2">
        <input className="w-100" placeholder="What do you have to do?" onKeyPress={this.handleNewTodoInput}/>
      </div>
    );
  }

  render() {
    return (
      <div className="App container-fluid">
        <div className="row pt-3">
          <div className="col-6 px-4">
            {this.renderNewTodoBox()}
            {this.renderTodoList()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
