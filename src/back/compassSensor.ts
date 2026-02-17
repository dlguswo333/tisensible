import {v4} from 'uuid';
import z from 'zod';

class CompassSensor {
  private subscribers: Record<string, (_: DeviceOrientationEvent) => unknown> = {};
  private watcher: ((_: DeviceOrientationEvent) => unknown) | null = null;

  private getUniqueID() {
    return v4();
  }

  private addSubscriber(listener: (_: DeviceOrientationEvent) => unknown): string {
    const id = this.getUniqueID();
    this.subscribers[id] = listener;
    return id;
  }

  private getSubscriber(id: string): ((_: DeviceOrientationEvent) => unknown) | null {
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
    try {
      if (
        'requestPermission' in DeviceOrientationEvent &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        const requestPermissionType = z.function({
          input: [],
          output: z.promise(z.literal(['granted', 'denied'])),
        });
        const requestPermission = requestPermissionType.parse(DeviceOrientationEvent.requestPermission);
        const result = await requestPermission();
        return result === 'granted';
      }
      return true;
    } catch {
      return false;
    }
  }

  private async start() {
    if (this.watcher) {
      return;
    }
    this.watcher = (event) => {
      for (const subscriber of Object.values(this.subscribers)) {
        subscriber(event);
      }
    };
    window.addEventListener('deviceorientationabsolute', this.watcher);
  }

  private async stop() {
    if (!this.watcher) {
      return;
    }
    window.removeEventListener('deviceorientationabsolute', this.watcher);
    this.watcher = null;
  }

  public subscribe(subscriber: (value: DeviceOrientationEvent | null) => unknown): string {
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

export default new CompassSensor();
