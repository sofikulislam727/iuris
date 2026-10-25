import os
import secrets

from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException, Query

from .schemas import (
    Alert, AlertStatus, Analytics, AnalyticsRange, Camera, Evidence, Incident,
    IncidentStatus, Insight, Intelligence, ModelStatus, Overview, Report,
    VisionStatus,
)


def require_api_key(x_api_key: str | None = Header(default=None)) -> None:
    expected = os.environ.get("VISION_API_KEY", "")
    if not expected or not x_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if not secrets.compare_digest(x_api_key.encode(), expected.encode()):
        raise HTTPException(status_code=401, detail="Unauthorized")


# Replace these stores with your real data source / pipeline output.
CAMERAS: list[Camera] = []
INCIDENTS: list[Incident] = []
ALERTS: list[Alert] = []
EVIDENCE: list[Evidence] = []
REPORTS: list[Report] = []

app = FastAPI(title="IURIS Vision Service")
router = APIRouter(prefix="/v1", dependencies=[Depends(require_api_key)])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/overview", response_model=Overview)
def overview() -> Overview:
    return Overview(
        cameras_online=sum(c.status != "offline" for c in CAMERAS),
        cameras_total=len(CAMERAS),
        open_incidents=sum(i.status in ("open", "investigating") for i in INCIDENTS),
        active_alerts=sum(a.status == "new" for a in ALERTS),
        detections_today=sum(c.detections_today for c in CAMERAS),
        vision=VisionStatus(status="down", model_version="unconfigured", avg_latency_ms=0, fps=0),
    )


@router.get("/cameras", response_model=list[Camera])
def list_cameras() -> list[Camera]:
    return CAMERAS


@router.get("/cameras/{camera_id}", response_model=Camera)
def get_camera(camera_id: str) -> Camera:
    found = next((c for c in CAMERAS if c.id == camera_id), None)
    if found is None:
        raise HTTPException(status_code=404, detail="Not found")
    return found


@router.get("/incidents", response_model=list[Incident])
def list_incidents(status: IncidentStatus | None = None) -> list[Incident]:
    return [i for i in INCIDENTS if status is None or i.status == status]


@router.get("/incidents/{incident_id}", response_model=Incident)
def get_incident(incident_id: str) -> Incident:
    found = next((i for i in INCIDENTS if i.id == incident_id), None)
    if found is None:
        raise HTTPException(status_code=404, detail="Not found")
    return found


@router.get("/alerts", response_model=list[Alert])
def list_alerts(status: AlertStatus | None = None) -> list[Alert]:
    return [a for a in ALERTS if status is None or a.status == status]


@router.get("/evidence", response_model=list[Evidence])
def list_evidence() -> list[Evidence]:
    return EVIDENCE


@router.get("/evidence/{evidence_id}", response_model=Evidence)
def get_evidence(evidence_id: str) -> Evidence:
    found = next((e for e in EVIDENCE if e.id == evidence_id), None)
    if found is None:
        raise HTTPException(status_code=404, detail="Not found")
    return found


@router.get("/analytics", response_model=Analytics)
def analytics(time_range: AnalyticsRange = Query("24h", alias="range")) -> Analytics:
    return Analytics(
        range=time_range, total_detections=0, total_incidents=0, avg_confidence=0,
        detections_by_hour=[0] * 24, incidents_by_kind=[], top_cameras=[],
    )


@router.get("/intelligence", response_model=Intelligence)
def intelligence() -> Intelligence:
    insights: list[Insight] = []
    models: list[ModelStatus] = []
    return Intelligence(insights=insights, models=models)


@router.get("/reports", response_model=list[Report])
def list_reports() -> list[Report]:
    return REPORTS


app.include_router(router)