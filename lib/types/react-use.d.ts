declare module "react-use" {
    import { RefObject } from "react";

    export function useIntersection(
        ref: RefObject<HTMLElement | null>,
        options?: IntersectionObserverInit
    ): IntersectionObserverEntry | null;
}
