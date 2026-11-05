const PageHeader = ({ title, description, actions, back }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
    <div className="min-w-0">
      {back}
      <h1 className="text-2xl sm:text-3xl">{title}</h1>
      {description && <p className="text-muted mt-1.5 max-w-2xl">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
  </div>
);

export default PageHeader;
