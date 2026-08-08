import { Suspense } from "react";

import ProductsPage from "./components/products-page";

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100 motion-reduce:animate-none" />
        </main>
      }
    >
      <ProductsPage />
    </Suspense>
  );
}
