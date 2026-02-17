import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24">
      <div className="relative mb-12 flex place-items-center">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
          src="/Bookmarkr_full_logo.png"
          alt="Bookmarkr Logo"
          width={300}
          height={100}
          priority
        />
      </div>

      <div className="grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-1">
        <Link
          href="/login"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Login{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 mx-auto max-w-[30ch] text-balance text-sm opacity-50`}>
            Access your smart bookmarks.
          </p>
        </Link>
      </div>
    </main>
  );
}
