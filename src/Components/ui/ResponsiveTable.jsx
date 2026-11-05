/**
 * Table on md+ screens, stacked cards below. Columns:
 *   { header, cell(row), primary?, actions?, align? }
 * `primary` renders as the card title, `actions` as the card footer.
 */
const ResponsiveTable = ({ columns, rows, rowKey = (r) => r._id, caption }) => {
  const primary = columns.find((c) => c.primary);
  const actions = columns.find((c) => c.actions);
  const rest = columns.filter((c) => c !== primary && c !== actions);
  return (
    <>
      <div className="hidden md:block table-wrap">
        <table className="table">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr>{columns.map((c) => <th key={c.header} scope="col" className={c.align === "right" ? "!text-right" : ""}>{c.header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={rowKey(r)}>
                {columns.map((c) => <td key={c.header} className={c.align === "right" ? "text-right" : ""}>{c.cell(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="md:hidden list-none p-0 m-0 divide-y divide-line">
        {rows.map((r) => (
          <li key={rowKey(r)} className="p-4 space-y-3">
            {primary && <div className="font-semibold min-w-0">{primary.cell(r)}</div>}
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-sm m-0">
              {rest.map((c) => (
                <div key={c.header} className="contents">
                  <dt className="text-muted">{c.header}</dt>
                  <dd className="m-0 text-right min-w-0">{c.cell(r)}</dd>
                </div>
              ))}
            </dl>
            {actions && <div className="flex flex-wrap gap-2 pt-1">{actions.cell(r)}</div>}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ResponsiveTable;
