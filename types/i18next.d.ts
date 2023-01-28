/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next'

import type account from '../public/locales/en/account.json'
import type auth from '../public/locales/en/auth.json'
import type common from '../public/locales/en/common.json'
import type landing from '../public/locales/en/landing.json'
import type sites from '../public/locales/en/sites.json'
import type teams from '../public/locales/en/teams.json'

interface I18nNamespaces {
  account: typeof account
  auth: typeof auth
  common: typeof common
  landing: typeof landing
  sites: typeof sites
  teams: typeof teams
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'

    resources: I18nNamespaces
  }
}
