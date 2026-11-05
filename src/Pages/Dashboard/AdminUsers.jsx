import { useState } from "react";
import { LuSearch, LuUsers } from "react-icons/lu";
import { toast } from "react-toastify";
import { api } from "../../lib/api";
import { useAsync, useDebounced } from "../../lib/useAsync";
import { useAuth } from "../../Authentication/useAuth";
import { ROLE_LABEL } from "../../lib/constants";
import { formatDate } from "../../lib/format";
import { useConfirm } from "../../Components/ui/confirmContext";
import PageHeader from "../../Components/ui/PageHeader";
import ResponsiveTable from "../../Components/ui/ResponsiveTable";
import Pagination from "../../Components/ui/Pagination";
import Avatar from "../../Components/ui/Avatar";
import { EmptyState, ErrorState, PageLoader } from "../../Components/ui/Feedback";

const AdminUsers = () => {
  const { profile } = useAuth();
  const confirm = useConfirm();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const dq = useDebounced(q);
  const { data, error, loading, reload, setData } = useAsync(
    () => api.get("/admin/users", { q: dq, role, status, page, limit: 10 }), [dq, role, status, page]);

  const patch = async (u, body, okMsg) => {
    try {
      const updated = await api.patch(`/admin/users/${u._id}`, body);
      setData((d) => ({ ...d, items: d.items.map((x) => (x._id === u._id ? updated : x)) }));
      toast.success(okMsg);
    } catch (e) { toast.error(e.message); reload(); }
  };
  const toggle = async (u) => {
    const suspend = u.status !== "suspended";
    if (suspend && !(await confirm({ title: `Suspend ${u.name}?`, message: "They won't be able to use TaskWave until you reactivate the account.", confirmLabel: "Suspend", danger: true }))) return;
    patch(u, { status: suspend ? "suspended" : "active" }, suspend ? "User suspended" : "User reactivated");
  };
  const changeRole = async (u, next) => {
    if (!(await confirm({ title: `Change ${u.name}'s role?`, message: `${ROLE_LABEL[u.role]} → ${ROLE_LABEL[next]}. Their dashboard and permissions change immediately.`, confirmLabel: "Change role" }))) return reload();
    patch(u, { role: next }, "Role updated");
  };

  const reset = (fn) => (e) => { fn(e.target.value); setPage(1); };

  return (
    <>
      <PageHeader title="Users" description="Search members, change roles and suspend accounts." />
      <div className="card card-pad !p-3 sm:!p-4 grid gap-3 sm:grid-cols-[1fr_auto_auto] mb-4">
        <div className="relative">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" size={18} aria-hidden="true" />
          <input className="input !pl-10" type="search" aria-label="Search users" placeholder="Search by name or email" value={q} onChange={reset(setQ)} />
        </div>
        <select className="select sm:w-40" aria-label="Filter by role" value={role} onChange={reset(setRole)}>
          <option value="">All roles</option><option value="client">Clients</option><option value="freelancer">Freelancers</option><option value="admin">Admins</option>
        </select>
        <select className="select sm:w-40" aria-label="Filter by status" value={status} onChange={reset(setStatus)}>
          <option value="">Any status</option><option value="active">Active</option><option value="suspended">Suspended</option>
        </select>
      </div>
      {loading && !data ? <PageLoader label="Loading users" /> : error && !data ? <ErrorState error={error} onRetry={reload} /> : (
        <>
          <div className="card overflow-hidden">
            {data.items.length === 0 ? <EmptyState icon={LuUsers} title="No users found">Try a different search or filter.</EmptyState> : (
              <ResponsiveTable caption="Users" rows={data.items} columns={[
                { header: "User", primary: true, cell: (u) => <span className="flex items-center gap-3 min-w-0"><Avatar name={u.name} src={u.photo} size={34} /><span className="min-w-0"><span className="block truncate">{u.name}</span><span className="block text-xs text-muted font-normal truncate">{u.email}</span></span></span> },
                { header: "Role", cell: (u) => u._id === profile._id ? <span className="badge badge-info badge-plain">{ROLE_LABEL[u.role]} (you)</span> : (
                  <select className="select input-sm !w-36" aria-label={`Role for ${u.name}`} value={u.role} onChange={(e) => changeRole(u, e.target.value)}>
                    <option value="client">Client</option><option value="freelancer">Freelancer</option><option value="admin">Admin</option>
                  </select>) },
                { header: "Joined", cell: (u) => formatDate(u.createdAt) },
                { header: "Status", cell: (u) => <span className={`badge ${u.status === "suspended" ? "badge-danger" : "badge-success"}`}>{u.status === "suspended" ? "Suspended" : "Active"}</span> },
                { header: "Actions", actions: true, cell: (u) => u._id === profile._id ? <span className="text-xs text-faint">-</span> : (
                  <button className={`btn btn-sm ${u.status === "suspended" ? "btn-outline" : "btn-danger"}`} onClick={() => toggle(u)}>{u.status === "suspended" ? "Reactivate" : "Suspend"}</button>) },
              ]} />
            )}
          </div>
          <p className="text-sm text-muted mt-3">{data.total} {data.total === 1 ? "user" : "users"}</p>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </>
  );
};

export default AdminUsers;
