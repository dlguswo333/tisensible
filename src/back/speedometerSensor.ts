import {Capacitor} from '@capacitor/core';
import {type CallbackID, Geolocation, type Position} from '@capacitor/geolocation';
import {v4} from 'uuid';

class SpeedometerSensor {
  private subscribers: Record<string, (_: Position | null) => unknown> = {};
  private position: Position | null = null;
  private watchID: CallbackID | null = null;

  private getUniqueID() {
    return v4();
  }

  private addSubscriber(listener: (_: Position | null) => unknown): string {
    const id = this.getUniqueID();
    this.subscribers[id] = listener;
    return id;
  }

  private getSubscriber(id: string): ((_: Position) => unknown) | null {
    if (!this.subscribers[id]) {
      return null;
    }
    const listener = this.subscribers[id];
    return listener;
  }

  private deleteSubscriber(id: string): boolean {
    if (!this.subscribers[id]) {
      return false;
    }
    delete this.subscribers[id];
    return true;
  }

  public async requestPermission(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') {
      try {
        const permissionResult = await Geolocation.checkPermissions();
        if (permissionResult.location === 'denied') {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    }
    try {
      const permissionResult = await Geolocation.requestPermissions({permissions: ['location']});
      if (permissionResult.location !== 'granted') {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  private async start() {
    if (this.watchID) {
      return;
    }
    this.watchID = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 1000,
        minimumUpdateInterval: 1000,
        interval: 1000,
        enableLocationFallback: false,
      },
      (position, error) => {
        if (error) {
          for (const subscriber of Object.values(this.subscribers)) {
            subscriber(null);
          }
          this.stop();
          return;
        }
        this.position = position;
        if (typeof this.position?.coords?.speed !== 'number') {
          this.position?.coords.latitude;
        }
        for (const subscriber of Object.values(this.subscribers)) {
          subscriber(this.position);
        }
      },
    );
  }

  private async stop() {
    if (!this.watchID) {
      return;
    }
    try {
      await Geolocation.clearWatch({id: this.watchID});
    } finally {
      this.watchID = null;
    }
  }

  public subscribe(subscriber: (value: Position | null) => unknown): string {
    this.start();
    return this.addSubscriber(subscriber);
  }

  public unsubscribe(id: string): boolean {
    const listener = this.getSubscriber(id);
    if (!listener) {
      return false;
    }
    const stopResult = this.deleteSubscriber(id);
    if (Object.values(this.subscribers).length === 0) {
      this.stop();
    }
    return stopResult;
  }
}

export default new SpeedometerSensor();
