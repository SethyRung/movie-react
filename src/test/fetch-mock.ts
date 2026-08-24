type JsonInit = {
  status?: number;
};

export type FetchCall = {
  url: URL;
  init?: RequestInit;
};

type FetchImpl = (url: URL, init?: RequestInit) => Promise<Response>;

const originalFetch = globalThis.fetch;
const calls: FetchCall[] = [];
let impl: FetchImpl | null = null;

function toUrl(input: RequestInfo | URL): URL {
  if (input instanceof URL) return input;
  if (typeof input === "string") return new URL(input);
  return new URL(input.url);
}

export function mockFetch() {
  calls.length = 0;
  impl = async () => {
    throw new Error("mockFetch: no response configured. Call json() or error() first.");
  };

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = toUrl(input);
    calls.push({ url, init });
    if (!impl) throw new Error("mockFetch: not installed");
    return impl(url, init);
  }) as typeof fetch;

  return {
    handle(next: FetchImpl) {
      impl = next;
    },
    json(body: unknown, init: JsonInit = {}) {
      impl = async () =>
        new Response(JSON.stringify(body), {
          status: init.status ?? 200,
          headers: { "content-type": "application/json" },
        });
    },
    error(status: number, statusMessage = "The resource you requested could not be found.") {
      impl = async () =>
        new Response(JSON.stringify({ status_code: status, status_message: statusMessage }), {
          status,
          headers: { "content-type": "application/json" },
        });
    },
    network() {
      impl = async () => {
        throw new TypeError("Failed to fetch");
      };
    },
    get calls() {
      return calls;
    },
  };
}

export function restoreFetch() {
  globalThis.fetch = originalFetch;
  impl = null;
  calls.length = 0;
}
