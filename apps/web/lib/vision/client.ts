import "server-only";
import * as mock from "./mock-data";
import type {
  Alert,
  AlertStatus,
  Analytics,
  AnalyticsRange,
  Camera,
  Evidence,
  Incident,
  IncidentStatus,
  Intelligence,
  Overview,
  Report,
} from "./types";

const BASE = process.env.VISION_API_URL?.replace(/\/$/, "");
const KEY = process.env.VISION_API_KEY ?? "";
const DEMO_ALLOWED =
  process.env.NODE_ENV !== "production" || process.env.ALLOW_DEMO_DATA === "true";

/** True when pages are showing sample data (the layout shows a banner). */
export const isDemoData = !BASE;

export class VisionApiError extends Error {
  status: number;
  constructor(status: number) {
    super(`Vision service error (${status})`);
    this.status = status;
  }
}

// Ids go into URL paths: allow only a safe character set.
const SAFE_ID = /^[A-Za-z0-9_-]{1,64}$/;

async function call(path: string): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    headers: { "X-API-Key": KEY, Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
}

function assertDemoAllowed() {
  if (!DEMO_ALLOWED) throw new Error("VISION_API_URL is not configured");
}

async function request<T>(path: string, fallback: () => T): Promise<T> {
  if (!BASE) {
    assertDemoAllowed();
    return fallback();
  }
  const res = await call(path);
  if (!res.ok) throw new VisionApiError(res.status);
  return (await res.json()) as T;
}

async function requestOne<T>(id: string, path: string, fallback: () => T | null): Promise<T | null> {
  if (!SAFE_ID.test(id)) return null;
  if (!BASE) {
    assertDemoAllowed();
    return fallback();
  }
  const res = await call(path);
  if (res.status === 404) return null;
  if (!res.ok) throw new VisionApiError(res.status);
  return (await res.json()) as T;
}

export const getOverview = () => request<Overview>("/v1/overview", mock.getOverview);

export const listCameras = () => request<Camera[]>("/v1/cameras", () => mock.cameras);
export const getCamera = (id: string) =>
  requestOne<Camera>(id, `/v1/cameras/${id}`, () => mock.cameras.find((c) => c.id === id) ?? null);

export const listIncidents = (status?: IncidentStatus) =>
  request<Incident[]>(`/v1/incidents${status ? `?status=${status}` : ""}`, () =>
    mock.incidents.filter((i) => !status || i.status === status),
  );
export const getIncident = (id: string) =>
  requestOne<Incident>(id, `/v1/incidents/${id}`, () => mock.incidents.find((i) => i.id === id) ?? null);

export const listAlerts = (status?: AlertStatus) =>
  request<Alert[]>(`/v1/alerts${status ? `?status=${status}` : ""}`, () =>
    mock.alerts.filter((a) => !status || a.status === status),
  );

export const listEvidence = () => request<Evidence[]>("/v1/evidence", () => mock.evidence);
export const getEvidence = (id: string) =>
  requestOne<Evidence>(id, `/v1/evidence/${id}`, () => mock.evidence.find((e) => e.id === id) ?? null);

export const getAnalytics = (range: AnalyticsRange) =>
  request<Analytics>(`/v1/analytics?range=${range}`, () => mock.getAnalytics(range));

export const getIntelligence = () => request<Intelligence>("/v1/intelligence", () => mock.intelligence);
export const listReports = () => request<Report[]>("/v1/reports", () => mock.reports);