import Link from "next/link";

import { useLanguage } from "@/components/providers/language-provider";
import { getCommonTranslations } from "@/lib/common-translations";

export const SiteFooter = () => {
  const { language } = useLanguage();
  const common = getCommonTranslations(language);

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container grid gap-8 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <div className="text-lg font-semibold">OzgesheEdu</div>
          <p className="text-sm text-muted-foreground">{common.footer.about}</p>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {common.footer.exploreTitle}
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="text-muted-foreground transition hover:text-foreground" href="/courses">
                {common.footer.explore.courses}
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground transition hover:text-foreground" href="/books">
                {common.footer.explore.books}
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground transition hover:text-foreground" href="/login">
                {common.footer.explore.login}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {common.footer.connect}
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a className="text-muted-foreground transition hover:text-foreground" href={`mailto:${common.footer.email}`}>
                {common.footer.email}
              </a>
            </li>
            <li>
              <a className="text-muted-foreground transition hover:text-foreground" href="https://twitter.com" target="_blank" rel="noreferrer">
                Twitter
              </a>
            </li>
            <li>
              <a className="text-muted-foreground transition hover:text-foreground" href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        {common.footer.rights}
      </div>
    </footer>
  );
};
