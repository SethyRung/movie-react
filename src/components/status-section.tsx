type StatusSectionProps = {
  label: string;
  title: string;
  message: string;
};

export function StatusSection({ label, title, message }: StatusSectionProps) {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-340 flex-col justify-end px-6 py-18">
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">{label}</p>
      <h1 className="mt-3 max-w-2xl text-4xl leading-none font-medium tracking-tight md:text-6xl md:tracking-tighter">
        {title}
      </h1>
      <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">{message}</p>
    </section>
  );
}
