import { animation, trigger, animateChild, group, transition, animate, style, query, keyframes } from '@angular/animations';
  
  export const errorFormAnimation = animation([
    animate('0.5s', keyframes([
        style({ backgroundColor: 'white' }),
        style({ backgroundColor: 'red' }),
        style({ backgroundColor: 'white' })
      ]))
  ]);