export const INCIDENT_STATUSES = ["open", "investigating", "resolved", "false_positive"] as const;
export const ALERT_STATUSES = ["new", "acknowledged", "dismissed"] as const;
export const ANALYTICS_RANGES = ["24h", "7d", "30d"] as const;

export type Severity = "low" | "medium" | "high" | "critical";
export type CameraStatus = "online" | "offline" | "degraded";
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];
export type AlertStatus = (typeof ALERT_STATUSES)[number];
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];
export type ServiceStatus = "healthy" | "degraded" | "down";
export type DetectionKind =
  | "intrusion"
  | "crowd"
  | "loitering"
  | "fight"
  | "fire_smoke"
  | "unattended_object"
  | "vehicle"
  | "fall";

export interface Camera {
  id: string;
  name: string;
  location: string;
  zone: string;
  status: CameraStatus;
  fps: number;
  resolution: string;
  stream_url: string | null; // server-side only; never hand to the browser
  last_seen_at: string | null;
  detections_today: number;
}

export interface TimelineEvent {
  at: string;
  label: string;
}

export interface Incident {
  id: string;
  title: string;
  kind: DetectionKind;
  severity: Severity;
  status: IncidentStatus;
  camera_id: string;
  camera_name: string;
  location: string;
  detected_at: string;
  confidence: number; // 0..1
  summary: string;
  assigned_to: string | null;
  evidence_ids: string[];
  timeline: TimelineEvent[];
}

export interface Alert {
  id: string;
  kind: DetectionKind;
  severity: Severity;
  status: AlertStatus;
  camera_id: string;
  camera_name: string;
  message: string;
  created_at: string;
  incident_id: string | null;
}

export interface AccessLogEntry {
  at: string;
  actor: string;
  action: string;
}

export interface Evidence {
  id: string;
  type: "clip" | "snapshot";
  title: string;
  camera_id: string;
  camera_name: string;
  incident_id: string | null;
  captured_at: string;
  duration_seconds: number | null;
  size_mb: number;
  sha256: string;
  retention_until: string; // YYYY-MM-DD
  access_log: AccessLogEntry[];
}

export interface VisionStatus {
  status: ServiceStatus;
  model_version: string;
  avg_latency_ms: number;
  fps: number;
}

export interface Overview {
  cameras_online: number;
  cameras_total: number;
  open_incidents: number;
  active_alerts: number;
  detections_today: number;
  vision: VisionStatus;
}

export interface Analytics {
  range: AnalyticsRange;
  total_detections: number;
  total_incidents: number;
  avg_confidence: number;
  detections_by_hour: number[]; // 24 values
  incidents_by_kind: { kind: DetectionKind; count: number }[];
  top_cameras: { camera_name: string; count: number }[];
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  generated_at: string;
  camera_ids: string[];
}

export interface ModelStatus {
  name: string;
  version: string;
  status: ServiceStatus;
  avg_latency_ms: number;
}

export interface Intelligence {
  insights: Insight[];
  models: ModelStatus[];
}

export interface Report {
  id: string;
  title: string;
  period: string;
  generated_at: string;
  format: "pdf" | "csv";
  size_kb: number;
}