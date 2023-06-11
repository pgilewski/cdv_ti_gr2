import { Notyf } from 'notyf';
import { createContext } from 'react';

export const NotyfContext = createContext(
  new Notyf({
    duration: 5000, // Set your global Notyf configuration here
  })
);
