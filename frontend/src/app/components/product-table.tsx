"use client";

import { useMemo, useState } from "react";

import { Product } from "../types/product";

type ProductTableProps = {
  products: Product[];
  isLoading: boolean;
};

type SortKey = "name" | "category";
type SortDirection = "ascending" | "descending";

export default function ProductTable({
  products,
  isLoading,
}: ProductTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("ascending");

  const sortedProducts = useMemo(() => {
    return [...products].sort((first, second) => {
      const firstValue =
        sortKey === "name" ? first.name : first.category.name;
      const secondValue =
        sortKey === "name" ? second.name : second.category.name;
      const comparison = firstValue.localeCompare(secondValue, undefined, {
        sensitivity: "base",
      });

      return sortDirection === "ascending" ? comparison : -comparison;
    });
  }, [products, sortDirection, sortKey]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((current) =>
        current === "ascending" ? "descending" : "ascending"
      );
      return;
    }

    setSortKey(key);
    setSortDirection("ascending");
  }

  function sortIcon(key: SortKey) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className={`size-4 ${sortKey === key ? "text-blue-600" : "text-slate-400"}`}
      >
        {sortKey === key && sortDirection === "descending" ? (
          <path d="m4 6 4 4 4-4" />
        ) : (
          <path d="m4 10 4-4 4 4" />
        )}
      </svg>
    );
  }

  return (
    <section
      className="mt-10"
      aria-labelledby="results-heading"
      aria-busy={isLoading}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 id="results-heading" className="text-2xl font-semibold">
          Products
        </h2>
        <p
          className="flex items-center gap-2 text-sm text-slate-500"
          aria-live="polite"
        >
          {isLoading ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 motion-reduce:animate-none" />
              Loading products…
            </>
          ) : (
            <>
              {products.length} {products.length === 1 ? "product" : "products"}
            </>
          )}
        </p>
      </div>

      <div className="grid gap-4 md:hidden">
        {isLoading ? (
          Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm motion-reduce:animate-none"
              aria-hidden="true"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="h-5 w-2/5 rounded bg-slate-200" />
                <div className="h-6 w-24 rounded-md bg-slate-100" />
              </div>
              <div className="mt-5 space-y-2.5">
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-11/12 rounded bg-slate-100" />
                <div className="h-3 w-3/5 rounded bg-slate-100" />
              </div>
              <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                <div className="h-6 w-16 rounded-full bg-slate-100" />
                <div className="h-6 w-20 rounded-full bg-slate-100" />
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500 shadow-sm">
            No products match the selected filters.
          </div>
        ) : (
          sortedProducts.map((product) => (
            <article
              key={product.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">
                  {product.name}
                </h3>
                <span className="shrink-0 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {product.category.name}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {product.description}
              </p>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.length === 0 ? (
                    <span className="text-sm text-slate-400">No tags</span>
                  ) : (
                    product.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {tag.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-3xl border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th
                scope="col"
                className="px-5 py-4 font-semibold"
                aria-sort={sortKey === "name" ? sortDirection : "none"}
              >
                <button
                  type="button"
                  onClick={() => handleSort("name")}
                  className="flex appearance-none items-center gap-1.5 rounded border-0 bg-transparent p-0 text-left text-xs font-semibold uppercase tracking-wide outline-none transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                >
                  Name
                  {sortIcon("name")}
                </button>
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Description
              </th>
              <th
                scope="col"
                className="px-5 py-4 font-semibold"
                aria-sort={sortKey === "category" ? sortDirection : "none"}
              >
                <button
                  type="button"
                  onClick={() => handleSort("category")}
                  className="flex appearance-none items-center gap-1.5 rounded border-0 bg-transparent p-0 text-left text-xs font-semibold uppercase tracking-wide outline-none transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                >
                  Category
                  {sortIcon("category")}
                </button>
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Tags
              </th>
            </tr>
          </thead>
          <tbody className="[&>tr:not(:last-child)>*]:border-b [&>tr>*]:border-slate-200">
            {isLoading ? (
              Array.from({ length: 5 }, (_, index) => (
                <tr
                  key={index}
                  className="animate-pulse motion-reduce:animate-none"
                  aria-hidden="true"
                >
                  <td className="px-5 py-5">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                  </td>
                  <td className="px-5 py-5">
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-slate-100" />
                      <div className="h-3 w-4/5 rounded bg-slate-100" />
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <div className="h-4 w-24 rounded bg-slate-100" />
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-slate-100" />
                      <div className="h-6 w-20 rounded-full bg-slate-100" />
                    </div>
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-slate-500"
                >
                  No products match the selected filters.
                </td>
              </tr>
            ) : (
              sortedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="align-top transition-colors hover:bg-slate-50"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900"
                  >
                    {product.name}
                  </th>
                  <td className="max-w-md px-5 py-4 leading-6 text-slate-600">
                    {product.description}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                    {product.category.name}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex min-w-48 flex-wrap gap-2">
                      {product.tags.length === 0 ? (
                        <span className="text-slate-400">No tags</span>
                      ) : (
                        product.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                          >
                            {tag.name}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
