/** Titled card used on every dashboard. */
const Section = ({ title, description, action, children, className = "", flush }) => (
  <section className={`card min-w-0 ${className}`}>
    <div className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3 flex-wrap">
      <div className="min-w-0">
        <h2 className="text-base sm:text-lg">{title}</h2>
        {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
    <div className={flush ? "" : "px-4 sm:px-5 pb-4 sm:pb-5"}>{children}</div>
  </section>
);

export default Section;
