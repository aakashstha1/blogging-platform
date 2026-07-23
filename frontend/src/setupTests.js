import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Ensures each test starts with a clean DOM, so component state/markup
// from one test can't leak into the next.
afterEach(() => {
  cleanup();
});
