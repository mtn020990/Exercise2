import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  progress: number = 0;
  label: string;
  isShow: boolean;
  currentValue: number = 0;
  timer: any;
 
  constructor(private _ngZone: NgZone) {}
 
  // Loop inside the Angular zone
  // so the UI DOES refresh after each setTimeout cycle
  processWithinAngularZone() {
    this.label = 'inside';
    this.progress = 0;
    this._increaseProgress(() => console.log('Inside Done!'));
  }
 
  // Loop outside of the Angular zone
  // so the UI DOES NOT refresh after each setTimeout cycle
  processOutsideOfAngularZone() {
    this.label = 'outside';
    this.progress = 0;
    this._ngZone.runOutsideAngular(() => {
      this._increaseProgress(() => {
        // reenter the Angular zone and display done
        this._ngZone.run(() => { console.log('Outside Done!'); });
      });
    });
  }

  public start() {
    this._ngZone.run(() => {
      this.isShow = true;
      this.timer = setInterval(() => {
        this.currentValue += 1;
        console.log(this.currentValue);
      },50);
    });  
  }

  public stop() {
    clearInterval(this.timer);
  }
 
  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log(`Current progress: ${this.progress}%`);
 
    if (this.progress < 100) {
      window.setTimeout(() => this._increaseProgress(doneCallback), 50);
    } else {
      doneCallback();
    }
  }
}
