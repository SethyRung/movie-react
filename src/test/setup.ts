import { afterEach } from "vitest";
import { restoreFetch } from "./fetch-mock";

afterEach(() => {
  restoreFetch();
});
