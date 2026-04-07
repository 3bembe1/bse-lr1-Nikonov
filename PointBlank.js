import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const useActiveTasks = (userId, projectId) => {
  const [tasks, setTasks] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      query: { userId, projectId }
    });

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on('connect_error', (err) => {
      setIsConnected(false);
      setError('Втрачено з\'єднання з сервером. Намагаємось відновити...');
      console.error('Socket error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socket.on('tasks:update', (updatedTasks) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('tasks:update');
      socket.disconnect();
    };
  }, [userId, projectId]);

  return { tasks, isConnected, error };
};

import React from 'react';
import { useActiveTasks } from './hooks/useActiveTasks';

const ActiveTasksBoard = ({ currentUser, currentProject }) => {
  const { tasks, isConnected, error } = useActiveTasks(currentUser.id, currentProject.id);

  return (
    <div className="tasks-board">
      <div className="board-header">
        <h2>Активні завдання</h2>
        {/* Індикатор Real-time статусу */}
        <div className={`connection-status ${isConnected ? 'online' : 'offline'}`}>
          <span className="status-dot"></span>
          {isConnected ? 'Оновлюється наживо' : 'Офлайн'}
        </div>
      </div>

      {/* Відображення помилок мережі, якщо вони є */}
      {error && <div className="error-banner">{error}</div>}

      <div className="tasks-list-container">
        {tasks.length === 0 ? (
          <p className="empty-state">У цьому спринті поки немає активних завдань.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <span className="task-key">{task.ticketNumber}</span>
                <span className="task-title">{task.title}</span>
                <span className={`task-status status-${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ActiveTasksBoard;