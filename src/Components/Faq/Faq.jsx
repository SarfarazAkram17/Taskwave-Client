import React from "react";

const Faq = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 my-12">
      <h1 className="mb-12 text-center text-4xl md:text-5xl font-bold">
        Frequently Asked Questions
      </h1>
      <div className="collapse collapse-arrow bg-base-200 border border-base-300 mb-2">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="collapse-title font-semibold">What is TaskWave?</div>
        <div className="collapse-content text-sm">
          TaskWave is an online platform that connects clients with skilled
          freelancers in areas like web development, design, writing, and more.
          You can post a task, receive bids, and hire the right freelancer in
          minutes.
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-200 border border-base-300 mb-2">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">
          How do I post a task?
        </div>
        <div className="collapse-content text-sm">
          Simply go to the "Add Task" page, fill in the task details like title,
          budget, deadline, and description, then submit. Your task will
          instantly become visible to available freelancers.
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-200 border border-base-300 mb-2">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">
          Can I edit a task after posting it?
        </div>
        <div className="collapse-content text-sm">
          Yes. You can edit task details such as description, deadline, or
          budget from your my posted tasks page.
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-200 border border-base-300 mb-2">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">
          Can freelancers apply for multiple tasks?
        </div>
        <div className="collapse-content text-sm">
          Absolutely. Freelancers can browse open tasks and apply to any number
          of tasks that match their skills and availability.{" "}
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-200 border border-base-300 mb-2">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">
          How do I delete my posted task?
        </div>
        <div className="collapse-content text-sm">
          To delete a task you’ve posted, go to your my posted tasks page and
          click the Delete button of the post you want to delete and next to it.
        </div>
      </div>
    </div>
  );
};

export default Faq;
