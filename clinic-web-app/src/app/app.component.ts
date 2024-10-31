import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<router-outlet></router-outlet>`,  // Render routes here
  imports: [RouterModule],  // Import RouterModule for routing support
})
export class AppComponent {}
