import { useMemo } from "react";
import { DataProcessor } from "./types";
import { useUserProcessedData } from "./use-user-processed-data";
import { DataFilter } from "./data-filter";

/**
 * Manages the use of user input to filter (search) arbitrary data given a set object keys.
 *
 * @param data Data to filter/search on.
 * @param keys Object keys of a single data item to search on. For nested objects use dot syntax, e.g. `"fruit.shape"`. See: https://fusejs.io/api/options.html#keys.
 * @param filter Optional object that can filter user data.
 * @returns [query, setQuery, results]
 */
export function useFilteredData<TData>(
  data: TData[],
  keys?: string[],
  filter?: DataProcessor<TData[]>,
  initialQuery?: string
): [string, (terms: string) => void, TData[]] {
  const processor = useMemo(
    () => filter ?? new DataFilter<TData>(data, keys),
    [data, keys, filter]
  );

  return useUserProcessedData(data, processor, initialQuery);
}
