import {Injectable, EventEmitter, InjectionToken, Inject} from '@angular/core';
import {INglConfig} from './config.interface';

export const NGL_CONFIG = new InjectionToken<INglConfig>('NGL_CONFIG');

@Injectable()
export class NglConfig {

  _emitter = new EventEmitter();

  private values: INglConfig = {
    svgPath: 'assets/icons',
    ratingColorOn: '#FFB75D',
    ratingColorOff: '#54698D',
  };

  constructor(@Inject(NGL_CONFIG) config: INglConfig = null) {
    this.values = Object.assign({}, this.values, config || {});
  }

  update(config: INglConfig) {
    this.values = Object.assign({}, this.values, config || {});
    this._emitter.emit();
  }

  get(key: string) {
    return (<any>this.values)[key];
  }
}

// Intrenal decorator
export function NglConfigurable(config = {changeDetectorProperty: 'cd'}) {
  return function (constructor: Function) {
    const { ngOnInit, ngOnDestroy } = constructor.prototype;

    constructor.prototype.ngOnInit = function() {
      const changeDetectorRef = this[config.changeDetectorProperty];

      if (!changeDetectorRef || !changeDetectorRef.markForCheck) {
        throw Error(`NglConfig: invalid ChangeDetectorRef at property "${config.changeDetectorProperty}"`);
      }

      this.nglConfigSubscription = this.config._emitter.subscribe(() => {
        if (this.nglOnConfigChanges) {
          this.nglOnConfigChanges();
        }
        changeDetectorRef.markForCheck();
      });

      if (ngOnInit) {
        ngOnInit.call(this);
      }
    };

    constructor.prototype.ngOnDestroy = function() {
      if (this.nglConfigSubscription) {
        this.nglConfigSubscription.unsubscribe();
        this.nglConfigSubscription = null;
      }

      if (ngOnDestroy) {
        ngOnDestroy.call(this);
      }
    };
  };
}
