import Link from "next/link";

export const SiteFooter = () => {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container grid gap-8 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <div className="text-lg font-semibold">LinguaFlow</div>
          <p className="text-sm text-muted-foreground">
            A modern learning platform for English learners and teachers to collaborate, practice, and grow with intention.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Explore
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="text-muted-foreground transition hover:text-foreground" href="/courses">
                Courses
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground transition hover:text-foreground" href="/books">
                Books
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground transition hover:text-foreground" href="/login">
                Login
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Connect
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                className="text-muted-foreground transition hover:text-foreground"
                href="mailto:hello@linguaflow.dev"
              >
                hello@linguaflow.dev
              </a>
            </li>
            <li>
              <a
                className="text-muted-foreground transition hover:text-foreground"
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                className="text-muted-foreground transition hover:text-foreground"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LinguaFlow. All rights reserved.
      </div>
    </footer>
  );
};
