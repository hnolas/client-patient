# main.py
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class PatientNote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    visitNumber: str
    date: str
    reasonForVisit: str
    history: str
    vitalSigns: str
    physicalExam: str
    assessment: str
    plan: str
    source: str  # 'clinic' or 'patient'

class PatientData(BaseModel):
    name: str
    notes: List[PatientNote]

# In-memory storage for clinic and patient records
clinic_records = {}   # Data pushed by clinic
patient_records = {}  # Data pushed by patient

sync_request_pending = False  # Flag to indicate a sync request from clinic

# Endpoint for clinic to push data
@app.post("/sync/push_clinic")
async def push_clinic_data(clinic_data: PatientData):
    # Append clinic notes to existing records, avoiding duplicates
    if clinic_data.name in clinic_records:
        existing_note_ids = set(note.id for note in clinic_records[clinic_data.name])
        for note in clinic_data.notes:
            if note.id not in existing_note_ids:
                clinic_records[clinic_data.name].append(note)
    else:
        clinic_records[clinic_data.name] = clinic_data.notes

    global sync_request_pending
    sync_request_pending = True  # Trigger sync request to patient
    return {"message": "Clinic data synced successfully"}

# Endpoint for patient to check if there's a sync request
@app.get("/sync/check")
async def check_sync_request():
    if sync_request_pending:
        return {"sync": True}
    return {"sync": False}

# Endpoint for patient to acknowledge sync
@app.post("/sync/acknowledge")
async def acknowledge_sync():
    global sync_request_pending
    sync_request_pending = False  # Reset sync request pending
    return {"message": "Sync acknowledged"}

# Endpoint for patient to push data
@app.post("/sync/push_patient")
async def push_patient_data(patient_data: PatientData):
    # Append patient notes to existing records, avoiding duplicates
    if patient_data.name in patient_records:
        existing_note_ids = set(note.id for note in patient_records[patient_data.name])
        for note in patient_data.notes:
            if note.id not in existing_note_ids:
                patient_records[patient_data.name].append(note)
    else:
        patient_records[patient_data.name] = patient_data.notes
    return {"message": "Patient data received successfully"}

# Endpoint for clinic to pull patient data
@app.get("/sync/pull_patient_data")
async def get_patient_data():
    return {
        "name": "Jane Doe",
        "notes": patient_records.get("Jane Doe", [])
    }

# Endpoint for patient to pull clinic data
@app.get("/sync/pull_clinic_data")
async def get_clinic_data():
    return {
        "name": "Jane Doe",
        "notes": clinic_records.get("Jane Doe", [])
    }
