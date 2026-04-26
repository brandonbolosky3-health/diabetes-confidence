import Quiz from "@/components/Quiz";

export default function HomepageQuiz() {
  return (
    <section className="py-16 md:py-24 bg-[color:var(--secondary)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-2">
            Find your next step
          </p>
          <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)]">
            Not sure where to start?
          </h2>
          <p className="mt-3 text-[1.05rem] text-[color:var(--muted-foreground)] max-w-xl mx-auto">
            Answer three quick questions and we&apos;ll point you to the path that fits where you are right now.
          </p>
        </div>
        <Quiz />
      </div>
    </section>
  );
}
