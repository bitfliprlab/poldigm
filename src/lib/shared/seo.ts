import { appBaseUrl } from '$lib/constants/runtime';

export const siteName = 'Poldigm';
export const siteTitle = 'Poldigm - 나의 사회적·정치적 가치관 테스트';
export const siteDescription =
  '20개의 딜레마 문항으로 나의 사회적·정치적 가치관과 16가지 스펙트럼을 확인해보세요.';
export const siteLocale = 'ko_KR';

export function absoluteUrl(path: string) {
  return `${appBaseUrl}${path === '/' ? '' : path}`;
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: absoluteUrl('/'),
  inLanguage: 'ko-KR',
  description: siteDescription,
  potentialAction: {
    '@type': 'EntryPoint',
    urlTemplate: absoluteUrl('/test')
  }
};

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/favicon.svg')
};

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}
