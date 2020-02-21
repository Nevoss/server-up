export interface SiteConfig {
  root: string
  domain: string
  phpVersion: number
}

export interface Config {
  nginxPath: string
  hostsPath: string
  sites: SiteConfig[]
}
