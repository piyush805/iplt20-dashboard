import Link from "next/link";
import { APP_TEXT } from "@/constants/text";

export default function QuickActionsSection() {
  const quickActions = [
    {
      href: "/schedule",
      ...APP_TEXT.quickActions.schedule,
    },
    {
      href: "/points-table",
      ...APP_TEXT.quickActions.points,
    },
    {
      href: "/teams",
      ...APP_TEXT.quickActions.teams,
    },
  ];

  return (
    <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-card rounded-xl p-8 border border-border shadow-card">
        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
          {APP_TEXT.quickActions.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group bg-white dark:bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 border border-border"
            >
              <div className="text-center">
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {action.title}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
