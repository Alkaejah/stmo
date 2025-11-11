"use client";
import Link from "next/link";
import {
  Bell,
  Bolt,
  CircleUser,
  CreditCard,
  Home,
  LockKeyhole,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/common/components/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/shadcn/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/components/shadcn/ui/dropdown-menu";
import { Input } from "@/common/components/shadcn/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/common/components/shadcn/ui/sheet";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex">
      <div className="sticky top-0 hidden border-r bg-muted/40 md:block h-screen w-72">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Acme Inc</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/dashboard"
                    ? "text-primary bg-gray-200 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>

              <Link
                href="/settings"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/settings"
                    ? "text-primary bg-gray-200 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <Bolt className="h-4 w-4" />
                Settings
              </Link>
              <Link
                href="/privacy"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/privacy"
                    ? "text-primary bg-gray-200 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <LockKeyhole className="h-4 w-4" />
                Privacy{" "}
              </Link>
              <Link
                href="/people"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/people"
                    ? "text-primary bg-gray-200 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <Users className="h-4 w-4" />
                People
              </Link>
              <Link
                href="/billing-plans"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/billing-plans"
                    ? "text-primary bg-gray-200 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Billing Plans
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="w-full">
        <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/dashboard"
                      ? "text-primary bg-gray-200 font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/settings"
                      ? "text-primary bg-gray-200 font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  <Bolt className="h-5 w-5" />
                  Settings
                </Link>
                <Link
                  href="/privacy"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/privacy"
                      ? "text-primary bg-gray-200 font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  <LockKeyhole className="h-5 w-5" />
                  Privacy
                </Link>
                <Link
                  href="/people"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/people"
                      ? "text-primary bg-gray-200 font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  <Users className="h-5 w-5" />
                  People
                </Link>
                <Link
                  href="/billing-plans"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/billing-plans"
                      ? "text-primary bg-gray-200 font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  Billing Plans
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 lg:gap-6 lg:px-6 overflow-y-visible">
          {children}
        </main>
      </div>
    </div>
  );
}
