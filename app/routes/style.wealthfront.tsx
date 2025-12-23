import type { Route } from "./+types/style.wealthfront";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wealthfront Style Demo" },
    { name: "description", content: "Style inspired by Wealthfront Cash page" }
  ];
}

export default function WealthfrontStyle() {
  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 sm:px-12">
        {/* Gradient circles background effect */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-amber-500/40 to-orange-600/40 blur-3xl"></div>
          <div className="absolute top-60 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-600/30 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="mb-6 text-6xl font-bold tracking-tight sm:text-7xl">
              Earn{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                4.50% APY
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-300 sm:text-2xl">
              on your cash with our premium savings account
            </p>
            <button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-amber-600 hover:to-orange-700 hover:shadow-xl">
              Get started
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-800 bg-[#12131a] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <div>
              <div className="mb-2 text-4xl font-bold text-amber-400">1.3M+</div>
              <div className="text-gray-400">Funded clients</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-amber-400">$90B+</div>
              <div className="text-gray-400">In assets</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-amber-400">FDIC</div>
              <div className="text-gray-400">Insured up to $8M</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Why choose our cash account
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Feature Card 1 */}
            <div className="rounded-2xl border border-gray-800 bg-[#12131a] p-8 transition-all hover:border-gray-700">
              <div className="mb-4 inline-block rounded-full bg-amber-500/10 p-3">
                <svg className="h-8 w-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-semibold">Industry-leading APY</h3>
              <p className="text-gray-400">
                Earn more on your cash with our competitive interest rates that automatically adjust to market conditions.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="rounded-2xl border border-gray-800 bg-[#12131a] p-8 transition-all hover:border-gray-700">
              <div className="mb-4 inline-block rounded-full bg-amber-500/10 p-3">
                <svg className="h-8 w-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-semibold">FDIC insured</h3>
              <p className="text-gray-400">
                Your deposits are protected up to $8 million through our network of partner banks.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="rounded-2xl border border-gray-800 bg-[#12131a] p-8 transition-all hover:border-gray-700">
              <div className="mb-4 inline-block rounded-full bg-amber-500/10 p-3">
                <svg className="h-8 w-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-semibold">Instant transfers</h3>
              <p className="text-gray-400">
                Move money between your accounts instantly with no fees or waiting periods.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="rounded-2xl border border-gray-800 bg-[#12131a] p-8 transition-all hover:border-gray-700">
              <div className="mb-4 inline-block rounded-full bg-amber-500/10 p-3">
                <svg className="h-8 w-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-semibold">Mobile app</h3>
              <p className="text-gray-400">
                Manage your money on the go with our award-winning mobile app for iOS and Android.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-6 py-20 bg-[#12131a]">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-4xl font-bold">
            How we compare
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="pb-4 text-left text-gray-400 font-normal">Feature</th>
                  <th className="pb-4 text-center font-semibold">Us</th>
                  <th className="pb-4 text-center text-gray-400 font-normal">Traditional Banks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 text-gray-300">APY</td>
                  <td className="py-4 text-center font-semibold text-amber-400">4.50%</td>
                  <td className="py-4 text-center text-gray-500">0.01%</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 text-gray-300">Monthly fees</td>
                  <td className="py-4 text-center font-semibold text-amber-400">$0</td>
                  <td className="py-4 text-center text-gray-500">$12</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 text-gray-300">Minimum balance</td>
                  <td className="py-4 text-center font-semibold text-amber-400">$0</td>
                  <td className="py-4 text-center text-gray-500">$1,500</td>
                </tr>
                <tr>
                  <td className="py-4 text-gray-300">Transfer time</td>
                  <td className="py-4 text-center font-semibold text-amber-400">Instant</td>
                  <td className="py-4 text-center text-gray-500">1-3 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-5xl font-bold">
            Ready to earn more on your cash?
          </h2>
          <p className="mb-8 text-xl text-gray-400">
            Open an account in minutes and start earning today.
          </p>
          <button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-10 py-5 text-lg font-semibold text-white shadow-lg transition-all hover:from-amber-600 hover:to-orange-700 hover:shadow-xl">
            Open an account
          </button>
          <p className="mt-6 text-sm text-gray-500">
            FDIC insured • No fees • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
