import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp } from '@ionic/angular/standalone';
import { ConnectionStatus, Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [IonApp, NgIf, JsonPipe],
})
export class AppComponent implements OnInit, OnDestroy {
  connected!: boolean;
  batteryInterval!: any;
  batteryStatus!: string;

  ngOnInit(): void {
    Network.addListener('networkStatusChange', (status: ConnectionStatus) => this.setConnectedStatus(status));
    Network.getStatus().then((status: ConnectionStatus) => this.setConnectedStatus(status));

    this.batteryInterval = setInterval(async () => {
      const batteryInfo = await Device.getBatteryInfo();
      if (batteryInfo.batteryLevel) {
        this.batteryStatus = `${(batteryInfo.batteryLevel * 100).toFixed(2)}%`;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    Network.removeAllListeners();
    clearInterval(this.batteryInterval);
    this.batteryInterval = undefined;
  }

  private setConnectedStatus(status: ConnectionStatus): void {
    this.connected = status.connected;
  }
}
