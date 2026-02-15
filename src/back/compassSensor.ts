import {v4} from 'uuid';
import z from 'zod';

class CompassSensor {
  private subscribers: Record<string, (_: DeviceOrientationEvent) => unknown> = {};

  private getUniqueID = () => {
    return v4();
  };

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

  public subscribe(setter: (value: DeviceOrientationEvent | null) => unknown): string {
    const listener = (event: DeviceOrientationEvent) => {
      setter(event);
    };
    window.addEventListener('deviceorientationabsolute', listener);
    return this.addSubscriber(listener);
  }

  public unsubscribe(id: string): boolean {
    const listener = this.getSubscriber(id);
    if (!listener) {
      return false;
    }
    window.removeEventListener('deviceorientationabsolute', listener);
    return this.deleteSubscriber(id);
  }
}

export default CompassSensor;
