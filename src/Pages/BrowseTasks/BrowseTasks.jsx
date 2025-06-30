import React from "react";
import { useLoaderData } from "react-router";
import TaskCard from "../../Components/TaskCard/TaskCard";

const BrowseTasks = () => {
  const tasks = useLoaderData();
  return (
    <div className="my-12">
      <h1 className="text-center text-5xl font-bold mb-8">
        All Available Tasks
      </h1>
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">There is no tasks yet.</p>
      ) : (
        <div className="max-w-5xl mx-auto px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task}></TaskCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseTasks;
