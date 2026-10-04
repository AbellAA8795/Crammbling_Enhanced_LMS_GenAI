export function Panel({ icon, title, meta, right, children, className = "", bodyClassName = "p-4" }) {
  return (
    <section className={`panel flex flex-col ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-edge bg-bar">
        <h2 className="panel-title flex items-center gap-2">
          <span className="text-cyan">{icon}</span>
          {title}
        </h2>
        {right ?? (meta && <span className="label text-lime">{meta}</span>)}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}