/**
 * Interface of the configuration object
 */
export interface INglConfig {

  /**
   * The path to SLDS assets, for example 'assets/icons'
   */
  svgPath?: string;

  /**
   * The color of the icon when status is "on", for example '#FFB75D'
   */
   ratingColorOn?: string;

   /**
    * The color of the icon when status is "on", for example '#54698D'
    */
   ratingColorOff?: string;

}
