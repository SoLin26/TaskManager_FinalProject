const BASE_URL = "http://localhost:8080/api/tasks";

export const fetchTasks = async () => {
  const response = await fetch(BASE_URL);
  return await response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return await response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return await response.json();
};

export const markTaskAsDone = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: true }),
  });
  return await response.json();
};

export const updateTask = async (id, updatedData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  return await response.json();
};
