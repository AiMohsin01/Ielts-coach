const features: [string, string][] = [
  ["Preppy AI", "Instant writing and speaking feedback with band estimates."],
  ["Study plan", "A daily roadmap built around your weaknesses."],
  ["Mocks", "Full Listening, Reading, Writing, and Speaking tests."],
  ["Detailed feedback", "Rubric-by-rubric comments you can act on."],
  ["Statistics", "Track band history, streaks, and exam countdown."],
  ["Games", "Short practice games to keep momentum."],
  ["Vocabulary", "Spaced-review academic word flashcards."],
  ["Exam mode", "Timed conditions that mirror the real test."],
];

const testimonials: [string, string, string][] = [
  ["Ayesha", "Dhaka", "Got a 7.0 after six weeks. The daily plan told me exactly what to do each morning."],
  ["Karim", "Chittagong", "The writing feedback is more useful than my paid tutor's comments."],
  ["Nabila", "Sylhet", "Speaking cue-card practice every day removed my exam-day panic."],
];

const faqs: [string, string][] = [
  ["Is it really free?", "Yes. Every practice feature works without payment. AI evaluation uses a free local model or your own API key."],
  ["How is GoPrep different from other platforms?", "One coach plans your day, grades your answers, and tracks your progress in a single place."],
  ["Can I use it on my phone?", "Yes. The web app is mobile-first and can be installed as a PWA."],
  ["Are the practice tests official?", "Our content mirrors the IELTS format but is not official IELTS material."],
];

export function Landing({ start }: { start: () => void }) {
  return (
    <main className="bg-white text-slate-800">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <b className="text-lg font-extrabold tracking-tight text-red-700">IELTS AI COACH</b>
        <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <a href="#platform" className="hidden hover:text-red-700 sm:block">Platform</a>
          <a href="#reviews" className="hidden hover:text-red-700 sm:block">Reviews</a>
          <a href="#faq" className="hidden hover:text-red-700 sm:block">FAQ</a>
          <button className="btn-secondary" onClick={start}>Log in</button>
          <button className="btn-primary" onClick={start}>Start</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 text-center lg:pt-16">
        <p className="font-semibold tracking-widest text-red-700">FREE FOR EVERY STUDENT</p>
        <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-extrabold leading-tight text-red-950 sm:text-6xl">
          Get the band score you want — <span className="text-red-600">on your first try</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
          AI prep for Academic &amp; General Training IELTS — 8 tools in one.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button className="btn-primary px-7 py-3.5 text-base" onClick={start}>Start preparation</button>
          <a className="btn-secondary px-7 py-3.5 text-base" href="#platform">Platform</a>
        </div>
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4 text-center">
          {[["8", "tools in one"], ["4", "IELTS skills"], ["0৳", "to start"]].map(([a, b]) => (
            <div key={b}><p className="text-4xl font-extrabold text-red-700">{a}</p><p className="text-sm text-slate-500">{b}</p></div>
          ))}
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="bg-mist py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold text-red-950">Take a look inside the platform</h2>
          <p className="mt-2 text-slate-600">Everything you need to plan, practise, and improve.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([a, b]) => (
              <article className="card transition hover:-translate-y-1 hover:shadow-md hover:ring-red-100" key={a}>
                <span className="inline-block h-2 w-8 rounded-full bg-red-600" />
                <h3 className="mt-3 font-bold text-red-950">{a}</h3>
                <p className="mt-2 text-sm text-slate-600">{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold text-red-950">Our grateful students</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map(([n, c, q]) => (
            <figure className="card" key={n}>
              <blockquote className="leading-7 text-slate-700">“{q}”</blockquote>
              <figcaption className="mt-4 font-semibold text-red-800">{n} <span className="font-normal text-slate-500">· {c}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-gradient-to-r from-red-700 to-red-800 px-5 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Quality preparation should always be free.</h2>
        <p className="mx-auto mt-3 max-w-xl text-red-100">No payment walls. No compulsory premium account. Run the AI locally or learn from the complete practice library.</p>
        <button className="mt-7 rounded-xl bg-white px-7 py-3.5 font-semibold text-red-700 shadow-sm transition hover:bg-red-50" onClick={start}>Begin your free plan</button>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-3xl font-bold text-red-950">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-red-100">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-red-950 group-open:text-red-700">{q}</summary>
              <p className="mt-2 leading-7 text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="bg-red-950 px-5 py-6 text-center text-sm text-red-300">
        IELTS AI Coach — free IELTS preparation for every student.
      </footer>
    </main>
  );
}
