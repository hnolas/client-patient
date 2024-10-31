import { Component } from '@angular/core';
import { SyncService } from '../sync.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Import UUID library for unique IDs
import { v4 as uuidv4 } from 'uuid';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-sync',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    MatExpansionModule,
  ],
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss'],
})
export class SyncComponent {
  loading = false;
  syncCompleted = false;
  showAddNoteForm = false;

  patientName = 'Jane Doe'; // Updated patient name

  // Clinic's own notes
  clinicNotes: any[] = [];

  // Patient's notes received from the patient app
  patientNotes: any[] = [];

  // Combined notes to display
  allNotes: any[] = [];

  // New note object for the add note form
  newNote = {
    id: '',
    visitNumber: '',
    date: new Date().toLocaleDateString(),
    reasonForVisit: '',
    history: '',
    vitalSigns: '',
    physicalExam: '',
    assessment: '',
    plan: '',
    source: 'clinic',
  };

  constructor(private syncService: SyncService) {}

  // Trigger a sync request
  initiateSyncRequest() {
    // Send clinic's data to the backend
    this.syncService.syncData({ name: this.patientName, notes: this.clinicNotes }).subscribe(
      (response) => {
        console.log('Sync request initiated successfully', response);
        this.syncData();
      },
      (error) => {
        console.error('Error initiating sync request', error);
      }
    );
  }

  // Sync data with the patient
  syncData() {
    this.loading = true;
    const checkDataInterval = setInterval(() => {
      this.syncService.getPatientData().subscribe(
        (data) => {
          if (data && data.notes && data.notes.length > 0) {
            this.patientNotes = this.mergeNotes(this.patientNotes, data.notes);
            this.updateAllNotes();
            this.syncCompleted = true;
            this.loading = false;
            clearInterval(checkDataInterval);
          } else {
            console.log('No patient data yet, retrying...');
          }
        },
        (error) => {
          console.error('Error fetching patient data', error);
          this.loading = false;
          clearInterval(checkDataInterval);
        }
      );
    }, 2000); // Check every 2 seconds
  }

  // Show the add note form
  showAddNote() {
    this.showAddNoteForm = true;
  }

  // Submit the new note
  submitNote() {
    // Assign a unique ID to the new note
    this.newNote.id = uuidv4();
    this.newNote.source = 'clinic';

    this.clinicNotes.push({ ...this.newNote });
    this.updateAllNotes();

    // Push the clinic's data to the backend
    this.syncService.syncData({ name: this.patientName, notes: this.clinicNotes }).subscribe(
      (response) => {
        console.log('Data synced successfully', response);
        this.showAddNoteForm = false;
        // Reset newNote
        this.newNote = {
          id: '',
          visitNumber: '',
          date: new Date().toLocaleDateString(),
          reasonForVisit: '',
          history: '',
          vitalSigns: '',
          physicalExam: '',
          assessment: '',
          plan: '',
          source: 'clinic',
        };
      },
      (error) => {
        console.error('Error syncing data', error);
      }
    );
  }

  // Merge notes without duplicates based on unique IDs
  mergeNotes(existingNotes: any[], newNotes: any[]): any[] {
    const existingNoteIds = new Set(existingNotes.map((note) => note.id));
    newNotes.forEach((newNote) => {
      if (!existingNoteIds.has(newNote.id)) {
        existingNotes.push(newNote);
        existingNoteIds.add(newNote.id);
      }
    });
    return existingNotes;
  }

  // Update the combined list of all notes
  updateAllNotes() {
    this.allNotes = [...this.clinicNotes, ...this.patientNotes];
    // Optionally sort the notes by date
    this.allNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}
