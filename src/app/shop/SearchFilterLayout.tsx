"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ProductsSort } from "@/wix-api/products";
import { collections } from "@wix/stores";
import {
  useRouter,
  useSearchParams
} from "next/navigation";
import {
  useEffect,
  useOptimistic,
  useState,
  useTransition
} from "react";

interface SearchFilterLayoutProps {
  collections: collections.Collection[];
  children: React.ReactNode;
}

export default function SearchFilterLayout({
  collections,
  children
}: SearchFilterLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [
    optimisticFilters,
    setOptimisticFilters
  ] = useOptimistic({
    collection: searchParams.getAll("collection"),
    price_min: searchParams.get("price_min") || undefined,
    price_max: searchParams.get("price_max") || undefined,
    sort: searchParams.get("sort") || undefined
  });
  const [
    isPending,
    startTransition
  ] = useTransition();

  function updateFilters(updates: Partial<typeof optimisticFilters>) {
    const newState = {
      ...optimisticFilters,
      ...updates
    };
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(newState).forEach(([key, value]) => {
      newSearchParams.delete(key);

      if (Array.isArray(value)) {
        value.forEach(v => newSearchParams.append(key, v));
      } else if (value) {
        newSearchParams.set(key, value);
      }
    });

    newSearchParams.delete("page");

    startTransition(() => {
      setOptimisticFilters(newState);
      router.push(`?${newSearchParams.toString()}`);
    });
  }
  
  return (
    <main className="flex flex-col gap-10 group items-center justify-center lg:flex-row lg:items-start px-5 py-10">
      <aside
        className="h-fit lg:sticky lg:top-10 lg:w-64 space-y-5"
        data-pending={isPending ? "" : undefined}
      >
        <CollectionsFilter
          collections={collections}
          selectedCollectionIds={optimisticFilters.collection}
          updateCollectionIds={(collectionIds) => updateFilters({
            collection: collectionIds
          })}
        />
        <PriceFilter
          maxDefaultInput={optimisticFilters.price_max}
          minDefaultInput={optimisticFilters.price_min}
          updatePriceRange={(priceMin, priceMax) => updateFilters({
            price_min: priceMin,
            price_max: priceMax
          })}
        />
      </aside>
      <div className="max-w-7xl space-y-5 w-full">
        <div className="flex justify-center lg:justify-end">
          <SortFilter
            sort={optimisticFilters.sort}
            updateSort={(sort) => updateFilters({ sort })}
          />
        </div>
        {children}
      </div>
    </main>
  );
}

interface CollectionsFilterProps {
  collections: collections.Collection[];
  selectedCollectionIds: string[];
  updateCollectionIds: (collectionIds: string[]) => void;
}

function CollectionsFilter({
  collections,
  selectedCollectionIds,
  updateCollectionIds
}: CollectionsFilterProps) {
  return (
    <div className="space-y-3">
      <div className="font-bold">
        Collections
      </div>
      <ul className="space-y-1.5">
        {
          collections.map((collection) => {
            const collectionId = collection._id;
            if (!collectionId) return null;
            return (
              <li key={collectionId}>
                <label className="cursor-pointer flex font-medium gap-2 items-center">
                  <Checkbox
                    checked={selectedCollectionIds.includes(collectionId)}
                    id={collectionId}
                    onCheckedChange={(checked) => {
                      updateCollectionIds(
                        checked
                          ? [...selectedCollectionIds, collectionId] 
                          : selectedCollectionIds.filter(
                            (id) => id !== collectionId
                          )
                      );
                    }}
                  />
                  <span className="break-all line-clamp-1">
                    {collection.name}
                  </span>
                </label>
              </li>
            );
          })
        }
      </ul>
      {
        selectedCollectionIds.length > 0 && (
          <button
            className="hover:underline text-destructive text-sm"
            onClick={() => updateCollectionIds([])}
          >
            Clear
          </button>
        )
      }
    </div>
  );
}

interface PriceFilterProps {
  minDefaultInput: string | undefined;
  maxDefaultInput: string | undefined;
  updatePriceRange: (
    min: string | undefined,
    max: string | undefined
  ) => void;
}

function PriceFilter({
  minDefaultInput,
  maxDefaultInput,
  updatePriceRange
}: PriceFilterProps) {
  const [
    minInput,
    setMinInput
  ] = useState(minDefaultInput);
  const [
    maxInput,
    setMaxInput
  ] = useState(maxDefaultInput);

  useEffect(() => {
    setMinInput(minDefaultInput || "");
    setMaxInput(maxDefaultInput || "");
  }, [
    minDefaultInput,
    maxDefaultInput
  ]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    updatePriceRange(minInput, maxInput);
  }

  return (
    <div className="space-y-3">
      <div className="font-bold">
        Price range
      </div>
      <form
        className="flex gap-2 items-center"
        onSubmit={onSubmit}
      >
        <Input
          className="w-20"
          name="min"
          onChange={(e) => setMinInput(e.target.value)}
          placeholder="min"
          type="number"
          value={minInput}
        />
        <span>-</span>
        <Input
          className="w-20"
          name="max"
          onChange={(e) => setMaxInput(e.target.value)}
          placeholder="max"
          type="number"
          value={maxInput}
        />
        <Button type="submit">Go</Button>
      </form>
      {
        (!!minDefaultInput || !!maxDefaultInput) && (
          <button
            className="hover:underline text-destructive text-sm"
            onClick={() => updatePriceRange(undefined, undefined)}
          >
            Clear
          </button>
        )
      }
    </div>
  );
}

interface SortFilterProps {
  sort: string | undefined;
  updateSort: (value: ProductsSort) => void;
}

function SortFilter({
  sort,
  updateSort
}: SortFilterProps) {
  return (
    <Select
      onValueChange={updateSort}
      value={sort || "last_updated"}
    >
      <SelectTrigger className="gap-2 text-start w-fit">
        <span>
          Sort by: <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="last_updated">Newest</SelectItem>
        <SelectItem value="price_asc">Price &#40;Low to High&#41;</SelectItem>
        <SelectItem value="price_desc">Price &#40;High to Low&#41;</SelectItem>
      </SelectContent>
    </Select>
  );
}
