export default function DashboardPage() {
  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-foreground">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="flex h-96 items-center justify-center rounded-lg border-4 border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-gray-500">Protected Content</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
