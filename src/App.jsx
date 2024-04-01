import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App() {
  // State variables for managing todos
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState('');
  const [currentEditedItem, setCurrentEditedItem] = useState('');

  // Function to add a new todo
  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
  };

  // Function to delete a todo item
  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1); // Remove one element at index
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  // Function to mark a todo as completed
  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let completedOn =
      dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m ;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index); // Remove the completed todo from the main list
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
  };

  // Function to delete a completed todo
  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1); // Remove one element at index
    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  // Load todos from localStorage on component mount
  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  // Function to handle editing a todo item
  const handleEdit = (ind, item) => {
    setCurrentEdit(ind); // Set the index of the item being edited
    setCurrentEditedItem(item); // Set the item being edited
  };

  // Function to update the title of a todo item
  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };

  // Function to update the description of a todo item
  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };

  // Function to update a todo item after editing
  const handleUpdateToDo = () => {
    let newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem; // Update the edited item in the array
    setTodos(newToDo);
    setCurrentEdit(''); // Clear the current edit state
  };

  return (
    <div className="App">
      
      <h1><img src='Images\todo image.svg' width="60px" /><u>TO-DO APP</u></h1>

      <div className="todo-wrapper">
        {/* Todo Input Section */}
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title:</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter task title..."
            />
          </div>
          <div className="todo-input-item">
            <label>Description:</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter task description..."
            />  
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            ><b>Create</b>
            </button>
          </div>
        </div>

        {/* Toggle Buttons for Todo and Completed Screens */}
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        {/* Todo List Section */}
        <div className="todo-list">
          {isCompleteScreen === false &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                // Render editing form for the selected todo
                return (
                  <div className='edit__wrapper' key={index}>
                    <input
                      placeholder='Updated Title'
                      onChange={(e) => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      placeholder='Updated Description'
                      rows={2}
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                    />
                    <button
                      type="button"
                      onClick={handleUpdateToDo}
                      className="primaryBtn"
                    >
                      Update task
                    </button>
                  </div>
                );
              } else {
                // Render normal todo item
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    {/* Action Icons */}
                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTodo(index)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleComplete(index)}
                        title="Complete?"
                      />
                      <AiOutlineEdit
                        className="check-icon"
                        onClick={() => handleEdit(index, item)}
                        title="Edit?"
                      />
                    </div>
                  </div>
                );
              }
            })}

          {isCompleteScreen === true &&
            completedTodos.map((item, index) => {
              // Render completed todo items
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>
                  {/* Action Icon for deleting completed todo */}
                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo(index)}
                      title="Delete task?"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
