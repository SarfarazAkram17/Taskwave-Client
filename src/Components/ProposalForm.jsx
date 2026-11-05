import { useState } from "react";
import { LuSend } from "react-icons/lu";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import Field from "./ui/Field";

const ProposalForm = ({ task, onSent }) => {
  const [form, setForm] = useState({ amount: task.budget, deliveryDays: 7, message: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const short = form.message.trim().length < 20;

  const submit = async (e) => {
    e.preventDefault();
    if (short) return toast.error("Write a cover message of at least 20 characters");
    setBusy(true);
    try {
      await api.post(`/tasks/${task._id}/bids`, form);
      toast.success("Proposal sent");
      onSent();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Your price ($)" hint={`Budget: $${task.budget}`}>
          {(p) => <input {...p} className="input" type="number" min="1" step="any" inputMode="decimal" required value={form.amount} onChange={set("amount")} />}
        </Field>
        <Field label="Delivery (days)">
          {(p) => <input {...p} className="input" type="number" min="1" max="365" inputMode="numeric" required value={form.deliveryDays} onChange={set("deliveryDays")} />}
        </Field>
      </div>
      <Field label="Cover message" hint={`${form.message.trim().length}/2000. Explain why you're a good fit.`}>
        {(p) => <textarea {...p} className="textarea" required maxLength={2000} value={form.message} onChange={set("message")} placeholder="Introduce yourself and describe how you'd approach this task." />}
      </Field>
      <button className="btn btn-primary btn-block" disabled={busy}><LuSend size={16} />{busy ? "Sending…" : "Send proposal"}</button>
    </form>
  );
};

export default ProposalForm;
