import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🏏</div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          404 - Not Found
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get
          you back to the IPL action!
        </p>
        <Link
          href="/"
          className="bg-gradient-primary text-white px-6 py-3 rounded-xl hover:shadow-elegant transition-all duration-300 inline-block"
        >
          Back to IPL Vista Dashboard
        </Link>
      </div>
    </div>
  );
}
