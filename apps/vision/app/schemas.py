from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel

Severity = Literal["low", "medium", "high", "critical"]
CameraStatus = Literal["online", "offline", "degraded"]
IncidentStatus = Literal["open", "investigating", "resolved", "false_positive"]
AlertStatus = Literal["new", "acknowledged", "dismissed"]
ServiceStatus = Literal["healthy", "degraded", "down"]
AnalyticsRange = Literal["24h", "7d", "30d"]
DetectionKind = Literal[
    "intrusion", "crowd", "loitering", "fight",
    "fire_smoke", "unattended_object", "vehicle", "fall",
]


class Camera(BaseModel):
    id: str
    name: str
    location: str
    zone: str
    status: CameraStatus
    fps: int
    resolution: str
    stream_url: str | None = None
    last_seen_at: datetime | None = None
    detections_today: int


class TimelineEvent(BaseModel):
    at: datetime
    label: str


class Incident(BaseModel):
    id: str
    title: str
    kind: DetectionKind
    severity: Severity
    status: IncidentStatus
    camera_id: str
    camera_name: str
    location: str
    detected_at: datetime
    confidence: float
    summary: str
    assigned_to: str | None = None
    evidence_ids: list[str] = []
    timeline: list[TimelineEvent] = []


class Alert(BaseModel):
    id: str
    kind: DetectionKind
    severity: Severity
    status: AlertStatus
    camera_id: str
    camera_name: str
    message: str
    created_at: datetime
    incident_id: str | None = None


class AccessLogEntry(BaseModel):
    at: datetime
    actor: str
    action: str


class Evidence(BaseModel):
    id: str
    type: Literal["clip", "snapshot"]
    title: str
    camera_id: str
    camera_name: str
    incident_id: str | None = None
    captured_at: datetime
    duration_seconds: int | None = None
    size_mb: float
    sha256: str
    retention_until: date
    access_log: list[AccessLogEntry] = []


class VisionStatus(BaseModel):
    status: ServiceStatus
    model_version: str
    avg_latency_ms: float
    fps: float


class Overview(BaseModel):
    cameras_online: int
    cameras_total: int
    open_incidents: int
    active_alerts: int
    detections_today: int
    vision: VisionStatus


class KindCount(BaseModel):
    kind: DetectionKind
    count: int


class CameraCount(BaseModel):
    camera_name: str
    count: int


class Analytics(BaseModel):
    range: AnalyticsRange
    total_detections: int
    total_incidents: int
    avg_confidence: float
    detections_by_hour: list[int]
    incidents_by_kind: list[KindCount]
    top_cameras: list[CameraCount]


class Insight(BaseModel):
    id: str
    title: str
    description: str
    severity: Severity
    generated_at: datetime
    camera_ids: list[str] = []


class ModelStatus(BaseModel):
    name: str
    version: str
    status: ServiceStatus
    avg_latency_ms: float


class Intelligence(BaseModel):
    insights: list[Insight]
    models: list[ModelStatus]


class Report(BaseModel):
    id: str
    title: str
    period: str
    generated_at: datetime
    format: Literal["pdf", "csv"]
    size_kb: int