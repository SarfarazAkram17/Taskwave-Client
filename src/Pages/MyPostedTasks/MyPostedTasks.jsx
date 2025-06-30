import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Authentication/AuthContext";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";

const MyPostedTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = user?.email || user?.providerData?.[0]?.email;

  useEffect(() => {
    if (userEmail) {
      fetch(
        `https://assignment-10-sarfaraz-akram.vercel.app/tasks/email/${userEmail}`
      )
        .then((res) => res.json())
        .then((data) => {
          setTasks(data);
          setLoading(false);
        });
    }
  }, [userEmail]);

  const handleTaskDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://assignment-10-sarfaraz-akram.vercel.app/tasks/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount) {
              toast.success("You successfully deleted the task");
              const remainingTasks = tasks.filter((task) => task._id !== id);
              setTasks(remainingTasks);
            }
          });
      }
    });
  };
  return (
    <div className="my-12 px-2">
      {loading ? (
        <div className="flex justify-center h-[30vh] items-center">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : tasks.length === 0 ? (
        <div>
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-8">
            My Posted Tasks: {tasks.length}
          </h1>
          <p className="text-center text-gray-500 text-lg">
            You haven’t posted any tasks yet.
          </p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto overflow-hidden">
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-8">
            My Posted Tasks: {tasks.length}
          </h1>
          <div className="overflow-hidden rounded-lg">
            <table className="table-auto w-full border-collapse border-2 overflow-hidden border-gray-200">
              <thead className="bg-gray-100 text-gray-800 text-left text-lg">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3 hidden md:table-cell">Category</th>
                  <th className="p-3 hidden md:table-cell">Budget</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-b-2 border-gray-200">
                    <td className="p-3 font-bold">{task.title}</td>
                    <td className="p-3 hidden md:table-cell">
                      {task.category}
                    </td>
                    <td className="p-3 hidden md:table-cell">${task.budget}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <Link to={`/updateTask/${task._id}`}>
                        <button className="bg-[#3C393B] btn text-lg rounded-sm my-2 px-2.5 block text-white">
                          <MdEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleTaskDelete(task._id)}
                        className="bg-[#EA4744] btn text-lg rounded-sm my-2 px-2.5 block text-white"
                      >
                        <MdDelete />
                      </button>
                      <button
                        data-tooltip-id={`bid_Info_${task._id}`}
                        className="btn-info btn text-xl shadow-none rounded-sm my-2 px-2.5 block"
                      >
                        Bids
                      </button>
                      <Tooltip
                        id={`bid_Info_${task._id}`}
                        className="font-bold"
                        content={`Total Bid: ${task.bid}`}
                        events={"click"}
                        place="left"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPostedTasks;
