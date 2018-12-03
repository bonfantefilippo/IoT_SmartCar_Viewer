import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MqttService, IMqttMessage } from 'ngx-mqtt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {

  private subscription: Subscription;
  public message: string;

  /**
   *
   */
  constructor(private _mqttService: MqttService) {
    this.subscription = this._mqttService.observe('smartcar/v1/+/+').subscribe((message: IMqttMessage) => {
      this.message = message.payload.toString();
    });

  }

  public unsafePublish(topic: string, message: string): void {
    this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
