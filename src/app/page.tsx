export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <div className="text-center p-8 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          Hello, Next.js! 🎉
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          You’re now running Tailwind CSS with the App Router.
        </p>
        <button className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition-all">
          Get Started
        </button>
      </div>
    </main>
  );
}
