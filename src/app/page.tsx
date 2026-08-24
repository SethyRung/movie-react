export default function Home() {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-340 flex-col justify-end px-6 py-18">
      <p className="font-mono text-[11px] tracking-[1.1px] text-muted-foreground uppercase">
        Discovery
      </p>
      <h1 className="mt-3 max-w-2xl text-[38px] leading-none font-medium tracking-[-1.5px] md:text-[60px] md:leading-[1.02] md:tracking-[-2.5px]">
        Your guide to cinema.
      </h1>
      <p className="text-muted-foreground mt-6 max-w-md text-[17px] leading-6.75">
        Popular, now playing, upcoming, and top rated titles land here next.
      </p>
    </section>
  );
}
