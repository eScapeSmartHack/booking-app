export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to FastAPI + Next.js
        </h1>
        <p className="text-lg mb-8">
          Your full-stack application is ready to go!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Backend (FastAPI)</h2>
            <p>API running on http://localhost:8000</p>
            <a 
              href="http://localhost:8000/docs" 
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              View API Documentation →
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Frontend (Next.js)</h2>
            <p>App running on http://localhost:3000</p>
          </div>
        </div>
      </div>
    </main>
  );
}
