"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Category } from "../types/category";
import { Product } from "../types/product";
import { Tag } from "../types/tag";
import ProductFilters from "./product-filters";
import ProductTable from "./product-table";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

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
    fetch(`${API_BASE_URL}/api/categories/`)
      .then((response) => response.json())
      .then((data) => setCategories(data));

    fetch(`${API_BASE_URL}/api/tags/`)
      .then((response) => response.json())
      .then((data) => setTags(data));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const debounceTimer = window.setTimeout(async () => {
      setIsLoading(true);
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

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Unable to load products", error);
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
  }, [search, category, selectedTags]);

  function updateFilters(updates: {
    search?: string;
    category?: string;
    selectedTags?: number[];
  }) {
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

      <ProductTable products={products} isLoading={isLoading} />
    </main>
  );
}
