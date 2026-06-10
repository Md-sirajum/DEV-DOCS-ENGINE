/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppView = 'login' | 'dashboard' | 'page1' | 'tracking';

export interface UserSession {
  isAuthenticated: boolean;
  username: string;
}

export const VALID_USERNAMES = [
  'sirajummoni',
  'sirajum.monir@icloud.com',
  'vipback360@gmail.com',
  '0157680953'
] as const;

export const VALID_PASSWORDS = [
  '2217600373',
  'Lamiya+shafin@5403'
] as const;
