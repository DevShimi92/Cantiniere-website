// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from '@nativescript/angular';

import { AppModule } from '@src/app/app.module';

/*import { android, on, launchEvent, ApplicationEventData } from '@nativescript/core/application';

// Typescript will require you to define those types  [WHITE THEME FORCED IN DARK THEME]
declare namespace androidx {
 export namespace appcompat {
  export namespace app {
   export const AppCompatDelegate: any;
  }
 }
}

if (android) {
 on(launchEvent, (args: ApplicationEventData) => {
  androidx.appcompat.app.AppCompatDelegate.setDefaultNightMode(androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO)
 });
}*/

// A traditional NativeScript application starts by initializing global objects,
// setting up global CSS rules, creating, and navigating to the main page.
// Angular applications need to take care of their own initialization: modules, components, directives, routes, DI providers.
// A NativeScript Angular app needs to make both paradigms work together,
// so we provide a wrapper platform object, platformNativeScriptDynamic,
// that sets up a NativeScript application and can bootstrap the Angular framework.
platformNativeScriptDynamic().bootstrapModule(AppModule);
