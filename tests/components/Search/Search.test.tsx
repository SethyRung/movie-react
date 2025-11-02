import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../test-utils";
import Search from "@components/Search/Search";

// Mock Icon component
interface MockIconProps {
  icon: string;
  className?: string;
  [key: string]: unknown;
}

vi.mock("@iconify/react", () => ({
  Icon: ({ icon, className, ...props }: MockIconProps) => (
    <div data-testid={`icon-${icon}`} className={className} {...props}>
      {icon}
    </div>
  ),
}));

describe("Search Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Basic Rendering", () => {
    it("renders with default props", () => {
      render(<Search />);

      const input = screen.getByPlaceholderText("Search here");
      const searchIcon = screen.getByTestId("icon-mdi-magnify");

      expect(input).toBeInTheDocument();
      expect(searchIcon).toBeInTheDocument();
      expect(input).toHaveValue("");
    });

    it("renders with custom placeholder", () => {
      render(<Search placeholder="Search movies..." />);

      expect(screen.getByPlaceholderText("Search movies...")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<Search className="custom-search-class" />);

      const container = screen.getByPlaceholderText("Search here").closest("div");
      expect(container).toHaveClass("custom-search-class");
    });

    it("renders different sizes correctly", () => {
      const { rerender } = render(<Search size="sm" />);
      let input = screen.getByRole("textbox");
      expect(input).toHaveClass("h-8", "text-sm");

      rerender(<Search size="lg" />);
      input = screen.getByRole("textbox");
      expect(input).toHaveClass("h-12", "text-lg");
    });
  });

  describe("Uncontrolled Mode", () => {
    it("manages internal state correctly", () => {
      render(<Search onSearch={vi.fn()} />);

      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "test query" } });
      expect(input).toHaveValue("test query");
    });

    it("calls onSearch with debounced input", async () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} debounceMs={500} />);

      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "test" } });
      expect(onSearch).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);

      // Flush promises and check if callback was called
      await vi.runAllTimersAsync();
      expect(onSearch).toHaveBeenCalledWith("test");
    });

    it("cancels previous timeout on rapid input", async () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} debounceMs={500} />);

      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "t" } });
      fireEvent.change(input, { target: { value: "te" } });
      fireEvent.change(input, { target: { value: "test" } });

      vi.advanceTimersByTime(500);

      // Flush promises and check if callback was called
      await vi.runAllTimersAsync();
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith("test");
    });
  });

  describe("Controlled Mode", () => {
    it("uses controlled value", () => {
      render(<Search value="controlled value" onChange={vi.fn()} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("controlled value");
    });

    it("calls onChange when value changes", () => {
      const onChange = vi.fn();
      render(<Search value="" onChange={onChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "new value" } });

      expect(onChange).toHaveBeenCalledWith("new value");
    });

    it("calls onSearch when controlled value changes", async () => {
      const onSearch = vi.fn();
      const onChange = vi.fn();
      render(<Search value="" onChange={onChange} onSearch={onSearch} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "controlled test" } });

      vi.advanceTimersByTime(300);

      // Flush promises and check if callback was called
      await vi.runAllTimersAsync();
      expect(onSearch).toHaveBeenCalledWith("controlled test");
    });
  });

  describe("Keyboard Interactions", () => {
    it("calls onSearch immediately on Enter key", () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} />);

      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "test query" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(onSearch).toHaveBeenCalledWith("test query");
    });

    it("cancels debounce when Enter is pressed", async () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} debounceMs={1000} />);

      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(onSearch).toHaveBeenCalledWith("test");

      vi.advanceTimersByTime(1000);
      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it("handles other keys without triggering search", async () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} />);

      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.keyDown(input, { key: "Escape" });
      fireEvent.keyDown(input, { key: "Tab" });

      vi.advanceTimersByTime(300);

      // Flush promises and check if callback was called
      await vi.runAllTimersAsync();
      expect(onSearch).toHaveBeenCalledWith("test");
    });
  });

  describe("Clear Functionality", () => {
    it("shows clear button when value is present", () => {
      render(<Search value="test query" onChange={vi.fn()} />);

      const clearButton = screen.getByLabelText("Clear search");
      expect(clearButton).toBeInTheDocument();
    });

    it("does not show clear button when value is empty", () => {
      render(<Search value="" onChange={vi.fn()} />);

      expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
    });

    it("clears value when clear button is clicked (controlled)", () => {
      const onChange = vi.fn();
      const onSearch = vi.fn();
      render(<Search value="test query" onChange={onChange} onSearch={onSearch} />);

      const clearButton = screen.getByLabelText("Clear search");
      fireEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledWith("");
      expect(onSearch).toHaveBeenCalledWith("");
    });

    it("clears value when clear button is clicked (uncontrolled)", () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "test query" } });

      const clearButton = screen.getByLabelText("Clear search");
      fireEvent.click(clearButton);

      expect(input).toHaveValue("");
      expect(onSearch).toHaveBeenCalledWith("");
    });

    it("focuses input after clearing", () => {
      render(<Search value="test" onChange={vi.fn()} />);

      const input = screen.getByRole("textbox");
      const clearButton = screen.getByLabelText("Clear search");

      input.blur();
      expect(document.activeElement).not.toBe(input);

      fireEvent.click(clearButton);
      expect(document.activeElement).toBe(input);
    });
  });

  describe("Focus States", () => {
    it("updates search icon color on focus", () => {
      render(<Search />);

      const input = screen.getByRole("textbox");
      const searchIcon = screen.getByTestId("icon-mdi-magnify");

      expect(searchIcon).not.toHaveClass("text-primary");

      fireEvent.focus(input);
      expect(searchIcon).toHaveClass("text-primary");

      fireEvent.blur(input);
      expect(searchIcon).not.toHaveClass("text-primary");
    });

    it("applies focus styles to input", () => {
      render(<Search />);

      const input = screen.getByRole("textbox");
      fireEvent.focus(input);

      expect(input).toHaveClass("focus:border-primary", "focus:ring-primary");
    });
  });

  describe("Debounce Behavior", () => {
    it("uses custom debounce time", async () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} debounceMs={100} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "test" } });

      vi.advanceTimersByTime(50);
      expect(onSearch).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);

      // Flush promises and check if callback was called
      await vi.runAllTimersAsync();
      expect(onSearch).toHaveBeenCalledWith("test");
    });

    it("cleans up timeout on unmount", () => {
      const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
      const { unmount } = render(<Search onSearch={vi.fn()} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "test" } });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels", () => {
      render(<Search value="test" onChange={vi.fn()} />);

      const clearButton = screen.getByLabelText("Clear search");
      expect(clearButton).toBeInTheDocument();
    });

    it("supports keyboard navigation", () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} />);

      const input = screen.getByRole("textbox");

      // Focus the input
      input.focus();
      expect(input).toHaveFocus();

      // Type and press Enter
      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(onSearch).toHaveBeenCalledWith("test");
    });

    it("maintains focus during interactions", () => {
      render(<Search value="test" onChange={vi.fn()} />);

      const input = screen.getByRole("textbox");
      const clearButton = screen.getByLabelText("Clear search");

      // Focus the input directly
      input.focus();
      expect(input).toHaveFocus();

      fireEvent.click(clearButton);
      // The clear function should refocus the input
      expect(input).toHaveFocus(); // Should refocus after clearing
    });
  });

  describe("Edge Cases", () => {
    it("handles empty search query", async () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} />);

      const input = screen.getByRole("textbox");

      // First type something, then clear it
      fireEvent.change(input, { target: { value: "test" } });
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();

      // Clear the input
      fireEvent.change(input, { target: { value: "" } });
      vi.advanceTimersByTime(300);

      // Flush promises and check if callback was called
      await vi.runAllTimersAsync();
      expect(onSearch).toHaveBeenCalledWith("");
    });

    it("handles special characters in search", async () => {
      const onSearch = vi.fn();
      render(<Search onSearch={onSearch} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "test@#$%^&*()" } });

      vi.advanceTimersByTime(300);

      // Flush promises and check if callback was called
      await vi.runAllTimersAsync();
      expect(onSearch).toHaveBeenCalledWith("test@#$%^&*()");
    });

    it("handles long search queries", async () => {
      const onSearch = vi.fn();
      const longQuery = "a".repeat(1000);
      render(<Search onSearch={onSearch} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: longQuery } });

      vi.advanceTimersByTime(300);

      // Flush promises and check if callback was called
      await vi.runAllTimersAsync();
      expect(onSearch).toHaveBeenCalledWith(longQuery);
    });
  });
});
