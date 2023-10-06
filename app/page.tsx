'use client'
import { FC, useEffect, useState, KeyboardEvent } from 'react'
import axios from 'axios'
import styles from '@/styles/pages/home.module.sass'
import TodoItem from '@/components/TodoItem'
import { ITodo } from '@/interfaces/todo'

const Home: FC = () => {
  const [newTodo, setNewTodo] = useState<ITodo>({ text: '', completed: false, createdAt: new Date()})
  const [todos, setTodos] = useState<ITodo[]>([])

  const API_BASE_URL = 'https://todo-app-server-avw1.onrender.com/api/todos'

  useEffect(() => {
    getTodos()
  }, [])

  const getTodos = async (): Promise<void> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/getall`)
      const data = response.data.data
      setTodos(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách todos', error)
    }
  }

  const handleCreateTodo = async (): Promise<void> => {
    if (newTodo.text.trim()) {
      await axios.post(`${API_BASE_URL}/create`, newTodo)
      setNewTodo({...newTodo, text: ''})
      getTodos()
    }
  }

  const handleDeleteTodo = async (todo: ITodo): Promise<void> => {
    if (todo._id) {
      await axios.delete(`${API_BASE_URL}/delete/${todo._id}`)
      getTodos()
    }
  }

  const handleUpdateTodo = async (todo: ITodo): Promise<void> => {
    if (todo.text.trim()) {
      await axios.put(`${API_BASE_URL}/update`, todo)
      getTodos()
    }
  }
  
  const handleCompleteTodo = async (todo: ITodo): Promise<void> => {
    await axios.put(`${API_BASE_URL}/update`, todo)
    getTodos()
  }
  
  return (
    <div className={styles._container}>
      <h1 className={styles._title}>Todo App</h1>
      <div className={styles._form}>
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo.text}
          onChange={(e) => setNewTodo({...newTodo, text: e.target.value})}
          onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && handleCreateTodo()}
        />
        <button onClick={handleCreateTodo}>Add</button>
      </div>
      <div className={styles._list}>
        {todos.map(todo => (
          <TodoItem 
            key={todo._id} 
            todo={{
              _id: todo._id,
              text: todo.text,
              completed: todo.completed,
              createdAt: todo.createdAt
            }}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            onComplete={handleCompleteTodo}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
