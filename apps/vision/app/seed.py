from datetime import datetime, timedelta, timezone

from .schemas import (
    AccessLogEntry, Alert, Analytics, AnalyticsRange, Camera, CameraCount,
    Evidence, Incident, Insight, Intelligence, KindCount, ModelStatus, Report,
    TimelineEvent,
)

TZ = timezone(timedelta(hours=6))


def t(h: int, m: int) -> datetime:
    return datetime(2026, 10, 25, h, m, tzinfo=TZ)


def demo_cameras() -> list[Camera]:
    return [
        Camera(id="cam-001", name="Main Gate", location="Main Gate, Entrance Road", zone="Perimeter", status="online", fps=25, resolution="1920x1080", last_seen_at=t(9, 58), detections_today=42),
        Camera(id="cam-002", name="Library Entrance", location="Central Library, Ground floor", zone="Academic", status="online", fps=25, resolution="1920x1080", last_seen_at=t(9, 58), detections_today=18),
        Camera(id="cam-003", name="Admin Lobby", location="Administration Building, Lobby", zone="Administration", status="online", fps=15, resolution="1280x720", last_seen_at=t(9, 57), detections_today=9),
        Camera(id="cam-004", name="Parking Lot A", location="North Parking Lot", zone="Perimeter", status="degraded", fps=10, resolution="1280x720", last_seen_at=t(9, 55), detections_today=31),
        Camera(id="cam-005", name="Hall Corridor B", location="Residential Hall B, Level 1", zone="Residential", status="offline", fps=0, resolution="1920x1080", last_seen_at=t(7, 12), detections_today=0),
        Camera(id="cam-006", name="Sports Field", location="Main Sports Field", zone="Outdoor", status="online", fps=20, resolution="1920x1080", last_seen_at=t(9, 58), detections_today=15),
    ]


def demo_incidents() -> list[Incident]:
    return [
        Incident(id="inc-1001", title="Unauthorized entry after hours", kind="intrusion", severity="high", status="investigating", camera_id="cam-001", camera_name="Main Gate", location="Main Gate, Entrance Road", detected_at=t(9, 14), confidence=0.93, summary="A person was detected entering the restricted gate area outside permitted hours.", assigned_to="Demo officer", evidence_ids=["ev-2001", "ev-2002"],
                 timeline=[TimelineEvent(at=t(9, 14), label="Detection raised by vision service"), TimelineEvent(at=t(9, 16), label="Alert acknowledged"), TimelineEvent(at=t(9, 22), label="Assigned to Demo officer")]),
        Incident(id="inc-1002", title="Crowd forming near library entrance", kind="crowd", severity="medium", status="open", camera_id="cam-002", camera_name="Library Entrance", location="Central Library, Ground floor", detected_at=t(8, 47), confidence=0.88, summary="Crowd density exceeded the configured threshold for more than three minutes.",
                 timeline=[TimelineEvent(at=t(8, 47), label="Detection raised by vision service")]),
        Incident(id="inc-1003", title="Vehicle loitering in Parking Lot A", kind="loitering", severity="low", status="resolved", camera_id="cam-004", camera_name="Parking Lot A", location="North Parking Lot", detected_at=t(7, 55), confidence=0.81, summary="A vehicle stayed in a no-standing zone for over ten minutes.", assigned_to="Demo officer",
                 timeline=[TimelineEvent(at=t(7, 55), label="Detection raised by vision service"), TimelineEvent(at=t(8, 20), label="Marked resolved")]),
        Incident(id="inc-1004", title="Possible fight detected", kind="fight", severity="critical", status="open", camera_id="cam-006", camera_name="Sports Field", location="Main Sports Field", detected_at=t(9, 41), confidence=0.79, summary="Rapid aggressive movement between several people was detected near the east goal.", evidence_ids=["ev-2003"],
                 timeline=[TimelineEvent(at=t(9, 41), label="Detection raised by vision service")]),
        Incident(id="inc-1005", title="Unattended bag in lobby", kind="unattended_object", severity="medium", status="false_positive", camera_id="cam-003", camera_name="Admin Lobby", location="Administration Building, Lobby", detected_at=t(6, 30), confidence=0.66, summary="An object was left stationary for several minutes. The owner returned shortly after.", assigned_to="Demo officer",
                 timeline=[TimelineEvent(at=t(6, 30), label="Detection raised by vision service"), TimelineEvent(at=t(6, 41), label="Marked as false positive")]),
    ]


