import React, { useState, useEffect } from 'react';

const ActiveTasksList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchActiveTasks = async () => {
    try {
      const response = await fetch('/api/tasks/active'); 
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Помилка при оновленні завдань:', error);
    }
  };

  useEffect(() => {
    fetchActiveTasks();

    const intervalId = setInterval(() => {
      fetchActiveTasks();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="tasks-container">
      <h3>Активні завдання</h3>
      {tasks.length === 0 ? (
        <p>Немає активних завдань</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.title} - <span>{task.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveTasksList;