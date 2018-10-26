import {NgModule, ModuleWithProviders} from '@angular/core';


import {NglBadgesModule} from './badges/module';
import {NglBreadcrumbsModule} from './breadcrumbs/module';
import {NglButtonsModule} from './buttons/module';
import {NglDatatablesModule} from './datatables/module';
import {NglDatepickersModule} from './datepickers/module';
import {NglFormsModule} from './forms/module';
import {NglIconsModule} from './icons/module';
import {NglImagesModule} from './images/module';
import {NglLookupsModule} from './lookups/module';
import {NglMenusModule} from './menus/module';
import {NglModalsModule} from './modals/module';
import {NglNotificationsModule} from './notifications/module';
import {NglPaginationsModule} from './paginations/module';
import {NglPickModule} from './pick/module';
import {NglPicklistModule} from './picklist/module';
import {NglPillsModule} from './pills/module';
import {NglPopoversModule} from './popovers/module';
import {NglRatingsModule} from './ratings/module';
import {NglSectionsModule} from './sections/module';
import {NglSpinnersModule} from './spinners/module';
import {NglTabsModule} from './tabs/module';
import {INglConfig} from './config/config.interface';
import {NglConfig, NGL_CONFIG} from './config/config';

export {INglDatatableSort, INglDatatableRowClick} from './datatables/module';
export {INglConfig} from './config/config.interface';
export {NglConfig} from './config/config';

const MODULES = [
  NglBadgesModule,
  NglBreadcrumbsModule,
  NglButtonsModule,
  NglDatatablesModule,
  NglDatepickersModule,
  NglFormsModule,
  NglIconsModule,
  NglImagesModule,
  NglLookupsModule,
  NglMenusModule,
  NglModalsModule,
  NglNotificationsModule,
  NglPaginationsModule,
  NglPickModule,
  NglPicklistModule,
  NglPillsModule,
  NglPopoversModule,
  NglRatingsModule,
  NglSectionsModule,
  NglSpinnersModule,
  NglTabsModule,
];

@NgModule({
  exports: MODULES,
})
export class NglModule {
  static forRoot(config: INglConfig = {}): ModuleWithProviders {
    return {
      ngModule: NglModule,
      providers: [
        { provide: NGL_CONFIG, useValue: config },
        NglConfig,
      ],
   };
 }
}