def demo_alerts() -> list[Alert]:
    return [
        Alert(id="al-3001", kind="intrusion", severity="high", status="new", camera_id="cam-001", camera_name="Main Gate", message="Person detected in restricted area after hours", created_at=t(9, 14), incident_id="inc-1001"),
        Alert(id="al-3002", kind="fight", severity="critical", status="new", camera_id="cam-006", camera_name="Sports Field", message="Aggressive movement detected on the sports field", created_at=t(9, 41), incident_id="inc-1004"),
        Alert(id="al-3003", kind="crowd", severity="medium", status="acknowledged", camera_id="cam-002", camera_name="Library Entrance", message="Crowd density above threshold", created_at=t(8, 47), incident_id="inc-1002"),
        Alert(id="al-3004", kind="loitering", severity="low", status="acknowledged", camera_id="cam-004", camera_name="Parking Lot A", message="Vehicle stationary in a no-standing zone", created_at=t(7, 55), incident_id="inc-1003"),
        Alert(id="al-3005", kind="unattended_object", severity="medium", status="dismissed", camera_id="cam-003", camera_name="Admin Lobby", message="Unattended object detected", created_at=t(6, 30), incident_id="inc-1005"),
        Alert(id="al-3006", kind="vehicle", severity="low", status="new", camera_id="cam-004", camera_name="Parking Lot A", message="Vehicle entered a restricted zone", created_at=t(9, 2)),
    ]


def demo_evidence() -> list[Evidence]:
    return [
        Evidence(id="ev-2001", type="clip", title="Main Gate: entry clip", camera_id="cam-001", camera_name="Main Gate", incident_id="inc-1001", captured_at=t(9, 14), duration_seconds=38, size_mb=14.2, sha256="9f2c4a7e1b6d3f08" * 4, retention_until="2027-01-23",
                 access_log=[AccessLogEntry(at=t(9, 20), actor="Demo officer", action="Viewed"), AccessLogEntry(at=t(9, 31), actor="Demo admin", action="Exported")]),
        Evidence(id="ev-2002", type="snapshot", title="Main Gate: face-blurred snapshot", camera_id="cam-001", camera_name="Main Gate", incident_id="inc-1001", captured_at=t(9, 14), size_mb=0.4, sha256="a41d7c0e92b5f836" * 4, retention_until="2027-01-23",
                 access_log=[AccessLogEntry(at=t(9, 21), actor="Demo officer", action="Viewed")]),
        Evidence(id="ev-2003", type="clip", title="Sports Field: east goal clip", camera_id="cam-006", camera_name="Sports Field", incident_id="inc-1004", captured_at=t(9, 41), duration_seconds=52, size_mb=19.8, sha256="5be83f1c7d2a9046" * 4, retention_until="2027-01-23"),
        Evidence(id="ev-2004", type="snapshot", title="Parking Lot A: plate-region snapshot", camera_id="cam-004", camera_name="Parking Lot A", incident_id="inc-1003", captured_at=t(7, 55), size_mb=0.6, sha256="c07e5a9d3b18f642" * 4, retention_until="2027-01-23",
                 access_log=[AccessLogEntry(at=t(8, 5), actor="Demo officer", action="Viewed")]),
    ]


def demo_reports() -> list[Report]:
    return [
        Report(id="rep-01", title="Daily security summary", period="24 Oct 2026", generated_at=t(0, 5), format="pdf", size_kb=182),
        Report(id="rep-02", title="Weekly incident export", period="18 to 24 Oct 2026", generated_at=t(0, 10), format="csv", size_kb=46),
        Report(id="rep-03", title="Camera uptime report", period="September 2026", generated_at=t(0, 15), format="pdf", size_kb=240),
    ]


def demo_intelligence() -> Intelligence:
    return Intelligence(
        insights=[
            Insight(id="ins-1", title="Peak activity at the main gate between 08:00 and 10:00", description="Detections at the main gate are concentrated in the morning arrival window.", severity="low", generated_at=t(9, 0), camera_ids=["cam-001"]),
            Insight(id="ins-2", title="Repeated loitering reports in Parking Lot A", description="Three loitering detections in the last week at the same location. Consider signage or a patrol change.", severity="medium", generated_at=t(9, 0), camera_ids=["cam-004"]),
            Insight(id="ins-3", title="Hall Corridor B has been offline since 07:12", description="No frames received since 07:12. Check power and network at the camera.", severity="high", generated_at=t(9, 30), camera_ids=["cam-005"]),
        ],
        models=[
            ModelStatus(name="Person detector", version="demo", status="healthy", avg_latency_ms=38),
            ModelStatus(name="Behaviour classifier", version="demo", status="healthy", avg_latency_ms=64),
            ModelStatus(name="Anomaly scoring", version="demo", status="degraded", avg_latency_ms=121),
        ],
    )


_HOURS = [1, 0, 0, 0, 1, 2, 4, 9, 14, 11, 8, 6, 5, 7, 6, 5, 8, 10, 7, 4, 3, 2, 1, 1]


def demo_analytics(time_range: AnalyticsRange) -> Analytics:
    f = {"24h": 1, "7d": 7, "30d": 30}[time_range]
    return Analytics(
        range=time_range,
        total_detections=sum(_HOURS) * f,
        total_incidents=5 * f,
        avg_confidence=0.84,
        detections_by_hour=_HOURS,
        incidents_by_kind=[KindCount(kind=k, count=f) for k in ("intrusion", "crowd", "loitering", "fight", "unattended_object")],
        top_cameras=[CameraCount(camera_name=n, count=c * f) for n, c in (("Main Gate", 42), ("Parking Lot A", 31), ("Library Entrance", 18), ("Sports Field", 15))],
    )