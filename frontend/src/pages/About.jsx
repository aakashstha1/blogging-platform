import { Button } from "@/components/ui/button";
import { Feather, PenLine, Compass, Users } from "lucide-react";
import { Link } from "react-router-dom";

// The same hand-drawn ink stroke used as the nav's active-link underline,
// reused here as a section divider so the motif carries through the page.
function InkDivider({ className = "" }) {
  return (
    <svg
      viewBox="0 0 400 12"
      className={`h-3 w-full max-w-xs ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M4 7 C 60 2, 110 10, 170 5 S 260 2, 320 7 S 380 9, 396 5"
        fill="none"
        stroke="#1F5F5B"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

const PILLARS = [
  {
    icon: PenLine,
    title: "Write",
    body: "A clean, distraction-free editor built for getting words down — not fighting with formatting.",
  },
  {
    icon: Compass,
    title: "Discover",
    body: "Trending and recommended feeds surface stories worth your time, curated from what you actually read.",
  },
  {
    icon: Users,
    title: "Connect",
    body: "Follow the writers whose ideas stick with you, and build an audience for your own.",
  },
];

export default function About() {
  return (
    <main className="bg-[#FAFAF8] text-[#1C2321]">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#1F5F5B] text-[#FAFAF8]">
          <Feather className="h-5 w-5" />
        </span>
        <h1
          className="text-4xl leading-tight tracking-tight sm:text-5xl"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Every story deserves ink.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-[#1C2321]/70">
          Quill is a home for writing that's meant to be read — a quieter place
          to publish, follow, and discover ideas without the noise.
        </p>
        <InkDivider className="mx-auto mt-10" />
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-10 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
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

      {/* Manuscript-style statement */}
      <section className="border-y border-[#E8E4DC] bg-white/40 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <p
            className="text-2xl leading-relaxed sm:text-[26px]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            <span className="float-left mr-2 text-6xl leading-[0.85] text-[#1F5F5B]">
              W
            </span>
            e started Quill because the best writing online kept getting buried
            under algorithms optimizing for anything but the writing itself. So
            we built a place where a good sentence is still the whole point — no
            engagement bait, no infinite scroll, just stories and the people who
            write them.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2
          className="text-3xl"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Ready to add your voice?
        </h2>
        <p className="mt-3 text-[#1C2321]/70">
          Start reading in seconds, or pick up a pen of your own.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/write">
            <Button
              size="lg"
              className="bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
            >
              <PenLine className="mr-2 h-4 w-4" />
              Start writing
            </Button>
          </Link>
          <Link to="/feeds">
            <Button
              size="lg"
              variant="outline"
              className="border-[#1F5F5B]/30 text-[#1F5F5B]"
            >
              Explore stories
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
