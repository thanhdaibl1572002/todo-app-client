import { FC, useState, useCallback, KeyboardEvent, MouseEvent } from 'react'
import styles from '@/styles/components/TodoItem.module.sass'
import { ITodo } from '@/interfaces/todo'

interface ITodoItem {
  todo: ITodo
  onUpdate?: (todo: ITodo) => void
  onDelete?: (todo: ITodo) => void
  onComplete?: (todo: ITodo) => void
}

const TodoItem: FC<ITodoItem> = ({ todo, onUpdate, onDelete, onComplete }) => {
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [editTodo, setEditTodo] = useState<ITodo>(todo)

  const updateTodo = useCallback((): void => {
    onUpdate && onUpdate(editTodo)
    setShowEditForm(false)
  }, [onUpdate, editTodo])

  const deleteTodo = useCallback((): void => {
    onDelete && onDelete(todo)
  }, [onDelete, todo])

  const completeTodo = useCallback((): void => {
    onComplete && onComplete({ ...todo, completed: true })
  }, [onComplete, todo])

  return (
    <div className={styles._container}>
      <div className={styles._todo} style={{
        borderLeft: todo.completed ? '5px solid green' : '5px solid red'
      }}>
        {showEditForm ? (
          <>
            <input
              className={styles._edit}
              type="text"
              onChange={e => setEditTodo({ ...editTodo, text: e.target.value })}
              onKeyUp={e => e.key === 'Enter' && updateTodo()}
              placeholder='Edit todo here'
            />
            <button className={styles._complete} onClick={updateTodo}>&#10003;</button>
          </>
        ) : (
          <>
            <div className={styles._text}>
              {todo.text}
              <span className={styles._created__at}>
                ({todo.createdAt.toLocaleString().substring(0, 10)})
              </span>
            </div>
            <div className={styles._action}>
              {!todo.completed && (
                <>
                  <button className={styles._complete} onClick={completeTodo}>&#10003;</button>
                  <button className={styles._edit} onClick={() => setShowEditForm(true)}>&#9998;</button>
                </>
              )}
              <button className={styles._delete} onClick={deleteTodo}>&#10007;</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TodoItem