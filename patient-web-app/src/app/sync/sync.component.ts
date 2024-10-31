// sync.component.ts
import { Component, OnInit } from '@angular/core';
import { SyncService } from '../sync.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
// Import UUID library for unique IDs
import { v4 as uuidv4 } from 'uuid';
import { MatExpansionModule } from '@angular/material/expansion';



@Component({
  selector: 'app-sync',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatExpansionModule
  ],
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css'],
})
export class SyncComponent implements OnInit {
  dataSynced = false;
  showSyncPopup = false;
  patientName = 'Jane Doe'; // Updated patient name

  // Patient data with unique IDs and source
  patientData = {
    name: 'Jane Doe',
    notes: [
      {
        id: uuidv4(),
        visitNumber: 'Visit 1',
        date: '2023-01-15',
        reasonForVisit: 'Annual physical exam.',
        history: 'No significant health issues. Family history of hypertension.',
        vitalSigns: 'BP 120/78, HR 72, Weight 140 lbs, Height 5\'6".',
        physicalExam: 'Normal findings; no abnormalities noted.',
        assessment: 'Overall health is good, BMI within normal range (22.6).',
        plan: 'Discussed importance of regular exercise and balanced diet. Schedule follow-up in one year for the next annual exam.',
        source: 'patient',
      },
      {
        id: uuidv4(),
        visitNumber: 'Visit 2',
        date: '2023-02-10',
        reasonForVisit: 'Follow-up for elevated blood pressure.',
        history: 'Previous reading was 145/90; patient reports feeling well.',
        vitalSigns: 'BP 145/90, HR 76.',
        physicalExam: 'No acute distress; heart sounds normal.',
        assessment: 'Stage 1 hypertension noted.',
        plan: 'Start low-dose lisinopril 10 mg daily, educate on DASH diet, schedule follow-up in one month to monitor BP.',
        source: 'patient',
      },
      {
        id: uuidv4(),
        visitNumber: 'Visit 3',
        date: '2023-03-10',
        reasonForVisit: 'Medication follow-up.',
        history: 'Patient reports adherence to medication and dietary changes.',
        vitalSigns: 'BP 130/85, HR 70.',
        physicalExam: 'Everything is normal',
        assessment: 'Improvement in blood pressure; lifestyle modifications are effective.',
        plan: ' Continue lisinopril, reinforce dietary recommendations, reassess in three months.',
        source: 'patient',
      },
      {
        id: uuidv4(),
        visitNumber: 'Visit 4',
        date: '2023-04-10',
        reasonForVisit: 'Allergic reaction (rash).',
        history: 'Rash developed after using a new lotion; reports itching.',
        vitalSigns: 'Stable',
        physicalExam: 'Erythematous rash on bilateral forearms, no signs of infection.',
        assessment: 'Likely contact dermatitis.',
        plan: 'Prescribe hydrocortisone cream, advise to avoid the suspected lotion, follow up in one week to assess improvement.',
        source: 'patient',
      },
      {
        id: uuidv4(),
        visitNumber: 'Visit 5',
        date: '2023-05-10',
        reasonForVisit: 'Follow-up for elevated blood pressure.',
        history: 'Previous reading was 145/90; patient reports feeling well.',
        vitalSigns: 'BP 145/90, HR 76.',
        physicalExam: 'No acute distress; heart sounds normal.',
        assessment: 'Stage 1 hypertension noted.',
        plan: 'Start low-dose lisinopril 10 mg daily, educate on DASH diet, schedule follow-up in one month to monitor BP.',
        source: 'patient',
      },
    ],
  };


  constructor(private syncService: SyncService) {}

  // Periodically check for sync requests from the clinic
  ngOnInit() {
    setInterval(() => {
      this.checkForSyncRequest();
    }, 5000);  // Check every 5 seconds
  }

  // Check if there's a sync request
  checkForSyncRequest() {
    this.syncService.checkSyncRequest().subscribe(
      (response: any) => {
        if (response.sync) {
          this.showSyncPopup = true;  // Show popup when sync is requested
        }
      },
      (error) => {
        console.error('Error checking sync request', error);
      }
    );
  }

  // Confirm sync and proceed with synchronization
  confirmSync() {
    this.showSyncPopup = false;  // Hide the popup immediately

    this.syncService.acknowledgeSync().subscribe(
      () => {
        // Pull clinic data
        this.syncService.pullClinicData().subscribe(
          (data) => {
            if (data && data.notes && data.notes.length > 0) {
              // Merge clinic notes into patientData.notes
              this.patientData.notes = this.mergeNotes(this.patientData.notes, data.notes);
            }
            // Push patient data to backend
            this.pushPatientData();
          },
          (error) => {
            console.error('Error pulling clinic data', error);
            // Proceed to push patient data even if pulling clinic data fails
            this.pushPatientData();
          }
        );
      },
      (error) => {
        console.error('Error acknowledging sync', error);
      }
    );
  }

  // Push patient data to the backend
  pushPatientData() {
    // Prepare data to push (only patient notes)
    const patientOnlyNotes = this.patientData.notes.filter(note => note.source === 'patient');
    const dataToPush = {
      name: this.patientData.name,
      notes: patientOnlyNotes
    };

    this.syncService.pushPatientData(dataToPush).subscribe(
      (response) => {
        console.log('Patient data synced successfully', response);
        this.dataSynced = true;
      },
      (error) => {
        console.error('Error syncing patient data', error);
      }
    );
  }

  // Dismiss the sync request
  dismissSync() {
    this.showSyncPopup = false;
    // Optionally acknowledge the sync request to prevent repeated prompts
    this.syncService.acknowledgeSync().subscribe();
  }

  // Helper method to merge notes without duplicates
  mergeNotes(existingNotes: any[], newNotes: any[]): any[] {
    const existingNoteIds = new Set(existingNotes.map(note => note.id));
    newNotes.forEach(newNote => {
      if (!existingNoteIds.has(newNote.id)) {
        existingNotes.push(newNote);
        existingNoteIds.add(newNote.id);
      }
    });
    return existingNotes;
  }
}
