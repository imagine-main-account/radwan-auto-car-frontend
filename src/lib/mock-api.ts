/**
 * Mock backend for local development and demos.
 *
 * - GET requests read the seed data from `public/mock-api/<resource>.json`.
 * - Writes are saved in localStorage, so changes survive a refresh (in this browser only).
 *
 * Endpoints (all responses are `{ data }`, errors are `{ message }`):
 *   POST /auth/login           { email, password } -> { token, user }
 *   GET  /auth/me              -> user
 *   POST /auth/logout
 *   PUT  /auth/password        { currentPassword, newPassword }
 *   POST /uploads              multipart "file" -> { url }
 *   GET|PUT /site-info | /hours | /hero | /banner | /seo
 *   GET|POST /services | /reviews        PUT|DELETE /services/:id | /reviews/:id
 *   PUT /services/reorder | /reviews/reorder   { ids }
 *   GET|PUT /gallery           (PUT replaces the 4 slots)
 */
import { AxiosError, AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

type Item = Record<string, unknown> & { id: string };

const STORAGE_PREFIX = "radwan-mock:";
const MOCK_TOKEN = "mock-admin-token";
const MOCK_USER = { id: "owner", name: "محمد رضوان", email: "admin@radwan.com" };
const MOCK_PASSWORD = "admin123";

const SINGLETONS = new Set(["site-info", "hours", "hero", "banner", "seo"]);
const COLLECTIONS = new Set(["services", "reviews", "gallery"]);

class HttpError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readStored<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function store(key: string, value: unknown) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    throw new HttpError(413, "مساحة التخزين التجريبية في المتصفح امتلأت. امسح البيانات التجريبية من الإعدادات.");
  }
}

async function read<T>(resource: string): Promise<T> {
  const stored = readStored<T>(resource);
  if (stored !== null) return stored;

  const res = await fetch(`${import.meta.env.BASE_URL}mock-api/${resource}.json`);
  if (!res.ok) throw new HttpError(404, "البيانات مش موجودة");
  return ((await res.json()) as { data: T }).data;
}

function requireAuth(config: InternalAxiosRequestConfig) {
  if (config.headers.get("Authorization") !== `Bearer ${MOCK_TOKEN}`) {
    throw new HttpError(401, "لازم تسجّل دخول الأول");
  }
}

function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new HttpError(400, "مش قادر أقرا الصورة"));
    reader.readAsDataURL(file);
  });
}

async function handleAuth(
  action: string,
  method: string,
  body: Record<string, string>,
  config: InternalAxiosRequestConfig,
) {
  const password = readStored<string>("password") ?? MOCK_PASSWORD;

  if (action === "login" && method === "post") {
    if (body.email?.toLowerCase() !== MOCK_USER.email || body.password !== password) {
      throw new HttpError(401, "الإيميل أو كلمة السر غلط");
    }
    return { token: MOCK_TOKEN, user: MOCK_USER };
  }

  requireAuth(config);
  if (action === "me" && method === "get") return MOCK_USER;
  if (action === "logout" && method === "post") return null;
  if (action === "password" && method === "put") {
    if (body.currentPassword !== password) throw new HttpError(422, "كلمة السر الحالية غلط");
    store("password", body.newPassword);
    return null;
  }
  throw new HttpError(404, "Not found");
}

async function handleCollection(resource: string, id: string | undefined, method: string, body: unknown) {
  const items = await read<Item[]>(resource);

  if (!id) {
    if (method === "get") return items;
    if (method === "post") {
      const item = { ...(body as object), id: crypto.randomUUID() };
      store(resource, [...items, item]);
      return item;
    }
    if (method === "put") {
      store(resource, body);
      return body;
    }
  }

  if (id === "reorder" && method === "put") {
    const { ids } = body as { ids: string[] };
    const sorted = ids.map((itemId) => items.find((item) => item.id === itemId)).filter((item) => item !== undefined);
    store(resource, sorted);
    return sorted;
  }

  const index = items.findIndex((item) => item.id === id);
  if (index === -1) throw new HttpError(404, "العنصر ده مش موجود");

  if (method === "get") return items[index];
  if (method === "put") {
    const updated = { ...items[index], ...(body as object), id: items[index].id };
    store(resource, items.with(index, updated));
    return updated;
  }
  if (method === "delete") {
    store(resource, items.toSpliced(index, 1));
    return null;
  }
  throw new HttpError(405, "Method not allowed");
}

async function handle(config: InternalAxiosRequestConfig): Promise<unknown> {
  const method = (config.method ?? "get").toLowerCase();
  const path = (config.url ?? "").split("?")[0].replace(/^\/+|\/+$/g, "");
  const [resource, id] = path.split("/");
  const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;

  if (resource === "auth") return handleAuth(id, method, body ?? {}, config);
  if (method !== "get") requireAuth(config);

  if (resource === "uploads" && method === "post") {
    const file = (body as FormData).get("file");
    if (!(file instanceof Blob)) throw new HttpError(422, "مفيش صورة");
    return { url: await fileToDataUrl(file) };
  }

  if (SINGLETONS.has(resource)) {
    if (method === "get") return read(resource);
    if (method === "put") {
      store(resource, body);
      return body;
    }
  }

  if (COLLECTIONS.has(resource)) return handleCollection(resource, id, method, body);

  throw new HttpError(404, `Mock API: مفيش ${method.toUpperCase()} /${path}`);
}

export async function mockAdapter(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const method = (config.method ?? "get").toLowerCase();
  await sleep(method === "get" ? 150 : 450); // feel like a real network

  const respond = (status: number, data: unknown): AxiosResponse => ({
    data,
    status,
    statusText: String(status),
    headers: new AxiosHeaders(),
    config,
    request: {},
  });

  try {
    return respond(200, { data: await handle(config) });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Mock API error";
    const code = status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST;
    throw new AxiosError(message, code, config, {}, respond(status, { message }));
  }
}

/** Wipe everything the admin saved and go back to the seed JSON files. */
export function resetMockData() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    /* ignore */
  }
}
