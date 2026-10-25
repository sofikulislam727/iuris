import type {
  Alert,
  Analytics,
  AnalyticsRange,
  Camera,
  Evidence,
  Incident,
  Intelligence,
  Overview,
  Report,
} from "./types";

const at = (h: number, m: number) =>
  `2026-10-25T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00+06:00`;

export const cameras: Camera[] = [
  { id: "cam-001", name: "Main Gate", location: "Main Gate, Entrance Road", zone: "Perimeter", status: "online", fps: 25, resolution: "1920x1080", stream_url: null, last_seen_at: at(9, 58), detections_today: 42 },
  { id: "cam-002", name: "Library Entrance", location: "Central Library, Ground floor", zone: "Academic", status: "online", fps: 25, resolution: "1920x1080", stream_url: null, last_seen_at: at(9, 58), detections_today: 18 },
  { id: "cam-003", name: "Admin Lobby", location: "Administration Building, Lobby", zone: "Administration", status: "online", fps: 15, resolution: "1280x720", stream_url: null, last_seen_at: at(9, 57), detections_today: 9 },
  { id: "cam-004", name: "Parking Lot A", location: "North Parking Lot", zone: "Perimeter", status: "degraded", fps: 10, resolution: "1280x720", stream_url: null, last_seen_at: at(9, 55), detections_today: 31 },
  { id: "cam-005", name: "Hall Corridor B", location: "Residential Hall B, Level 1", zone: "Residential", status: "offline", fps: 0, resolution: "1920x1080", stream_url: null, last_seen_at: at(7, 12), detections_today: 0 },
  { id: "cam-006", name: "Sports Field", location: "Main Sports Field", zone: "Outdoor", status: "online", fps: 20, resolution: "1920x1080", stream_url: null, last_seen_at: at(9, 58), detections_today: 15 },
];

export const incidents: Incident[] = [
  {
    id: "inc-1001", title: "Unauthorized entry after hours", kind: "intrusion", severity: "high", status: "investigating",
    camera_id: "cam-001", camera_name: "Main Gate", location: "Main Gate, Entrance Road", detected_at: at(9, 14), confidence: 0.93,
    summary: "A person was detected entering the restricted gate area outside permitted hours.", assigned_to: "Demo officer",
    evidence_ids: ["ev-2001", "ev-2002"],
    timeline: [
      { at: at(9, 14), label: "Detection raised by vision service" },
      { at: at(9, 16), label: "Alert acknowledged" },
      { at: at(9, 22), label: "Assigned to Demo officer" },
    ],
  },
  {
    id: "inc-1002", title: "Crowd forming near library entrance", kind: "crowd", severity: "medium", status: "open",
    camera_id: "cam-002", camera_name: "Library Entrance", location: "Central Library, Ground floor", detected_at: at(8, 47), confidence: 0.88,
    summary: "Crowd density exceeded the configured threshold for more than three minutes.", assigned_to: null, evidence_ids: [],
    timeline: [{ at: at(8, 47), label: "Detection raised by vision service" }],
  },
  {
    id: "inc-1003", title: "Vehicle loitering in Parking Lot A", kind: "loitering", severity: "low", status: "resolved",
    camera_id: "cam-004", camera_name: "Parking Lot A", location: "North Parking Lot", detected_at: at(7, 55), confidence: 0.81,
    summary: "A vehicle stayed in a no-standing zone for over ten minutes.", assigned_to: "Demo officer", evidence_ids: [],
    timeline: [
      { at: at(7, 55), label: "Detection raised by vision service" },
      { at: at(8, 20), label: "Marked resolved" },
    ],
  },
  {
    id: "inc-1004", title: "Possible fight detected", kind: "fight", severity: "critical", status: "open",
    camera_id: "cam-006", camera_name: "Sports Field", location: "Main Sports Field", detected_at: at(9, 41), confidence: 0.79,
    summary: "Rapid aggressive movement between several people was detected near the east goal.", assigned_to: null, evidence_ids: ["ev-2003"],
    timeline: [{ at: at(9, 41), label: "Detection raised by vision service" }],
  },
  {
    id: "inc-1005", title: "Unattended bag in lobby", kind: "unattended_object", severity: "medium", status: "false_positive",
    camera_id: "cam-003", camera_name: "Admin Lobby", location: "Administration Building, Lobby", detected_at: at(6, 30), confidence: 0.66,
    summary: "An object was left stationary for several minutes. The owner returned shortly after.", assigned_to: "Demo officer", evidence_ids: [],
    timeline: [
      { at: at(6, 30), label: "Detection raised by vision service" },
      { at: at(6, 41), label: "Marked as false positive" },
    ],
  },
];

export const alerts: Alert[] = [
  { id: "al-3001", kind: "intrusion", severity: "high", status: "new", camera_id: "cam-001", camera_name: "Main Gate", message: "Person detected in restricted area after hours", created_at: at(9, 14), incident_id: "inc-1001" },
  { id: "al-3002", kind: "fight", severity: "critical", status: "new", camera_id: "cam-006", camera_name: "Sports Field", message: "Aggressive movement detected on the sports field", created_at: at(9, 41), incident_id: "inc-1004" },
  { id: "al-3003", kind: "crowd", severity: "medium", status: "acknowledged", camera_id: "cam-002", camera_name: "Library Entrance", message: "Crowd density above threshold", created_at: at(8, 47), incident_id: "inc-1002" },
  { id: "al-3004", kind: "loitering", severity: "low", status: "acknowledged", camera_id: "cam-004", camera_name: "Parking Lot A", message: "Vehicle stationary in a no-standing zone", created_at: at(7, 55), incident_id: "inc-1003" },
  { id: "al-3005", kind: "unattended_object", severity: "medium", status: "dismissed", camera_id: "cam-003", camera_name: "Admin Lobby", message: "Unattended object detected", created_at: at(6, 30), incident_id: "inc-1005" },
  { id: "al-3006", kind: "vehicle", severity: "low", status: "new", camera_id: "cam-004", camera_name: "Parking Lot A", message: "Vehicle entered a restricted zone", created_at: at(9, 2), incident_id: null },
];

