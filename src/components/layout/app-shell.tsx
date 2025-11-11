"use client";

import { GraduationCap, LayoutDashboard, Library, LogOut, Menu, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import { getCommonTranslations, type AppNavLabelKey } from "@/lib/common-translations";

type NavItem = {
  href: string;
  labelKey: AppNavLabelKey;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navigationByRole: Record<string, NavItem[]> = {
  STUDENT: [
    { href: "/app/dashboard", labelKey: "studentDashboard", icon: LayoutDashboard },
    { href: "/app/courses", labelKey: "studentCourses", icon: GraduationCap },
    { href: "/app/books", labelKey: "books", icon: Library },
  ],
  TEACHER: [
    { href: "/app/teacher/dashboard", labelKey: "teacherDashboard", icon: LayoutDashboard },
    { href: "/app/teacher/courses", labelKey: "teacherCourses", icon: GraduationCap },
    { href: "/app/teacher/schedule", labelKey: "teacherSchedule", icon: Users2 },
    { href: "/app/books", labelKey: "books", icon: Library },
  ],
  ADMIN: [
    { href: "/app/teacher/dashboard", labelKey: "teacherDashboard", icon: LayoutDashboard },
    { href: "/app/teacher/courses", labelKey: "teacherCourses", icon: GraduationCap },
    { href: "/app/teacher/schedule", labelKey: "teacherSchedule", icon: Users2 },
    { href: "/app/admin/users", labelKey: "adminUsers", icon: Users2 },
    { href: "/app/books", labelKey: "books", icon: Library },
  ],
};

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const common = getCommonTranslations(language);
  const navLabels = common.appNav.labels;

  const navigation = navigationByRole[user?.role ?? "STUDENT"] ?? [];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden h-full w-64 flex-col border-r border-border/60 bg-muted/20 p-4 md:flex">
        <div className="mb-6 flex select-none items-center gap-2 text-base font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-xs text-primary-foreground">OE</span>
          OzgesheEdu
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted/60 hover:text-foreground",
                    isActive && "bg-muted text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {navLabels[item.labelKey]}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <Separator className="my-4" />
        <div className="space-y-3">
          <LanguageToggle />
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="font-semibold text-foreground">{user?.name}</div>
            <div className="text-xs uppercase tracking-wide">{user?.role}</div>
          </div>
          <Button variant="ghost" className="justify-start gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            {common.auth.logout}
          </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/90 px-4 backdrop-blur md:hidden">
          <div className="select-none font-semibold">
            OzgesheEdu
          </div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle>{common.appNav.mobileTitle}</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
                      >
                        <Icon className="h-4 w-4" />
                        {navLabels[item.labelKey]}
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-6">
                  <LanguageToggle />
                </div>
              </SheetContent>
              </Sheet>
            <Button variant="outline" size="sm" onClick={logout}>
              {common.auth.logout}
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background/60 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
