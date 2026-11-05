import { useState } from "react";
import { Link } from "react-router";
import {
  LuClipboardList,
  LuEye,
  LuFilePlus2,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import { toast } from "react-toastify";
import { api } from "../../lib/api";
import { useAsync } from "../../lib/useAsync";
import { STATUS } from "../../lib/constants";
import { deadlineInfo, money } from "../../lib/format";
import { useConfirm } from "../../Components/ui/confirmContext";
import PageHeader from "../../Components/ui/PageHeader";
import Tabs from "../../Components/ui/Tabs";
import ResponsiveTable from "../../Components/ui/ResponsiveTable";
import { StatusBadge } from "../../Components/ui/StatusBadge";
import {
  EmptyState,
  ErrorState,
  PageLoader,
} from "../../Components/ui/Feedback";

const MyTasks = () => {
  const { data, error, loading, reload, setData } = useAsync(
    () => api.get("/tasks/mine"),
    [],
  );
  const [tab, setTab] = useState("all");
  const confirm = useConfirm();

  if (loading && !data) return <PageLoader label="Loading your tasks" />;
  if (error && !data) return <ErrorState error={error} onRetry={reload} />;

  const count = (s) => data.filter((t) => t.status === s).length;
  const tabs = [
    { value: "all", label: "All", count: data.length },
    ...Object.entries(STATUS).map(([k, v]) => ({
      value: k,
      label: v.label,
      count: count(k),
    })),
  ];
  const rows = tab === "all" ? data : data.filter((t) => t.status === tab);

  const remove = async (t) => {
    if (
      !(await confirm({
        title: "Delete this task?",
        message: `"${t.title}" and its proposals will be permanently removed.`,
        confirmLabel: "Delete task",
        danger: true,
      }))
    )
      return;
    try {
      await api.delete(`/tasks/${t._id}`);
      setData((d) => d.filter((x) => x._id !== t._id));
      toast.success("Task deleted");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <PageHeader
        title="My tasks"
        description="Every task you've posted, with its progress."
        actions={
          <Link to="/dashboard/post-task" className="btn btn-primary">
            <LuFilePlus2 size={16} />
            Post a task
          </Link>
        }
      />
      {data.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={LuClipboardList}
            title="You haven't posted any tasks"
            action={
              <Link to="/dashboard/post-task" className="btn btn-primary">
                Post your first task
              </Link>
            }
          >
            Tasks you post will appear here.
          </EmptyState>
        </div>
      ) : (
        <>
          <Tabs
            tabs={tabs}
            value={tab}
            onChange={setTab}
            label="Filter by status"
          />
          <div className="card mt-4 overflow-hidden">
            {rows.length === 0 ? (
              <EmptyState
                title={`No ${STATUS[tab]?.label.toLowerCase()} tasks`}
              />
            ) : (
              <ResponsiveTable
                caption="My tasks"
                rows={rows}
                columns={[
                  {
                    header: "Task",
                    primary: true,
                    cell: (t) => (
                      <Link
                        to={`/dashboard/tasks/${t._id}`}
                        className="hover:text-primary"
                      >
                        <span className="block">{t.title}</span>
                        <span className="block text-xs text-muted font-normal">
                          {t.category}
                        </span>
                      </Link>
                    ),
                  },
                  {
                    header: "Status",
                    cell: (t) => <StatusBadge status={t.status} />,
                  },
                  { header: "Budget", cell: (t) => money(t.budget) },
                  {
                    header: "Proposals",
                    cell: (t) => (
                      <span>
                        {t.proposals}
                        {t.pendingProposals > 0 && (
                          <span className="badge badge-warning badge-plain ml-2">
                            {t.pendingProposals} new
                          </span>
                        )}
                      </span>
                    ),
                  },
                  {
                    header: "Deadline",
                    cell: (t) => (
                      <span
                        className={
                          deadlineInfo(t.deadline).tone === "danger" &&
                          t.status !== "completed"
                            ? "text-danger"
                            : ""
                        }
                      >
                        {t.deadline}
                      </span>
                    ),
                  },
                  {
                    header: "Actions",
                    actions: true,
                    cell: (t) => (
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/tasks/${t._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          <LuEye size={14} />
                          Manage
                        </Link>
                        {t.status === "open" && (
                          <Link
                            to={`/dashboard/edit-task/${t._id}`}
                            className="btn btn-ghost btn-sm"
                            aria-label={`Edit ${t.title}`}
                          >
                            <LuPencil size={14} />
                            Edit
                          </Link>
                        )}
                        {(t.status === "open" ||
                          t.status === "completed" ||
                          t.status === "cancelled") && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => remove(t)}
                            aria-label={`Delete ${t.title}`}
                          >
                            <LuTrash2 size={14} />
                            Delete
                          </button>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MyTasks;
