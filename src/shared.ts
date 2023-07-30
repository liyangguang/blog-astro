export const SITE_TITLE = `Yangguang Li - Web dev, UX engineer`;
export const SITE_DESCRIPTION = 'Yangguang Li - Web dev, UX engineer in SF Bay Area. I write about web developement and more.';

// Blog has `.slug`, but tags need to be handled manually.
export function slugify(input: string): string {
  return input.toLowerCase().replace(/\W+/, '-');
}
