import React, { useContext, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { AuthContext } from "../../Authentication/AuthContext";

const TaskDetails = () => {
  const { user } = useContext(AuthContext);
  const userEmail = user?.email || user?.providerData?.[0]?.email;
  const loadedTask = useLoaderData();

  const [task, setTask] = useState(loadedTask);

  const handleBid = (id, email) => {
    fetch(`https://assignment-10-sarfaraz-akram.vercel.app/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount) {
          toast.success("You Bid successfully for this task");

          setTask((prevTask) => ({
            ...prevTask,
            bid: prevTask.bid + 1,
          }));
        } else {
          toast.error(data.message);
        }
      });
  };

  return (
    <div className="my-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to={-1}>
            <BsArrowLeftCircleFill size={22} />
          </Link>

          <h1 className="text-3xl">
            You bid for <span className="font-black rancho">{task.bid}</span> opportunities.
          </h1>
        </div>

        <h1 className="text-5xl mb-12 text-center">Task Details</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 text-center space-y-4 bg-base-200 border-2 border-gray-200 rounded-xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold">{task.title}</h1>
        <p className="text-xs font-semibold">{task.category}</p>
        <p>
          <strong>Deadline: </strong>
          {task.deadline}
        </p>
        <p>
          <strong>Budget: </strong>
          {task.budget}$
        </p>
        <p>
          <strong>Task Creator: </strong>
          {task.name}
        </p>
        <p>
          <strong>Assigned To (Email): </strong>
          {task.email}
        </p>
        <p>
          <strong>Description: </strong>
          {task.description}
        </p>

        <button
          onClick={() => handleBid(task._id, userEmail)}
          className="btn btn-info px-14 my-4 text-2xl rounded-full"
        >
          Bid Now
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;
