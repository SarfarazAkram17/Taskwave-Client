const TONES = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  violet: "bg-violet-soft text-violet",
  danger: "bg-danger-soft text-danger",
};

const StatCard = ({ label, value, icon: Icon, tone = "primary", note }) => (
  <div className="card card-pad !p-4 sm:!p-5 flex flex-col xs:flex-row items-start gap-2.5 xs:gap-3 min-w-0">
    {Icon && (
      <span className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 ${TONES[tone]}`}>
        <Icon size={19} aria-hidden="true" />
      </span>
    )}
    <div className="min-w-0">
      <p className="text-muted text-[0.8125rem] leading-tight">{label}</p>
      <p className="font-display text-2xl font-bold mt-1 tabular-nums break-words">{value}</p>
      {note && <p className="text-xs text-faint mt-0.5">{note}</p>}
    </div>
  </div>
);

export default StatCard;