export const evidence: Evidence[] = [
  { id: "ev-2001", type: "clip", title: "Main Gate: entry clip", camera_id: "cam-001", camera_name: "Main Gate", incident_id: "inc-1001", captured_at: at(9, 14), duration_seconds: 38, size_mb: 14.2, sha256: "9f2c4a7e1b6d3f08".repeat(4), retention_until: "2027-01-23",
    access_log: [{ at: at(9, 20), actor: "Demo officer", action: "Viewed" }, { at: at(9, 31), actor: "Demo admin", action: "Exported" }] },
  { id: "ev-2002", type: "snapshot", title: "Main Gate: face-blurred snapshot", camera_id: "cam-001", camera_name: "Main Gate", incident_id: "inc-1001", captured_at: at(9, 14), duration_seconds: null, size_mb: 0.4, sha256: "a41d7c0e92b5f836".repeat(4), retention_until: "2027-01-23",
    access_log: [{ at: at(9, 21), actor: "Demo officer", action: "Viewed" }] },
  { id: "ev-2003", type: "clip", title: "Sports Field: east goal clip", camera_id: "cam-006", camera_name: "Sports Field", incident_id: "inc-1004", captured_at: at(9, 41), duration_seconds: 52, size_mb: 19.8, sha256: "5be83f1c7d2a9046".repeat(4), retention_until: "2027-01-23",
    access_log: [] },
  { id: "ev-2004", type: "snapshot", title: "Parking Lot A: plate-region snapshot", camera_id: "cam-004", camera_name: "Parking Lot A", incident_id: "inc-1003", captured_at: at(7, 55), duration_seconds: null, size_mb: 0.6, sha256: "c07e5a9d3b18f642".repeat(4), retention_until: "2027-01-23",
    access_log: [{ at: at(8, 5), actor: "Demo officer", action: "Viewed" }] },
];

export const intelligence: Intelligence = {
  insights: [
    { id: "ins-1", title: "Peak activity at the main gate between 08:00 and 10:00", description: "Detections at the main gate are concentrated in the morning arrival window.", severity: "low", generated_at: at(9, 0), camera_ids: ["cam-001"] },
    { id: "ins-2", title: "Repeated loitering reports in Parking Lot A", description: "Three loitering detections in the last week at the same location. Consider a physical signage or patrol change.", severity: "medium", generated_at: at(9, 0), camera_ids: ["cam-004"] },
    { id: "ins-3", title: "Hall Corridor B has been offline since 07:12", description: "No frames received since 07:12. Check power and network at the camera.", severity: "high", generated_at: at(9, 30), camera_ids: ["cam-005"] },
  ],
  models: [
    { name: "Person detector", version: "demo", status: "healthy", avg_latency_ms: 38 },
    { name: "Behaviour classifier", version: "demo", status: "healthy", avg_latency_ms: 64 },
    { name: "Anomaly scoring", version: "demo", status: "degraded", avg_latency_ms: 121 },
  ],
};

export const reports: Report[] = [
  { id: "rep-01", title: "Daily security summary", period: "24 Oct 2026", generated_at: at(0, 5), format: "pdf", size_kb: 182 },
  { id: "rep-02", title: "Weekly incident export", period: "18 to 24 Oct 2026", generated_at: at(0, 10), format: "csv", size_kb: 46 },
  { id: "rep-03", title: "Camera uptime report", period: "September 2026", generated_at: at(0, 15), format: "pdf", size_kb: 240 },
];

export function getOverview(): Overview {
  return {
    cameras_online: cameras.filter((c) => c.status !== "offline").length,
    cameras_total: cameras.length,
    open_incidents: incidents.filter((i) => i.status === "open" || i.status === "investigating").length,
    active_alerts: alerts.filter((a) => a.status === "new").length,
    detections_today: cameras.reduce((sum, c) => sum + c.detections_today, 0),
    vision: { status: "healthy", model_version: "demo", avg_latency_ms: 54, fps: 22 },
  };
}

const HOURS = [1, 0, 0, 0, 1, 2, 4, 9, 14, 11, 8, 6, 5, 7, 6, 5, 8, 10, 7, 4, 3, 2, 1, 1];

export function getAnalytics(range: AnalyticsRange): Analytics {
  const f = range === "24h" ? 1 : range === "7d" ? 7 : 30;
  return {
    range,
    total_detections: HOURS.reduce((a, b) => a + b, 0) * f,
    total_incidents: 5 * f,
    avg_confidence: 0.84,
    detections_by_hour: HOURS,
    incidents_by_kind: [
      { kind: "intrusion", count: 1 * f },
      { kind: "crowd", count: 1 * f },
      { kind: "loitering", count: 1 * f },
      { kind: "fight", count: 1 * f },
      { kind: "unattended_object", count: 1 * f },
    ],
    top_cameras: [
      { camera_name: "Main Gate", count: 42 * f },
      { camera_name: "Parking Lot A", count: 31 * f },
      { camera_name: "Library Entrance", count: 18 * f },
      { camera_name: "Sports Field", count: 15 * f },
    ],
  };
}