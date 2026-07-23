import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar"; // adjust path if Navbar lives elsewhere

// Mock the hooks Navbar depends on so this test doesn't need a real
// backend, real auth state, or real network requests.
vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/queries/useSearchPost", () => ({
  useSearchPosts: vi.fn(() => ({ data: undefined, isFetching: false })),
}));

import { useAuth } from "@/hooks/useAuth";

// Navbar needs a Router (for Link/useLocation/useNavigate) and a
// QueryClientProvider (for the useSearchPosts hook it renders internally).
// `route` lets tests control the current pathname, since Navbar now
// conditionally hides the desktop nav + search on "/" (the landing page).
function renderNavbar(route = "/feeds") {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Navbar />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Navbar", () => {
  it("shows Log in / Get started when the user is a guest", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });

    renderNavbar();

    expect(screen.getByText("Quill")).toBeInTheDocument();
    // "Log in" / "Get started" render twice: once in the desktop auth
    // area, once in the mobile Sheet's guest fallback — so we assert
    // at least one instance exists rather than exactly one.
    expect(screen.getAllByText("Log in").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Get started").length).toBeGreaterThan(0);
    expect(screen.queryByText("Write")).not.toBeInTheDocument();
  });

  it("shows the Write button and avatar when the user is authenticated", () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { username: "jane", avatar: null },
      logout: vi.fn(),
    });

    renderNavbar();

    // "Write" also renders twice: desktop link + mobile Sheet button.
    expect(screen.getAllByText("Write").length).toBeGreaterThan(0);
    // AvatarFallback renders the first letter of the username, uppercased
    expect(screen.getByText("J")).toBeInTheDocument();
    expect(screen.queryByText("Log in")).not.toBeInTheDocument();
  });

  it("renders all primary nav links", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });

    renderNavbar();

    // Each link renders twice: desktop <nav> + mobile Sheet — so check
    // for at least one instance of each rather than a single unique match.
    ["My Feed", "Trending", "Recommended", "About", "My Posts"].forEach(
      (label) => {
        expect(screen.getAllByText(label).length).toBeGreaterThan(0);
      },
    );
  });

  it('hides the desktop nav links on the landing page ("/")', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });

    renderNavbar("/");

    // On "/" the desktop <nav> is not rendered at all — but the mobile
    // Sheet's link list is unconditional, so each label still appears
    // exactly once (from the Sheet), not zero or two times.
    ["My Feed", "Trending", "Recommended", "About", "My Posts"].forEach(
      (label) => {
        expect(screen.getAllByText(label)).toHaveLength(1);
      },
    );
  });

  it("renders one fewer button on the landing page (the hidden search toggle)", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });

    const { container: landingContainer, unmount } = renderNavbar("/");
    const landingButtonCount =
      landingContainer.querySelectorAll("button").length;
    unmount();

    const { container: feedsContainer } = renderNavbar("/feeds");
    const feedsButtonCount = feedsContainer.querySelectorAll("button").length;

    // NavSearch's icon-only toggle button only exists off the landing page.
    expect(feedsButtonCount).toBe(landingButtonCount + 1);
  });
});
