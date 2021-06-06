import { animation, animate, style, keyframes } from '@angular/animations';
  
  export const errorFormAnimation = animation([
    animate('0.5s', keyframes([
        style({ backgroundColor: 'white' }),
        style({ backgroundColor: 'red' }),
        style({ backgroundColor: 'white' })
      ]))
  ]);