import {Capacitor} from '@capacitor/core';
import {type CallbackID, Geolocation, type Position} from '@capacitor/geolocation';
import {toMerged} from 'es-toolkit';
import {v4} from 'uuid';
import {getSpeedWithHaversine} from '../front/util/speed';

export type SpeedometerValue =
  | {
      status: 'none';
    }
  | {
      status: 'ok';
      position: Position;
    }
  | {
      status: 'error';
      error: Error;
    };

class SpeedometerSensor {
  private subscribers: Record<string, (_: SpeedometerValue) => unknown> = {};
  private position: Position | null = null;
  private prevPosition: Position | null = null;
  private watchID: CallbackID | null = null;

  private getUniqueID() {
    return v4();
  }

  private addSubscriber(listener: (_: SpeedometerValue) => unknown): string {
    const id = this.getUniqueID();
    this.subscribers[id] = listener;
    return id;
  }

  private getSubscriber(id: string): ((_: SpeedometerValue) => unknown) | null {
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
            subscriber({status: 'error', error});
          }
          this.stop();
          return;
        }
        if (position === null) {
          for (const subscriber of Object.values(this.subscribers)) {
            subscriber({status: 'none'});
          }
          return;
        }

        if (this.prevPosition !== null && position.coords.speed === null) {
          // Since speed is not provided, calculate speed using the previous position.
          const elapsedSec = (position.timestamp - this.prevPosition.timestamp) / 1000;
          const speed = getSpeedWithHaversine(this.prevPosition.coords, position.coords, elapsedSec);
          // Using JSON because using directy or cloning Position fails because of getter only properties.
          const updatedPosition = toMerged(JSON.parse(JSON.stringify(position)), {coords: {speed}});
          position = updatedPosition as Position;
        }

        // At the first time, the following code will set [prev, cur] = [null, a]
        // So at the second time, thinking the previous position has not been recorded,
        // it might not calculate the speed on its own.
        // But I think it might actually provider more accurate value.
        this.prevPosition = this.position;
        this.position = position;
        for (const subscriber of Object.values(this.subscribers)) {
          subscriber({status: 'ok', position: this.position});
        }
      },
    );
  }

  private async stop() {
    if (!this.watchID) {
      return;
    }
    this.position = null;
    this.prevPosition = null;
    try {
      await Geolocation.clearWatch({id: this.watchID});
    } finally {
      this.watchID = null;
    }
  }

  public subscribe(subscriber: (value: SpeedometerValue) => unknown): string {
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
