import { appBaseUrl } from '$lib/constants/runtime';

export const siteName = 'Poldigm';
export const siteTitle = 'Poldigm - 나의 사회적·정치적 가치관 테스트';
export const siteDescription =
  '20개의 딜레마 문항으로 나의 사회적·정치적 가치관과 16가지 스펙트럼을 확인해보세요.';
export const siteLocale = 'ko_KR';
export const siteImageAlt = 'Poldigm 가치관 밸런스 체크';

const normalizedBaseUrl = appBaseUrl.replace(/\/$/, '');

export function absoluteUrl(path: string) {
  return `${normalizedBaseUrl}${path === '/' ? '/' : path}`;
}

export const defaultOgImageUrl = absoluteUrl('/og-image.svg');

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

export const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteName,
  url: absoluteUrl('/'),
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  inLanguage: 'ko-KR',
  description: siteDescription,
  image: defaultOgImageUrl,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW'
  }
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
