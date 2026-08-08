"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Category } from "../types/category";
import { Product } from "../types/product";
import { Tag } from "../types/tag";
import ProductFilters from "./product-filters";
import ProductTable from "./product-table";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ??
  "http://127.0.0.1:8000";

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [filterRetryKey, setFilterRetryKey] = useState(0);
  const [productRetryKey, setProductRetryKey] = useState(0);

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const selectedTags = useMemo(
    () =>
      searchParams
        .getAll("tags")
        .map(Number)
        .filter((tagId) => Number.isInteger(tagId) && tagId > 0),
    [searchParams]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadFilterOptions() {
      try {
        const [categoryResponse, tagResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories/`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/tags/`, {
            signal: controller.signal,
          }),
        ]);

        if (!categoryResponse.ok || !tagResponse.ok) {
          throw new Error("Filter options request failed");
        }

        const [categoryData, tagData] = await Promise.all([
          categoryResponse.json(),
          tagResponse.json(),
        ]);

        setCategories(categoryData);
        setTags(tagData);
        setFilterError(null);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Unable to load filter options", error);
          setFilterError(
            "We couldn't load the categories and tags. Please try again."
          );
        }
      }
    }

    loadFilterOptions();

    return () => controller.abort();
  }, [filterRetryKey]);

  useEffect(() => {
    const controller = new AbortController();
    const debounceTimer = window.setTimeout(async () => {
      setIsLoading(true);
      setProductError(null);
      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }

      if (category) {
        params.append("category", category);
      }

      selectedTags.forEach((tagId) => {
        params.append("tags", tagId.toString());
      });

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products/?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Products request failed with ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Unable to load products", error);
          setProductError(
            "We couldn't load the products. Check your connection and try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [search, category, selectedTags, productRetryKey]);

  function updateFilters(updates: {
    search?: string;
    category?: string;
    selectedTags?: number[];
  }) {
    setProductError(null);
    const params = new URLSearchParams(searchParams.toString());

    if (updates.search !== undefined) {
      if (updates.search) {
        params.set("search", updates.search);
      } else {
        params.delete("search");
      }
    }

    if (updates.category !== undefined) {
      if (updates.category) {
        params.set("category", updates.category);
      } else {
        params.delete("category");
      }
    }

    if (updates.selectedTags !== undefined) {
      params.delete("tags");
      updates.selectedTags.forEach((tagId) => {
        params.append("tags", tagId.toString());
      });
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleTagChange(tagId: number) {
    updateFilters({
      selectedTags: selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId],
    });
  }

  function handleClear() {
    router.replace(pathname, { scroll: false });
  }

  function retryFilterOptions() {
    setFilterError(null);
    setFilterRetryKey((current) => current + 1);
  }

  function retryProducts() {
    setProductError(null);
    setIsLoading(true);
    setProductRetryKey((current) => current + 1);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ProductFilters
        categories={categories}
        tags={tags}
        search={search}
        category={category}
        selectedTags={selectedTags}
        onSearchChange={(value) => updateFilters({ search: value })}
        onCategoryChange={(value) => updateFilters({ category: value })}
        onTagChange={handleTagChange}
        onClear={handleClear}
      />

      {filterError && (
        <div
          role="alert"
          className="mt-4 flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mt-0.5 size-5 shrink-0 text-amber-600"
            >
              <path d="M12 9v4m0 4h.01" />
              <path d="M10.3 4.3 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
            </svg>
            <div>
              <p className="font-semibold">Filters are unavailable</p>
              <p className="mt-1 text-sm text-amber-800">{filterError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={retryFilterOptions}
            className="self-start rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 sm:self-auto"
          >
            Try again
          </button>
        </div>
      )}

      <ProductTable
        products={products}
        isLoading={isLoading}
        error={productError}
        onRetry={retryProducts}
      />
    </main>
  );
}
