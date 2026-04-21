import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

// GSAP shared defaults
gsap.defaults({ ease: 'power3.out', duration: 0.6 });

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const FULL_MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
