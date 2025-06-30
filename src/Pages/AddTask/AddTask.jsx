import React, { useContext } from "react";
import { AuthContext } from "../../Authentication/AuthContext";
import { toast } from "react-toastify";

const AddTask = () => {
  const { user } = useContext(AuthContext);
  const userEmail = user.email || user.providerData[0]?.email;

  const today = new Date().toLocaleDateString("en-CA");

  const handleAddTask = (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const task = Object.fromEntries(formData.entries());
    task.bid = 0
    task.bidders = []
    fetch("https://assignment-10-sarfaraz-akram.vercel.app/tasks", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          toast.success("Task added successfully");
          form.reset();
        }
      });
  };

  return (
    <div className="px-3">
      <div className="max-w-5xl px-8 py-16 mx-auto rounded-lg my-12 bg-base-200">
      <h1 className="text-center text-4xl md:text-5xl mb-8 font-bold">
        Add New Task
      </h1>
      <p className="max-w-2xl md:max-w-3xl leading-5 mx-auto text-center text-xs md:text-sm mb-12">
        Welcome to the Add Task page! Here, you can quickly post a task and
        connect with skilled freelancers on TaskWave. Whether you need help with
        web development, design, writing, or marketing — just fill out the form
        with your task details, budget, and deadline. We'll match you with
        qualified freelancers who are ready to get the job done.
        <br />
        Make sure to provide clear and concise information to attract the best
        talent for your task!
      </p>
      <form onSubmit={handleAddTask}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <fieldset className="fieldset">
            <label className="label font-bold text-sm">User Email</label>
            <input
              type="email"
              value={userEmail}
              readOnly
              name="email"
              required
              className="input w-full bg-base-100 placeholder:text-xs placeholder:font-semibold h-8"
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label font-bold text-sm">User Name</label>
            <input
              type="text"
              value={user.displayName}
              readOnly
              name="name"
              required
              className="input w-full bg-base-100 placeholder:text-xs placeholder:font-semibold h-8"
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label font-bold text-sm">Task Title</label>
            <input
              type="text"
              name="title"
              required
              className="input w-full bg-base-100 placeholder:text-xs placeholder:font-semibold h-8"
              placeholder="Enter Task Title"
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label font-bold text-sm">Category</label>
            <select
              defaultValue=""
              name="category"
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
              className="input w-full bg-base-100 placeholder:text-xs placeholder:font-semibold h-8"
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label font-bold text-sm">Budget</label>
            <input
              type="number"
              name="budget"
              required
              className="input w-full bg-base-100 placeholder:text-xs placeholder:font-semibold h-8"
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
              required
              className="input w-full bg-base-100 placeholder:text-xs placeholder:font-semibold h-8"
              placeholder="Enter Description"
            />
          </fieldset>
        </div>

        <button className="w-full btn mt-12 text-2xl md:text-3xl btn-info rounded-full">
          Add Task
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddTask;
