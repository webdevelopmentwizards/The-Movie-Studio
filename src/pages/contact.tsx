"use client";

import Head from "next/head";
import { FormEvent, useState } from "react";

import PageHero from "@/components/PageHero";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <Head>
        <title>Contact Us — Movie Studio</title>
        <meta
          name="description"
          content="Get in touch with Movie Studio for partnerships, press inquiries, and general questions."
        />
      </Head>

      <PageHero
        eyebrow="Contact"
        title="Let's start a conversation"
        subtitle="Whether you're a filmmaker, partner, or fan — we'd love to hear from you."
      />

      <section className="bg-zinc-950 py-12 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center sm:p-10">
                <p className="text-xl font-semibold text-amber-400 sm:text-2xl">
                  Message sent!
                </p>
                <p className="mt-3 text-zinc-400">
                  Thank you for reaching out. We&apos;ll get back to you within
                  2 business days.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 sm:space-y-6 sm:p-8"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors focus:border-amber-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors focus:border-amber-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors focus:border-amber-500"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="press">Press & Media</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors focus:border-amber-500"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-amber-500 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400 sm:w-auto sm:px-10"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1 lg:gap-6">
            {[
              {
                title: "Office",
                lines: [
                  "110 Tower",
                  "110 S.E 6th Street",
                  "Suite #1700",
                  "Ft. Lauderdale, Florida 33301",
                ],
              },
              {
                title: "Email",
                lines: ["info@themoviestudio.com"],
              },
              {
                title: "Phone",
                lines: ["9543326600"],
              },
              {
                title: "Hours",
                lines: ["Mon – Fri: 9am – 6pm EST"],
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  {item.title}
                </h3>
                {item.lines.map((line) => {
                  if (item.title === "Email") {
                    return (
                      <p key={line} className="mt-2">
                        <a
                          href={`mailto:${line}`}
                          className="text-zinc-300 transition-colors hover:text-amber-400"
                        >
                          {line}
                        </a>
                      </p>
                    );
                  }
                  if (item.title === "Phone") {
                    return (
                      <p key={line} className="mt-2">
                        <a
                          href={`tel:+1${line.replace(/\D/g, "")}`}
                          className="text-zinc-300 transition-colors hover:text-amber-400"
                        >
                          {line}
                        </a>
                      </p>
                    );
                  }
                  return (
                    <p key={line} className="mt-2 text-zinc-300">
                      {line}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
