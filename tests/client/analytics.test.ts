// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/public', () => ({
  env: {}
}));

import {
  initAnalytics,
  isAnalyticsEnabled,
  resetAnalyticsForTest,
  trackPageView
} from '../../src/lib/client/analytics';
import type { AnalyticsWindow } from '../../src/lib/client/analytics';

describe('GA4 analytics client', () => {
  const analyticsWindow = window as AnalyticsWindow;

  beforeEach(() => {
    resetAnalyticsForTest();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.title = 'Poldigm';
    delete analyticsWindow.dataLayer;
    delete analyticsWindow.gtag;
    window.history.replaceState({}, '', '/');
  });

  it('stays disabled without a measurement ID or in local runtime', () => {
    expect(isAnalyticsEnabled('', 'production')).toBe(false);
    expect(isAnalyticsEnabled('   ', 'production')).toBe(false);
    expect(isAnalyticsEnabled('G-TEST1234', 'local')).toBe(false);
  });

  it('does not insert the GA4 script when disabled', () => {
    initAnalytics({
      measurementId: '',
      environment: 'production',
      isBrowser: true,
      win: analyticsWindow,
      doc: document
    });

    initAnalytics({
      measurementId: 'G-TEST1234',
      environment: 'local',
      isBrowser: true,
      win: analyticsWindow,
      doc: document
    });

    expect(document.getElementById('ga4-gtag-script')).toBeNull();
    expect(analyticsWindow.dataLayer).toBeUndefined();
  });

  it('inserts the GA4 script once and disables automatic page views', () => {
    initAnalytics({
      measurementId: 'G-TEST1234',
      environment: 'production',
      isBrowser: true,
      win: analyticsWindow,
      doc: document
    });
    initAnalytics({
      measurementId: 'G-TEST1234',
      environment: 'production',
      isBrowser: true,
      win: analyticsWindow,
      doc: document
    });

    const scripts = document.querySelectorAll<HTMLScriptElement>('#ga4-gtag-script');
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toBe('https://www.googletagmanager.com/gtag/js?id=G-TEST1234');
    expect(analyticsWindow.dataLayer).toContainEqual([
      'config',
      'G-TEST1234',
      { send_page_view: false }
    ]);
  });

  it('tracks one page_view per location change', () => {
    window.history.replaceState({}, '', '/first?utm_source=test');

    const options = {
      measurementId: 'G-TEST1234',
      environment: 'production',
      isBrowser: true,
      win: analyticsWindow,
      doc: document
    };

    trackPageView(options);
    trackPageView(options);
    window.history.pushState({}, '', '/second');
    trackPageView(options);

    const pageViews =
      analyticsWindow.dataLayer?.filter(
        (entry) => entry[0] === 'event' && entry[1] === 'page_view'
      ) ?? [];

    expect(pageViews).toHaveLength(2);
    expect(pageViews[0][2]).toMatchObject({
      page_title: 'Poldigm',
      page_location: 'http://localhost:3000/first?utm_source=test',
      page_path: '/first?utm_source=test'
    });
    expect(pageViews[1][2]).toMatchObject({
      page_location: 'http://localhost:3000/second',
      page_path: '/second'
    });
    expect(JSON.stringify(pageViews)).not.toMatch(/nickname|resultId|scores|answers/i);
  });
});
