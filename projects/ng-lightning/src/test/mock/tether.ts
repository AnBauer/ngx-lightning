export function Tether(): any {
  (<any>Tether).spyPosition = jasmine.createSpy('tether.position');
  (<any>Tether).spyDestroy = jasmine.createSpy('tether.position');

  this.setOptions = () => {};
  this.position = (<any>Tether).spyPosition.and.callThrough();
  this.destroy = (<any>Tether).spyDestroy;
}

