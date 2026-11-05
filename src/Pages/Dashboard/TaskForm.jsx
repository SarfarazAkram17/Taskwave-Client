import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { LuArrowLeft } from "react-icons/lu";
import { toast } from "react-toastify";
import { api } from "../../lib/api";
import { useAsync } from "../../lib/useAsync";
import { CATEGORY_NAMES } from "../../lib/constants";
import { todayISO } from "../../lib/format";
import { useAuth } from "../../Authentication/useAuth";
import PageHeader from "../../Components/ui/PageHeader";
import Field from "../../Components/ui/Field";
import DatePicker from "../../Components/ui/DatePicker";
import { ErrorState, PageLoader } from "../../Components/ui/Feedback";

const Form = ({ task }) => {
  const navigate = useNavigate();
  const editing = !!task;
  const [form, setForm] = useState({
    title: task?.title || "",
    category: task?.category || "",
    budget: task?.budget ?? "",
    deadline: task?.deadline || "",
    description: task?.description || "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 5)
      e.title = "Give the task a title of at least 5 characters.";
    if (!form.category) e.category = "Pick a category.";
    if (!(Number(form.budget) > 0)) e.budget = "Enter a budget greater than 0.";
    if (!form.deadline) e.deadline = "Choose a deadline.";
    else if (form.deadline < todayISO() && form.deadline !== task?.deadline)
      e.deadline = "The deadline can't be in the past.";
    if (form.description.trim().length < 20)
      e.description = "Describe the task in at least 20 characters.";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const payload = {
        ...form,
        budget: Number(form.budget),
        title: form.title.trim(),
        description: form.description.trim(),
      };
      if (editing) {
        // Only send what changed so an old deadline never blocks a small edit.
        Object.keys(payload).forEach(
          (k) => String(payload[k]) === String(task[k]) && delete payload[k],
        );
        if (!Object.keys(payload).length) {
          toast.info("No changes to save");
          return;
        }
        await api.put(`/tasks/${task._id}`, payload);
        toast.success("Task updated");
        navigate(`/dashboard/tasks/${task._id}`);
      } else {
        const created = await api.post("/tasks", payload);
        toast.success("Task posted. Freelancers can now send proposals.");
        navigate(`/dashboard/tasks/${created._id}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        back={
          <Link
            to={
              editing ? `/dashboard/tasks/${task._id}` : "/dashboard/my-tasks"
            }
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-3"
          >
            <LuArrowLeft size={16} />
            {editing ? "Back to task" : "My tasks"}
          </Link>
        }
        title={editing ? "Edit task" : "Post a task"}
        description={
          editing
            ? "Changes are visible to freelancers immediately."
            : "Clear details attract better proposals. You can edit the task until you accept a proposal."
        }
      />
      <form
        onSubmit={submit}
        noValidate
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] items-start"
      >
        <div className="card card-pad !p-5 sm:!p-6 grid gap-5 sm:grid-cols-2">
          <Field
            label="Task title"
            error={errors.title}
            className="sm:col-span-2"
            hint="Example: Design a logo for a bakery"
          >
            {(p) => (
              <input
                {...p}
                className="input"
                value={form.title}
                onChange={set("title")}
                maxLength={120}
                placeholder="What do you need done?"
              />
            )}
          </Field>
          <Field label="Category" error={errors.category}>
            {(p) => (
              <select
                {...p}
                className="select"
                value={form.category}
                onChange={set("category")}
              >
                <option value="" disabled>
                  Pick a category
                </option>
                {CATEGORY_NAMES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Budget ($)" error={errors.budget}>
            {(p) => (
              <input
                {...p}
                className="input"
                type="number"
                min="1"
                step="any"
                inputMode="decimal"
                value={form.budget}
                onChange={set("budget")}
                placeholder="e.g. 250"
              />
            )}
          </Field>
          <Field
            label="Deadline"
            error={errors.deadline}
            className="sm:col-span-2"
          >
            {(p) => (
              <DatePicker
                {...p}
                min={todayISO()}
                value={form.deadline}
                placeholder="Pick a deadline"
                onChange={(v) => setForm((f) => ({ ...f, deadline: v }))}
              />
            )}
          </Field>
          <Field
            label="Description"
            error={errors.description}
            className="sm:col-span-2"
            hint={`${form.description.trim().length}/5000. Include deliverables, requirements and anything freelancers should know.`}
          >
            {(p) => (
              <textarea
                {...p}
                className="textarea !min-h-40"
                value={form.description}
                onChange={set("description")}
                maxLength={5000}
                placeholder="Describe the work in detail."
              />
            )}
          </Field>
          <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2 border-t border-line">
            <Link
              to={
                editing ? `/dashboard/tasks/${task._id}` : "/dashboard/my-tasks"
              }
              className="btn btn-outline"
            >
              Cancel
            </Link>
            <button className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Post task"}
            </button>
          </div>
        </div>
        <aside className="card card-pad text-sm text-muted space-y-3 xl:sticky xl:top-24">
          <h2 className="text-base text-ink">Tips for a great task</h2>
          <ul className="list-disc pl-5 space-y-2 m-0">
            <li>Start the title with the outcome you want.</li>
            <li>List the deliverables and file formats.</li>
            <li>
              Set a realistic budget, since freelancers can propose their own
              price.
            </li>
            <li>Choose a deadline that leaves time for revisions.</li>
          </ul>
        </aside>
      </form>
    </>
  );
};

const TaskForm = () => {
  const { id } = useParams();
  const { role } = useAuth();
  const { data, error, loading, reload } = useAsync(
    () => (id ? api.get(`/tasks/${id}`) : Promise.resolve(null)),
    [id],
  );
  if (!id) return <Form />;
  if (loading && !data) return <PageLoader label="Loading task" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data.isOwner && role !== "admin")
    return <Navigate to="/dashboard" replace />;
  if (data.status !== "open" && role !== "admin")
    return <Navigate to={`/dashboard/tasks/${id}`} replace />;
  return <Form task={data} />;
};

export default TaskForm;