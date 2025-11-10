import type { Route } from "./+types/style.planetscale";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PlanetScale Form Styles - Demo" },
    { name: "description", content: "Form element samples styled like PlanetScale" }
  ];
}

export default function PlanetScaleStyles() {
  return (
    <div className="min-h-screen bg-white font-mono text-[rgb(65,65,65)]">
      {/* Header */}
      <div className="border-b border-gray-200 px-3 py-4 sm:px-5">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-base font-bold leading-6 text-black">
            PlanetScale Styles
          </h1>
          <p className="text-base font-normal leading-6 text-[rgb(65,65,65)]">
            Typography and form element samples extracted from planetscale.com/contact
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container isolate my-6 max-w-7xl px-3 sm:px-5 lg:px-12">
        <div className="space-y-8">
          {/* Typography Section */}
          <section className="border-b border-gray-200 pb-8">
            <h2 className="mb-6 text-base font-semibold leading-6 text-[rgb(65,65,65)]">
              Typography
            </h2>

            <div className="space-y-6">
              {/* Heading 1 */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">Heading 1 (H1)</p>
                <h1 className="text-base font-bold leading-6 text-black">
                  Contact us
                </h1>
                <code className="mt-1 block text-xs text-gray-500">
                  font-bold text-base (16px) leading-6 text-black
                </code>
              </div>

              {/* Heading 2 */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">Heading 2 (H2)</p>
                <h2 className="text-base font-semibold leading-6 text-[rgb(65,65,65)]">
                  Company
                </h2>
                <code className="mt-1 block text-xs text-gray-500">
                  font-semibold text-base (16px) leading-6 text-[rgb(65,65,65)]
                </code>
              </div>

              {/* Body Text */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">Body Text</p>
                <p className="text-base font-normal leading-6 text-[rgb(65,65,65)]">
                  This is body text using PlanetScale's monospace font family. The entire site uses a monospace typeface which gives it a technical, developer-focused aesthetic.
                </p>
                <code className="mt-1 block text-xs text-gray-500">
                  font-normal text-base (16px) leading-6 font-mono
                </code>
              </div>

              {/* Medium Text */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">Medium Weight Text</p>
                <p className="text-base font-medium leading-6 text-[rgb(58,59,54)]">
                  Single-node databases from $5 coming soon.
                </p>
                <code className="mt-1 block text-xs text-gray-500">
                  font-medium text-base (16px) leading-6
                </code>
              </div>

              {/* Semibold Text */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">Semibold Text</p>
                <p className="text-base font-semibold leading-6 text-[rgb(65,65,65)]">
                  Important information or labels
                </p>
                <code className="mt-1 block text-xs text-gray-500">
                  font-semibold text-base (16px) leading-6
                </code>
              </div>

              {/* Links */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">Links</p>
                <div className="space-y-2">
                  <div>
                    <a href="#" className="text-base font-semibold leading-6 text-[rgb(65,65,65)] hover:text-[rgb(243,88,21)]">
                      Standard navigation link
                    </a>
                    <code className="mt-1 block text-xs text-gray-500">
                      font-semibold no-underline hover:text-orange
                    </code>
                  </div>
                  <div>
                    <a href="#" className="text-base font-medium leading-6 text-[rgb(58,59,54)] underline decoration-dotted underline-offset-4 hover:decoration-solid">
                      Underlined link with dotted decoration
                    </a>
                    <code className="mt-1 block text-xs text-gray-500">
                      underline decoration-dotted underline-offset-4
                    </code>
                  </div>
                </div>
              </div>

              {/* Button Text */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">Button Text</p>
                <span className="inline-block bg-[rgb(243,88,21)] px-4 py-2 text-base font-semibold leading-6 text-white">
                  Submit
                </span>
                <code className="mt-1 block text-xs text-gray-500">
                  font-semibold text-white on orange background
                </code>
              </div>
            </div>
          </section>
          {/* Text Input */}
          <section>
            <h2 className="mb-4 text-base font-semibold leading-6 text-[rgb(65,65,65)]">
              Text Input
            </h2>
            <label className="flex flex-1 flex-col gap-0.5 font-semibold">
              <span className="text-[rgb(65,65,65)]">
                First name
                <span className="text-red-600"> *</span>
              </span>
              <input
                type="text"
                placeholder="Enter your first name"
                className="focus-ring h-[42px] border border-[rgb(65,65,65)] bg-white px-1.5 py-1 font-normal text-[rgb(65,65,65)] transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </section>

          {/* Email Input */}
          <section>
            <h2 className="mb-4 text-base font-semibold leading-6 text-[rgb(65,65,65)]">
              Email Input
            </h2>
            <label className="flex flex-1 flex-col gap-0.5 font-semibold">
              <span className="text-[rgb(65,65,65)]">
                Work email
                <span className="text-red-600"> *</span>
              </span>
              <input
                type="email"
                placeholder="your.email@company.com"
                className="focus-ring h-[42px] border border-[rgb(65,65,65)] bg-white px-1.5 py-1 font-normal text-[rgb(65,65,65)] transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </section>

          {/* Select Dropdown */}
          <section>
            <h2 className="mb-4 text-base font-semibold leading-6 text-[rgb(65,65,65)]">
              Select Dropdown
            </h2>
            <label className="flex flex-1 flex-col gap-0.5 font-semibold">
              <span className="text-[rgb(65,65,65)]">
                Are you interested in Postgres or Vitess/MySQL?
                <span className="text-red-600"> *</span>
              </span>
              <select className="focus-ring h-[42px] border border-[rgb(129,129,129)] bg-white px-1.5 py-1 font-normal text-[rgb(65,65,65)] transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Vitess">Vitess</option>
                <option value="Postgres">Postgres</option>
                <option value="Both">Both</option>
                <option value="Not sure">Not sure</option>
              </select>
            </label>
          </section>

          {/* Textarea */}
          <section>
            <h2 className="mb-4 text-base font-semibold leading-6 text-[rgb(65,65,65)]">
              Textarea
            </h2>
            <label className="flex flex-1 flex-col gap-0.5 font-semibold">
              <span className="text-[rgb(65,65,65)]">
                Questions or comments
                <span className="text-red-600"> *</span>
              </span>
              <textarea
                rows={4}
                placeholder="Tell us more about your project..."
                className="focus-ring h-32 border border-[rgb(129,129,129)] bg-white px-1.5 py-1 font-normal text-[rgb(65,65,65)] transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </section>

          {/* Radio Buttons (Card Style) */}
          <section>
            <h2 className="mb-4 text-base font-semibold leading-6 text-[rgb(65,65,65)]">
              Radio Buttons (Card Style)
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="relative flex cursor-pointer flex-col gap-2 border-2 border-blue-500 bg-white p-4 transition hover:border-blue-600">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="contact-type"
                    value="sales"
                    defaultChecked
                    className="mt-1 h-4 w-4 accent-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-[rgb(65,65,65)]">
                      Talk to sales
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Book a call with Sales for pricing, enterprise options,
                      sizing, migration support, and more.
                    </div>
                  </div>
                </div>
              </label>

              <label className="relative flex cursor-pointer flex-col gap-2 border border-[rgb(129,129,129)] bg-white p-4 transition hover:border-[rgb(65,65,65)]">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="contact-type"
                    value="support"
                    className="mt-1 h-4 w-4 accent-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-[rgb(65,65,65)]">
                      Open a support ticket
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Troubleshoot a technical issue or payment problem.
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </section>

          {/* Button */}
          <section>
            <h2 className="mb-4 text-base font-semibold leading-6 text-[rgb(65,65,65)]">
              Submit Button
            </h2>
            <button
              type="submit"
              className="h-[40px] w-full bg-[rgb(243,88,21)] px-4 font-semibold text-white transition hover:bg-[rgb(220,75,15)] focus:outline-none focus:ring-2 focus:ring-[rgb(243,88,21)] focus:ring-offset-2 active:bg-[rgb(200,65,10)] md:w-1/2"
            >
              Submit
            </button>
          </section>

          {/* Complete Form Example */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="mb-6 text-base font-semibold leading-6 text-[rgb(65,65,65)]">
              Complete Form Example
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-1 flex-col gap-0.5 font-semibold">
                  <span className="text-[rgb(65,65,65)]">
                    First name
                    <span className="text-red-600"> *</span>
                  </span>
                  <input
                    type="text"
                    required
                    className="focus-ring h-[42px] border border-[rgb(65,65,65)] bg-white px-1.5 py-1 font-normal text-[rgb(65,65,65)] transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex flex-1 flex-col gap-0.5 font-semibold">
                  <span className="text-[rgb(65,65,65)]">
                    Last name
                    <span className="text-red-600"> *</span>
                  </span>
                  <input
                    type="text"
                    required
                    className="focus-ring h-[42px] border border-[rgb(65,65,65)] bg-white px-1.5 py-1 font-normal text-[rgb(65,65,65)] transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <label className="flex flex-1 flex-col gap-0.5 font-semibold">
                <span className="text-[rgb(65,65,65)]">
                  Work email
                  <span className="text-red-600"> *</span>
                </span>
                <input
                  type="email"
                  required
                  className="focus-ring h-[42px] border border-[rgb(65,65,65)] bg-white px-1.5 py-1 font-normal text-[rgb(65,65,65)] transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="flex flex-1 flex-col gap-0.5 font-semibold">
                <span className="text-[rgb(65,65,65)]">
                  Database type
                  <span className="text-red-600"> *</span>
                </span>
                <select
                  required
                  className="focus-ring h-[42px] border border-[rgb(129,129,129)] bg-white px-1.5 py-1 font-normal text-[rgb(65,65,65)] transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an option</option>
                  <option value="Vitess">Vitess</option>
                  <option value="Postgres">Postgres</option>
                  <option value="Both">Both</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </label>

              <label className="flex flex-1 flex-col gap-0.5 font-semibold">
                <span className="text-[rgb(65,65,65)]">
                  Message
                  <span className="text-red-600"> *</span>
                </span>
                <textarea
                  rows={4}
                  required
                  className="focus-ring h-32 border border-[rgb(129,129,129)] bg-white px-1.5 py-1 font-normal text-[rgb(65,65,65)] transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <button
                type="submit"
                className="h-[40px] w-full bg-[rgb(243,88,21)] px-4 font-semibold text-white transition hover:bg-[rgb(220,75,15)] focus:outline-none focus:ring-2 focus:ring-[rgb(243,88,21)] focus:ring-offset-2 active:bg-[rgb(200,65,10)] md:w-1/2"
              >
                Submit Form
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
