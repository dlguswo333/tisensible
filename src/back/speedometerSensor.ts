import {Capacitor} from '@capacitor/core';
import {type CallbackID, Geolocation, type Position} from '@capacitor/geolocation';
import {v4} from 'uuid';
import z from 'zod';

class SpeedometerSensor {
  private subscribers: Record<string, (_: Position) => unknown> = {};
  private position: Position | null = null;
  private watchID: CallbackID | null = null;

  private getUniqueID() {
    return v4();
  }

  private addSubscriber(listener: (_: Position) => unknown): string {
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
      // Not implmented on web.
      return true;
    }
    try {
      await Geolocation.requestPermissions({permissions: ['location']});
      return true;
    } catch {
      return false;
    }
  }

  public async start() {
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
      (position) => {
        this.position = position;
        if (!this.position) {
          return;
        }
        for (const subscriber of Object.values(this.subscribers)) {
          subscriber(this.position);
        }
      },
    );
  }

  public async stop() {
    if (!this.watchID) {
      return;
    }
    await Geolocation.clearWatch({id: this.watchID});
    this.watchID = null;
  }

  public subscribe(setter: (value: Position | null) => unknown): string {
    const listener = (event: Position) => {
      setter(event);
    };
    return this.addSubscriber(listener);
  }

  public unsubscribe(id: string): boolean {
    const listener = this.getSubscriber(id);
    if (!listener) {
      return false;
    }
    return this.deleteSubscriber(id);
  }
}

export default SpeedometerSensor;
