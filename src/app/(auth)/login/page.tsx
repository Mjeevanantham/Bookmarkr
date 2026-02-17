import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/Bookmarkr_favicon.png"
            alt="Bookmarkr Logo"
            width={64}
            height={64}
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Sign. in.
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border border-gray-200 bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 dark:border-gray-800 dark:bg-black">
          <div className="space-y-6">
            <p className="text-center text-sm text-gray-500">
              Supabase Auth Form goes here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
