import { Navigation } from "@/components/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full bg-slate-100 min-h-screen">
      <aside className="p-4 lg:p-6 w-[150px] h-screen fixed left-0 top-0 lg:block hidden">
        <Navigation />
      </aside>
      <main className="lg:pl-[150px] min-h-screen w-full">
        <div className="w-full p-3 lg:hidden sticky top-0 z-10">
          <Navigation />
        </div>
        {children}
      </main>
    </section>
  );
}
