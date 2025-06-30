import React from "react";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { Link, useLoaderData } from "react-router";
import { toast } from "react-toastify";

const UpdateTask = () => {
  const task = useLoaderData();

  const today = new Date().toLocaleDateString("en-CA");

  const handleUpdateTask = (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const updatedTask = Object.fromEntries(formData.entries());

    fetch(`https://assignment-10-sarfaraz-akram.vercel.app/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount) {
          toast.success("Task updated successfully!");
        }
      });
  };

  return (
    <div className="px-3">
        <div className="max-w-5xl mx-auto mt-12">
                    <Link to={-1}>
          <BsArrowLeftCircleFill size={22} />
        </Link>
        </div>
      <div className="max-w-5xl px-8 py-16 mx-auto rounded-lg my-12 bg-base-200">
        <h1 className="text-center text-4xl md:text-5xl mb-8 font-bold">
          Update Your Task
        </h1>
        <p className="max-w-2xl md:max-w-3xl leading-5 mx-auto text-center text-xs md:text-sm mb-12">
          Update the details of your posted task to keep them accurate and
          up-to-date. Whether you need to change the title, description,
          deadline, or any other information — this page lets you easily modify
          your task and ensure it reflects your current needs.
        </p>

        <form onSubmit={handleUpdateTask}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <fieldset className="fieldset">
              <label className="label font-bold text-sm">User Email</label>
              <input
                type="email"
                defaultValue={task.email}
                readOnly
                name="email"
                required
                className="input w-full bg-base-100 h-8"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label font-bold text-sm">User Name</label>
              <input
                type="text"
                defaultValue={task.name}
                readOnly
                name="name"
                required
                className="input w-full bg-base-100 h-8"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label font-bold text-sm">Task Title</label>
              <input
                type="text"
                name="title"
                defaultValue={task.title}
                required
                className="input w-full bg-base-100 h-8"
                placeholder="Enter Task Title"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label font-bold text-sm">Category</label>
              <select
                name="category"
                defaultValue={task.category}
                required
                className="select w-full bg-base-100"
              >
                <option disabled value="">
                  Pick a Category
                </option>
                <option>Web Development</option>
                <option>Graphic Design</option>
                <option>Content Writing</option>
                <option>Digital Marketing</option>
                <option>Mobile App Development</option>
                <option>Video Editing</option>
                <option>SEO Optimization</option>
                <option>Virtual Assistance</option>
                <option>UI/UX Design</option>
                <option>Data Entry</option>
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <label className="label font-bold text-sm">Deadline</label>
              <input
                type="date"
                name="deadline"
                required
                min={today}
                defaultValue={task.deadline}
                className="input w-full bg-base-100 h-8"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label font-bold text-sm">Budget</label>
              <input
                type="number"
                name="budget"
                defaultValue={task.budget}
                required
                className="input w-full bg-base-100 h-8"
                placeholder="Enter Task Budget"
              />
            </fieldset>

            <fieldset className="fieldset md:col-span-2">
              <label className="label font-bold text-sm">
                Description (what needs to be done)
              </label>
              <input
                type="text"
                name="description"
                defaultValue={task.description}
                required
                className="input w-full bg-base-100 h-8"
                placeholder="Enter Description"
              />
            </fieldset>
          </div>

          <button className="w-full btn mt-12 text-2xl md:text-3xl btn-info rounded-full">
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;
