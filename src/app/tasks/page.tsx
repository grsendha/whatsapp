"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { addTask } from "../../../convex/tasks";

const TaskPage = () => {
  const tasks = useQuery(api.tasks.getTasks);
  const update = useMutation(api.tasks.completeTask);
  const deleteTask = useMutation(api.tasks.deleteTask);
  return (
    <div className="p-10 flex flex-col flex-end">
      {
        tasks?.map((task) => (
          <div key={task._id} className="flex gap-2">
            <input type="checkbox" checked={task.completed} onClick={() => update({ id: task._id })} />
            <span>{task.text}</span>
            <button onClick={() => deleteTask({ id: task._id })}>Delete</button>
          </div>
        ))
      }
    </div>
  )
}

export default TaskPage