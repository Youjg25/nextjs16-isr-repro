// Stub of the production supabase server client. The actual production app
// uses @supabase/supabase-js / @supabase/ssr; here we mimic the call shape
// so the page's `await client.from(...).select(...)` chain resolves the same
// way during build-time SSG prerender. This keeps the bug surface honest:
// it's not the supabase package itself that triggers the bug — production
// experiment 2A ruled that out — but the async fetch happening at prerender
// is part of the page's shape.

interface QueryBuilder {
  select: (cols: string) => QueryBuilder;
  eq: (col: string, value: unknown) => QueryBuilder;
  or: (filter: string) => QueryBuilder;
  order: (col: string, opts: { ascending: boolean }) => QueryBuilder;
  limit: (n: number) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
}

function makeBuilder(): QueryBuilder {
  const self: QueryBuilder = {
    select: () => self,
    eq: () => self,
    or: () => self,
    order: () => self,
    limit: async () => ({ data: [], error: null }),
  };
  return self;
}

export function createPublicClient() {
  return {
    from: (_table: string) => makeBuilder(),
  };
}
