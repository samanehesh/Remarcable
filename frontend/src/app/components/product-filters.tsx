import { Category } from "../types/category";
import { Tag } from "../types/tag";

type ProductFiltersProps = {
  categories: Category[];
  tags: Tag[];
  search: string;
  category: string;
  selectedTags: number[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagChange: (tagId: number) => void;
  onClear: () => void;
};

export default function ProductFilters({
  categories,
  tags,
  search,
  category,
  selectedTags,
  onSearchChange,
  onCategoryChange,
  onTagChange,
  onClear,
}: ProductFiltersProps) {
  const hasActiveFilters = Boolean(search || category || selectedTags.length);
  const activeFilterCount =
    (search ? 1 : 0) + (category ? 1 : 0) + selectedTags.length;

  return (
    <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-5"
            >
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </span>
          <span>
            <span className="flex items-center gap-2 font-semibold text-slate-900">
              Filters
              {hasActiveFilters && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </span>
            <span className="mt-0.5 block text-sm text-slate-500">
              {hasActiveFilters
                ? "Filters are applied to the product list"
                : "Search by description, category, or tags"}
            </span>
          </span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>

      <div className="border-t border-slate-200 px-5 py-6 sm:px-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-900">Refine products</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Results update automatically as you filter.
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            disabled={!hasActiveFilters}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Clear filters
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(14rem,1fr)]">
        <div>
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Search description
          </label>
          <div className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              id="search"
              type="search"
              value={search}
              placeholder='Try "wireless" or "portable"'
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        </div>

        <fieldset className="mt-6 border-t border-slate-100 pt-5">
        <legend className="mb-0 text-sm font-medium text-slate-700">Tags</legend>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);

            return (
              <label
                key={tag.id}
                className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm font-medium transition focus-within:ring-4 focus-within:ring-blue-100 ${
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => onTagChange(tag.id)}
                />
                {tag.name}
              </label>
            );
          })}
        </div>
        </fieldset>
      </div>
    </details>
  );
}
