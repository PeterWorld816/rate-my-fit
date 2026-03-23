import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">🔥 Rate My Fit</h1>

      <Link href="/upload">
        <button className="px-6 py-3 bg-black text-white rounded-xl">
          Upload Your Outfit
        </button>
      </Link>

      <Link href="/rate">
        <button className="px-6 py-3 bg-gray-200 rounded-xl">
          Rate Others
        </button>
      </Link>
    </main>
  );
}