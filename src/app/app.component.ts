import { Component, OnDestroy, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { MqttService, IMqttMessage } from "ngx-mqtt";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnDestroy {
  @Input()
  public carPlate: string;

  private subscription: Subscription;
  public message: string;
  public topic: string;

  /**
   *
   */
  constructor(private _mqttService: MqttService) {}

  public unsafePublish(topic: string, message: string): void {
    this._mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchCar(form: NgForm) {
    if (form.valid) {
      this.carPlate = form.value;
      this.topic = 'smartcar/v1/' + this.carPlate + '/+';
      this.subscription = this._mqttService
        .observe("smartcar/v1/+/+")
        .subscribe((message: IMqttMessage) => {
          console.log(message.topic);
          this.message = message.payload.toString();
          console.table(this.message);
        });
    }
  }
}
