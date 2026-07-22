import { Button } from "@/components/ui/button";
import {
  Feather,
  PenLine,
  Compass,
  Users,
  Star,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// A loose stack of "paper" cards previewing real stories — the signature
// visual for this page, distinct from the About page's ink-stroke motif but
// still drawn from the same "writing on paper" world.
function StoryStack() {
  const cards = [
    {
      title: "The Slow Death of the Reading List",
      author: "M. Alvarez",
      tag: "Essay",
      rotate: "-rotate-3",
      z: "z-10",
    },
    {
      title: "Notes From a Year Without Notifications",
      author: "J. Okafor",
      tag: "Personal",
      rotate: "rotate-2",
      z: "z-20",
    },
    {
      title: "Why Good Sentences Still Win",
      author: "R. Kapoor",
      tag: "Craft",
      rotate: "-rotate-1",
      z: "z-30",
    },
  ];

  return (
    <div className="relative mx-auto h-72 w-full max-w-sm sm:h-80">
      {cards.map((card, i) => (
        <div
          key={card.title}
          className={`absolute inset-x-0 top-${i * 6} ${card.rotate} ${card.z} rounded-lg border border-[#E8E4DC] bg-white p-5 shadow-md transition-transform duration-300 hover:-translate-y-1`}
          style={{ top: `${i * 28}px` }}
        >
          <span className="text-xs font-medium uppercase tracking-wide text-[#1F5F5B]">
            {card.tag}
          </span>
          <h3
            className="mt-2 text-lg leading-snug"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {card.title}
          </h3>
          <p className="mt-3 text-sm text-[#1C2321]/60">by {card.author}</p>
        </div>
      ))}
    </div>
  );
}

const BENEFITS = [
  {
    icon: PenLine,
    title: "Write without friction",
    body: "A clean editor that gets out of the way of the words.",
  },
  {
    icon: Compass,
    title: "Read what matters",
    body: "Feeds built around your interests, not your attention span.",
  },
  {
    icon: Users,
    title: "Follow real writers",
    body: "Build a following of people, not an algorithm.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I moved my newsletter to Quill and never looked back. It just feels like a place for writing.",
    name: "Dana Whitfield",
    role: "Essayist",
  },
  {
    quote:
      "The recommended feed is the first one that's actually introduced me to writers I now follow everywhere.",
    name: "Theo Marsh",
    role: "Reader",
  },
];

export default function LandingPage() {
  return (
    <main className="bg-[#FAFAF8] text-[#1C2321]">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-20 sm:pt-24 lg:grid-cols-2">
        <div>
          <span className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1F5F5B] text-[#FAFAF8]">
            <Feather className="h-4 w-4" />
          </span>
          <h1
            className="text-4xl leading-tight tracking-tight sm:text-5xl"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Where writing still matters.
          </h1>
          <p className="mt-5 max-w-md text-lg text-[#1C2321]/70">
            Quill is a home for writers and readers who want stories, not
            engagement metrics. Publish freely. Read deeply.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
              >
                Get started — it's free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-[#1F5F5B]/30 text-[#1F5F5B]"
              >
                Log in
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-[#1C2321]/50">
            No ads. No paywall to read. Just stories.
          </p>
        </div>
        <StoryStack />
      </section>

      {/* Benefits */}
      <section className="border-y border-[#E8E4DC] bg-white/40 px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center sm:text-left">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1F5F5B]/10 text-[#1F5F5B]">
                <Icon className="h-5 w-5" />
              </span>
              <h3
                className="text-xl"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {title}
              </h3>
              <p className="mt-2 text-[#1C2321]/70">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2
          className="text-center text-3xl"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Loved by people who love to write
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-lg border border-[#E8E4DC] bg-white p-6"
            >
              <div className="mb-3 flex gap-1 text-[#1F5F5B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p
                className="text-lg leading-relaxed"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                "{t.quote}"
              </p>
              <p className="mt-4 text-sm text-[#1C2321]/60">
                {t.name} · {t.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1F5F5B] px-6 py-20 text-center text-[#FAFAF8]">
        <h2
          className="text-3xl sm:text-4xl"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Your first story is one click away.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[#FAFAF8]/80">
          Join Quill and start reading — or writing — in under a minute.
        </p>
        <Link to="/signup">
          <Button
            size="lg"
            className="mt-8 bg-[#FAFAF8] text-[#1F5F5B] hover:bg-[#FAFAF8]/90"
          >
            Create your account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>
    </main>
  );
}
