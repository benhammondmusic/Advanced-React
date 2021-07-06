import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false,
    // first asks read function for the items

    // FIRST can return items if they're in cache

    // OTHER THING can return false (causes network req)
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      // filter() removes undefined items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // last page edge case
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // fetch  from server
        return false;
      }

      if (items.length) {
        // items are in cache
        return items;
      }

      return false; // failsafe if neither if statement works above, go to network
    },

    // merge runs when Apollo client comes back with our product
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      return merged;
    },
  };
}
