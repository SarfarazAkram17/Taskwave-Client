import { BID_STATUS, STATUS } from "../../lib/constants";

export const StatusBadge = ({ status = "open" }) => {
  const s = STATUS[status] || STATUS.open;
  return <span className={`badge ${s.badge}`}>{s.label}</span>;
};

export const BidBadge = ({ status = "pending" }) => {
  const s = BID_STATUS[status] || BID_STATUS.pending;
  return <span className={`badge ${s.badge}`}>{s.label}</span>;
};
