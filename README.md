#About

This library is an Angular 6+ ready version of ng-lightning and contains native Angular components and directives written from scratch in TypeScript using the Lightning Design System CSS framework.

My current project for a big client used [ng-lightning](https://github.com/ng-lightning/ng-lightning) and was therefore dependent on rxjs-compat for updates to Angular >= 6. 

My employer [leanovate](https://github.com/leanovate) enables developers to use up to 20% of his/her time for learning. So I decided to migrate ng-lightning to ng6...     

This started as a fork with the goal of a PR with all changes needed. 
But it seems, the original project does not get that much attention from the original contributers any longer. Don't get me wrong, this is not meant as blaming or something like that! 
But getting no resoponse on gitter and looking at the (lack of) responses in the issues section might give that impression.

Here is what I did:
* Migrated the project to angular-cli, the demo app used the cli already but now the lib also uses it
  * That makes upgrading an publishing a breeze
* Implement the ts linting rules that come with angular (cli)
  * Yes, this also includes the naming conventions of components, directives etc
* Move away from plug for templates because I did not see the advantage, just one more moving piece

# Disclaimer

I'm currently using ngx-lightning in a backoffice application for the largest online auction and shopping website. So it is tested, bugs will be fixed and I'll try to keep up to date 
with both angular and the Sales Force lightning design system. As of now (v1.0.0) the demo app is not yet migrated. I'll work on that later.
Due to the PR / own project questions I messed up the git history. So you cannot spot the changes I did in the git history of this project.   

## Installation

Install through `npm`:

```bash
npm install --save ngx-lightning
```

## Documentation
The creators of ng-lightning have a [comprehensive demo page](http://ng-lightning.github.io/ng-lightning/#/), please go there to see it in action.  

#### Dependencies
This library depends on Salesforce's LDS markup and CSS (tested with 2.2.1). We don't ship any CSS file, but you have to take care of including LDS CSS rules in your page. 
There are various ways to achieve this, for example compiling through their source files ([`@salesforce-ux/design-system`](https://github.com/salesforce-ux/design-system)) or by adding this into your `<head>`:
```html
<link rel="stylesheet" href="https://unpkg.com/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css">
```
If you have an angular-cli project, you can integrate it by:
* `npm i @salesforce-ux/design-system`
* Setup symlinks in 
  * src/scss 
    * salesforce-ux -> ../../node_modules/@salesforce-ux/design-system
  * src/assets
    * fonts -> ../../node_modules/@salesforce-ux/design-system/assets/fonts
    * icons -> ../../node_modules/@salesforce-ux/design-system/assets/icons
    * images -> ../../node_modules/@salesforce-ux/design-system/assets/images
* Include these asset directorie in the `assets` section of your angular.json
* Import the styles in your styles.scss
  * `@import "salesforce-ux/scss/index";`  


# Migrating from ng-lightning to ngx-lightning
I assume you already updated your project to angular 6 or 7 and need to migrate to ngx-lightning because you want to get rid of rxjs-compat.
* Enforce the [linting rules for rxjs](https://www.npmjs.com/package/rxjs-tslint-rules)
  * Especially to use the correct imports of all the rxjs stuff
* `npm remove ng-lightning`
* `npm i ngx-lightning`
* Replace `ng-lightning` with `ngx-lightning` in all imports



#### Breaking Changes
The good news is, that all the component and directive selectors have **not** changed :-)

But according to coding conventions from Angular, components, directives, pipes etc have been renamed. So for instance `NglTab` becomes `NglTabDirective`, the property `id` of the tab is now `nglTabId`. But your Typescript compiler will complain 
about that and the fix should be quite easy and straight forward.


  

