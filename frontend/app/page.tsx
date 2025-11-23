import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Update Me
            </div>
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-medium rounded-full border border-gray-200 hover:border-[#ff991c] hover:text-[#ff991c] hover:bg-orange-50/50 transition-all duration-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-5 py-20 md:py-24 space-y-24 md:space-y-32">
        {/* Hero Section */}
        <section className="pt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/40 via-50% to-[#ff991c]/25 -z-10 rounded-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff991c]/10 rounded-full blur-3xl -z-10" />
          <div className="grid gap-12 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-center relative">
            <div className="space-y-6">
              <p className="inline-flex items-center rounded-full border border-gray-200/80 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff991c] mr-2" />
                Update Me · Simple landing template
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                Keep your updates in one{" "}
                <span className="bg-gradient-to-r from-[#ff991c] to-orange-600 bg-clip-text text-transparent">
                  clean, simple
                </span>{" "}
                place
              </h1>
              <p className="max-w-xl text-base sm:text-lg text-gray-600 leading-relaxed">
                Use this page as a starting point for your product, changelog,
                or onboarding flow. Swap the copy, plug in real data, and ship
                something that feels calm and professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center pt-2">
                <div className="flex gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-full bg-[#ff991c] text-white hover:bg-[#e68a19] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Get started
                  </Link>
                  <Link
                    href="#get-started"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-full border-2 border-gray-200 text-gray-700 hover:border-[#ff991c] hover:text-[#ff991c] hover:bg-orange-50/50 transition-all duration-200"
                  >
                    Learn more
                  </Link>
                </div>
                <p className="text-xs text-gray-500 sm:ml-2">
                  No design system required. Just edit the text.
                </p>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="rounded-3xl border border-gray-200/80 bg-white/90 backdrop-blur-md px-6 py-5 shadow-xl space-y-4 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span>Updates overview</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Last updated: Today
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Launch v1.0
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Replace these cards with real product highlights or
                      changelog items.
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Invite your team
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Show what happens after someone signs up or logs in.
                    </p>
                  </div>
                  <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-3 text-xs text-gray-500 text-center">
                    This is just a placeholder preview. Swap it for a screenshot
                    or embed of your actual product.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section id="get-started" className="space-y-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#ff991c]/10 via-orange-50/60 to-[#ff991c]/8 border-2 border-[#ff991c]/20 p-10 md:p-14 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff991c]/5 rounded-full blur-2xl -z-0" />
            <div className="max-w-3xl mx-auto space-y-8 relative z-10">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  How to get started
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-xl mx-auto">
                  Getting started is simple and straightforward. Follow these steps to begin your journey with us.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex gap-5 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff991c] to-orange-600 text-white flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
                    1
                  </div>
                  <div className="flex-1 space-y-2 pt-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      Create your account
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Sign up with your email address. It only takes a minute and we&apos;ll have you up and running in no time.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff991c] to-orange-600 text-white flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
                    2
                  </div>
                  <div className="flex-1 space-y-2 pt-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      Explore the features
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Take a tour of the dashboard and familiarize yourself with all the tools and features available to you.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff991c] to-orange-600 text-white flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
                    3
                  </div>
                  <div className="flex-1 space-y-2 pt-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      Start building
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Begin creating your first project. Our intuitive interface makes it easy to get started, even if you&apos;re new to the platform.
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6 flex justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold rounded-full bg-[#ff991c] text-white hover:bg-[#e68a19] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Get started now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="space-y-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Contact us
            </h2>
            <p className="text-base text-gray-600 max-w-lg leading-relaxed">
              Have questions or want to plug this template into a real product?
              Drop a line and wire it up to your actual support inbox later.
            </p>
          </div>
          <form className="space-y-5 max-w-lg mx-auto">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ff991c] focus:ring-2 focus:ring-[#ff991c]/20 transition-all duration-200 bg-white"
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ff991c] focus:ring-2 focus:ring-[#ff991c]/20 transition-all duration-200 bg-white"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ff991c] focus:ring-2 focus:ring-[#ff991c]/20 transition-all duration-200 resize-none bg-white"
                placeholder="How can we help?"
              />
            </div>
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold rounded-full bg-[#ff991c] text-white hover:bg-[#e68a19] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Send message
              </button>
            </div>
          </form>
        </section>

        <footer className="pt-12 border-t border-gray-200 text-sm text-gray-500 text-center">
          <p>&copy; 2025 Update Me. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
