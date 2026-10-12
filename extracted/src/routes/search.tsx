import { createFileRoute, redirect } from "@tanstack/react-router";
import { readCatalogSearch } from "@/lib/anime/search-params";

export const Route = createFileRoute("/search")({
  validateSearch: (search) => readCatalogSearch(search as Record<string, unknown>),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/catalog", search });
  },
});
