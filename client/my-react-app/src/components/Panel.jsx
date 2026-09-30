export function Panel({ icon, title, meta, right, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-edge bg-bar">
        <h2 className="panel-title flex items-center gap-2">
          <span className="text-cyan">{icon}</span>
          {title}
        </h2>
        {right ?? (meta && <span className="label text-lime">{meta}</span>)}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}