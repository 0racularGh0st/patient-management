import GoogleSignIn from "@components/googleSignIn";

const Home = () => {
  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1400px] flex-col items-start gap-14 px-6 py-14 lg:flex-row lg:items-center lg:gap-20 lg:px-12 lg:py-12">
      {/* Left — editorial statement */}
      <div className="flex w-full flex-col items-start gap-6 lg:w-[56%] lg:pr-12">
        <span className="eyebrow inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Clinic patient records
        </span>
        <h1 className="font-serif text-5xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-[3.25rem] xl:text-[3.75rem]">
          Every visit,
          <br />
          <span className="italic font-light text-primary">beautifully</span> kept.
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
          A calm, organised home for your patients — track visits, diagnoses, and
          treatment without the clutter.
        </p>
        <div className="mt-4 flex flex-col items-start gap-3">
          <GoogleSignIn />
          <p className="text-sm text-muted-foreground">
            Sign in with your authorised clinic account.
          </p>
        </div>
      </div>

      {/* Right — layered "record card" motif */}
      <div className="relative hidden h-[440px] w-full lg:block lg:w-[44%]">
        <div className="absolute right-6 top-10 h-[300px] w-[280px] -rotate-6 rounded-2xl border border-border bg-secondary/50" />
        <div className="absolute right-2 top-4 h-[320px] w-[300px] rotate-3 rounded-2xl border border-border bg-card/70" />
        <div className="elevate absolute right-0 top-0 flex h-[360px] w-[330px] -rotate-1 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8">
          <div>
            <span className="eyebrow">Patient Manager</span>
            <svg viewBox="0 0 320 60" className="mt-6 h-12 w-full" fill="none" preserveAspectRatio="none">
              <path
                d="M0 30 H70 L85 30 L95 10 L110 50 L122 22 L134 38 L150 30 H320"
                stroke="hsl(var(--primary))"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <blockquote className="font-serif text-2xl font-medium leading-snug tracking-tight text-foreground">
            “Good records make<br /> good care.”
          </blockquote>
          <div className="flex items-center gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Visits · Diagnoses · Treatment
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
