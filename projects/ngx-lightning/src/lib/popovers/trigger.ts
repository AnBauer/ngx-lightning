import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import * as Tether from 'tether';
import { Direction, NglPopoverComponent } from './popover';
import { placement } from './placements';
import { toBoolean } from '../util/util';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[nglPopover]',
  exportAs: 'nglPopover'
})
export class NglPopoverTriggerDirective implements OnDestroy {

  @Input() nglPopover: string | TemplateRef<any>;

  @Input() nglPopoverHeader: string;
  @Input() nglPopoverFooter: string;

  @Input() set nglPopoverPlacement(_placement: Direction) {
    this.placement = _placement || 'top';
    this.setTether();
  }

  @Input() set nglPopoverTheme(theme: string) {
    this.theme = theme;
    this.setPopover();
  }

  @Input() nglTooltip: string | boolean;

  @Input() set nglPopoverDelay(delay: any | any[]) {
    delay = Array.isArray(delay) ? delay : [delay, delay];
    [this.openDelay, this.closeDelay] = delay.map(Number);
  }

  @Input() set nglInteractive(interactive: boolean | string) {
    this.interactive = toBoolean(interactive);
  }

  get nglInteractive() {
    return this.interactive;
  }

  @Input() set nglOpen(open: boolean) {
    this.toggle(open, open ? this.openDelay : this.closeDelay);
  }

  // Emit an event when actual popover is shown or hidden
  @Output() nglPopoverToggled = new EventEmitter<boolean>();

  private popover: NglPopoverComponent;
  private popoverFactory: ComponentFactory<NglPopoverComponent>;
  private componentRef: ComponentRef<NglPopoverComponent>;
  private viewRef: EmbeddedViewRef<any>;
  private placement: Direction = 'top';
  private theme: string;
  private tether: Tether;
  private openDelay = 0;
  private closeDelay = 0;
  private toggleTimeout: any = null;
  private interactive = false;
  private interactiveSubscription: any = null;

  constructor(private element: ElementRef, private viewContainer: ViewContainerRef, private injector: Injector,
              private ngZone: NgZone,
              private renderer: Renderer2, componentFactoryResolver: ComponentFactoryResolver) {
    this.popoverFactory = componentFactoryResolver.resolveComponentFactory(NglPopoverComponent);
  }

  // Expose open method
  open(delay = this.openDelay) {
    this.toggle(true, delay);
  }

  // Expose close method
  close(delay = this.closeDelay) {
    this.toggle(false, delay);
  }

  position(async = true) {
    this.ngZone.runOutsideAngular(() => {
      if (async) {
        setTimeout(() => this.tether.position());
      } else {
        this.tether.position();
      }
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  private toggle(open: boolean, delay: number) {
    if (this.toggleTimeout !== null) {
      clearTimeout(this.toggleTimeout);
      this.toggleTimeout = null;
    }

    const toggleFn = (open ? this.create : this.destroy).bind(this);

    if (delay > 0) {
      this.toggleTimeout = setTimeout(() => {
        this.toggleTimeout = null;
        toggleFn();
      }, delay);
    } else {
      toggleFn();
    }
  }

  private setTether(create = false) {
    if (!this.tether && !create) {
      return;
    }

    const {attachment, targetAttachment, offset} = placement(this.placement);
    const options = {
      element: this.popover.element.nativeElement,
      target : this.element.nativeElement,
      attachment,
      targetAttachment,
      offset
    };

    if (create) {
      this.tether = new Tether(options);
    } else {
      this.tether.setOptions(options);
    }

    this.setPopover();
  }

  private setPopover() {
    if (!this.popover) {
      return;
    }

    const {opposite} = placement(this.placement);
    this.popover.nubbin = opposite;
    this.popover.theme = this.theme;
    this.popover.nglTooltip = this.nglTooltip;
  }

  private create() {
    if (this.componentRef) {
      return;
    }

    const {nodes, viewRef} = this.getProjectableNodes();
    this.viewRef = viewRef;

    this.componentRef = this.viewContainer.createComponent(this.popoverFactory, 0, this.injector, [nodes]);
    this.popover = this.componentRef.instance;
    this.popover.header = this.nglPopoverHeader;
    this.popover.footer = this.nglPopoverFooter;
    this.popover.afterViewInit.pipe(take(1)).subscribe(() => this.position(false));

    if (this.nglInteractive) {
      this.interactiveSubscription = this.popover.onInteraction.subscribe((enter: boolean) => this.nglOpen = enter);
    }

    this.setTether(true);

    // To avoid unexpected behavior when template "lives" inside an OnPush
    // component, explicitlly request change detection to run on creation.
    this.popover.changeDetector.markForCheck();

    this.nglPopoverToggled.emit(true);
  }

  private getProjectableNodes(): { nodes: any[], viewRef?: EmbeddedViewRef<any> } {
    if (this.nglPopover instanceof TemplateRef) {
      const viewRef: EmbeddedViewRef<any> = this.viewContainer.createEmbeddedView(<TemplateRef<any>>this.nglPopover);
      return {nodes: viewRef.rootNodes, viewRef};
    } else {
      return {nodes: [this.renderer.createText(<string>this.nglPopover)]};
    }
  }

  private destroy() {
    if (!this.componentRef) {
      return;
    }

    this.tether.destroy();
    this.tether = null;

    // Cleanup template view
    if (this.viewRef) {
      this.viewContainer.remove(this.viewContainer.indexOf(this.viewRef));
      this.viewRef = null;
    }

    this.viewContainer.remove(this.viewContainer.indexOf(this.componentRef.hostView));
    this.componentRef.destroy();
    this.componentRef = null;
    this.popover = null;

    if (this.interactiveSubscription) {
      this.interactiveSubscription.unsubscribe();
    }

    this.nglPopoverToggled.emit(false);
  }
}
