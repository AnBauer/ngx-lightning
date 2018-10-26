import { NglConfig } from './config';

describe('`NglConfig`', () => {

  it('should have default values', () => {
    const config = new NglConfig();
    expect(config.get('svgPath')).toBe('assets/icons');
  });

  it('should emit when changes happen', () => {
    const config = new NglConfig();

    const cd = jasmine.createSpy('markForCheck');
    config._emitter.subscribe(cd);
    expect(cd).not.toHaveBeenCalled();

    config.update({ svgPath: 'new/path' });
    expect(config.get('svgPath')).toBe('new/path');
    expect(cd).toHaveBeenCalled();
  });

});
