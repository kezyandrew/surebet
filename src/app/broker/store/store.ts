import { Arber } from '@arbers';
import { Bookie } from '@bookies';
import { BookieName } from '@models';
import { Currency } from '@money/types';
import { singleton } from 'tsyringe';

// Define a common interface for both bookie types
export interface IBookieBase {
  id: string;
  name: BookieName;
  wantsToMaximize: boolean;
  paused: boolean;
  authenticated: boolean;
  currency: Currency;
  close(): Promise<void>;
  pause(): void;
  resume(): void;
  setMaximize(wants: boolean): void;
  setBalance(amount: number): void;
  balance(): number;
  repo(): any; // Simplified for compatibility
  postulating(): void;
  placing(): void;
  placed(): void;
  resetStatus(): void;
}

@singleton()
export class WSStore {
  private _instances: IBookieBase[] = [];
  private _arbers: Arber[] = [];

  constructor() {}

  addArber(arber: Arber) {
    console.log('Adding arber', arber.id);
    this._arbers.push(arber);
  }

  arbers() {
    return this._arbers;
  }

  getArberInstance(id: string) {
    return this._arbers.find((i) => i.id === id);
  }

  closeArber(id: string) {
    this._arbers = this._arbers.filter((i) => i.id !== id);
  }

  addInstance(bookie: IBookieBase) {
    this._instances.push(bookie);
  }

  instances() {
    return this._instances;
  }

  getBookieInstance(id: string) {
    return this._instances.find((i) => i.id === id);
  }

  closeBookie(id: string) {
    this._instances = this._instances.filter((i) => i.id !== id);
  }

  async closeAll(skip: BookieName[] = []) {
    await Promise.all(
      this._instances.map((i) => {
        if (!skip.includes(i.name)) {
          return i.close();
        }
      }),
    );
  }
}
