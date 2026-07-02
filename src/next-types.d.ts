declare module "next/types.js" {
  import type { Metadata, Viewport } from "next";
  import type { AppRoutes, LayoutRoutes, ParamMap } from "next/dist/build/routes";

  export type ResolvingMetadata<T extends AppRoutes | LayoutRoutes> = (
    parent: Metadata
  ) => Promise<Metadata>;

  export type ResolvingViewport<T extends AppRoutes | LayoutRoutes> = (
    parent: Viewport
  ) => Promise<Viewport>;
}
