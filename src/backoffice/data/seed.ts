import type { BackofficeState } from './types';

/**
 * The back-office boots empty by design — every lead, task, note and
 * invoice is added by the user through the in-app forms (see the
 * "+ ליד חדש" button in the leads view, the invoice tab in lead detail,
 * etc). The only way to get content in is to type it.
 *
 * If you want a one-shot demo dataset, drop seed leads into the array
 * below and call resetAll() from the topbar.
 */
export const SEED_STATE: BackofficeState = {
  version: 1,
  leads: [],
  activity: [],
};
