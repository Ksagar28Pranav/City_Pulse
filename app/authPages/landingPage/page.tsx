"use client"
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white">
      <nav className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">City Pulse</div>
        <div className="flex items-center gap-3">
          <Link href="/authPages/signin" className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10">Sign in</Link>
          <Link href="/authPages/signup" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700">Sign up</Link>
        </div>
      </nav>

      <header className="mx-auto max-w-6xl px-4 pt-10 pb-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Empower your city with real‑time civic reporting</h1>
          <p className="mt-4 text-white/80">City Pulse connects citizens and officers to resolve issues faster. Report problems, track progress, and make communities better—together.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/authPages/signup" className="px-5 py-3 rounded-md bg-blue-600 hover:bg-blue-700 font-medium">Get started</Link>
            <Link href="#features" className="px-5 py-3 rounded-md border border-white/20 hover:bg-white/10">Learn more</Link>
          </div>
          <div className="mt-4 text-sm opacity-80">Officers can sign in to access the triage dashboard.</div>
        </div>
        <div className="relative">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-3xl font-bold">48h</div>
                <div className="text-xs opacity-80">Overdue alerts</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-3xl font-bold">3</div>
                <div className="text-xs opacity-80">Status stages</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-3xl font-bold">Live</div>
                <div className="text-xs opacity-80">Officer board</div>
              </div>
            </div>
            <div className="mt-6 rounded-lg border border-white/10 p-4 text-sm text-white/80">
              See issues organized into Not done, In progress, and Finished—with automatic overdue flags after 48 hours.
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <h3 className="text-lg font-semibold">Citizen reporting</h3>
          <p className="mt-2 text-white/80">Log problems in seconds with location details and descriptions. Track your submissions from the dashboard.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <h3 className="text-lg font-semibold">Officer triage</h3>
          <p className="mt-2 text-white/80">View all complaints in one place, update statuses, and focus on overdue items first.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <h3 className="text-lg font-semibold">Real-time insights</h3>
          <p className="mt-2 text-white/80">Auto-refreshing boards and alerts keep teams aligned and residents informed.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center">
          <h2 className="text-2xl font-semibold">Ready to improve your neighborhood?</h2>
          <p className="mt-2 text-white/80">Join City Pulse to report issues and help resolve them faster.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/authPages/signup" className="px-5 py-3 rounded-md bg-blue-600 hover:bg-blue-700 font-medium">Create account</Link>
            <Link href="/authPages/signin" className="px-5 py-3 rounded-md border border-white/20 hover:bg-white/10">Sign in</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

