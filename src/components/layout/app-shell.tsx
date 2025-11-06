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

const navigationByRole: Record<string, Array<{ href: string; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }>> = {
  STUDENT: [
    { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/courses", label: "My Courses", icon: GraduationCap },
    { href: "/app/books", label: "Book Store", icon: Library },
  ],
  TEACHER: [
    { href: "/app/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/teacher/courses", label: "Courses", icon: GraduationCap },
    { href: "/app/teacher/schedule", label: "Schedule", icon: Users2 },
    { href: "/app/books", label: "Book Store", icon: Library },
  ],
  ADMIN: [
    { href: "/app/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/teacher/courses", label: "Courses", icon: GraduationCap },
    { href: "/app/teacher/schedule", label: "Schedule", icon: Users2 },
    { href: "/app/admin/users", label: "Users", icon: Users2 },
    { href: "/app/books", label: "Book Store", icon: Library },
  ],
};

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = navigationByRole[user?.role ?? "STUDENT"] ?? [];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-border/60 bg-muted/20 p-4 md:flex">
        <Link href="/" className="mb-6 flex items-center gap-2 text-base font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-xs text-primary-foreground">LF</span>
          LinguaFlow
        </Link>
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
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <Separator className="my-4" />
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="font-semibold text-foreground">{user?.name}</div>
          <div className="text-xs uppercase tracking-wide">{user?.role}</div>
        </div>
        <Button variant="ghost" className="mt-4 justify-start gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/90 px-4 backdrop-blur md:hidden">
          <Link href="/" className="font-semibold">
            LinguaFlow
          </Link>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle>Navigate</SheetTitle>
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
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 bg-background/60 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
