import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { appEnv } from '$lib/constants/runtime';

const GA4_SCRIPT_ID = 'ga4-gtag-script';
const GA4_SCRIPT_SRC = 'https://www.googletagmanager.com/gtag/js';

export type PageViewPayload = {
  page_title: string;
  page_location: string;
  page_path: string;
};

export type GtagArguments =
  | ['js', Date]
  | ['config', string, { send_page_view: false }]
  | ['event', 'page_view', PageViewPayload];

export type Gtag = (...args: GtagArguments) => void;

export type AnalyticsWindow = Window & {
  dataLayer?: GtagArguments[];
  gtag?: Gtag;
};

type AnalyticsOptions = {
  measurementId?: string;
  environment?: string;
  win?: AnalyticsWindow;
  doc?: Document;
  isBrowser?: boolean;
};

let initialized = false;
let lastPageLocation = '';

function getMeasurementId(measurementId = env.PUBLIC_GA_MEASUREMENT_ID) {
  return measurementId?.trim() ?? '';
}

function getRuntime(options: AnalyticsOptions) {
  return {
    measurementId: getMeasurementId(options.measurementId),
    environment: options.environment ?? appEnv,
    win: options.win ?? (typeof window !== 'undefined' ? (window as AnalyticsWindow) : undefined),
    doc: options.doc ?? (typeof document !== 'undefined' ? document : undefined),
    isBrowser: options.isBrowser ?? browser
  };
}

export function isAnalyticsEnabled(measurementId = env.PUBLIC_GA_MEASUREMENT_ID, environment = appEnv) {
  return environment !== 'local' && Boolean(getMeasurementId(measurementId));
}

export function initAnalytics(options: AnalyticsOptions = {}) {
  const runtime = getRuntime(options);

  if (
    initialized ||
    !runtime.isBrowser ||
    !runtime.win ||
    !runtime.doc ||
    !isAnalyticsEnabled(runtime.measurementId, runtime.environment)
  ) {
    return;
  }

  runtime.win.dataLayer = runtime.win.dataLayer ?? [];
  runtime.win.gtag =
    runtime.win.gtag ??
    ((...args: GtagArguments) => {
      runtime.win?.dataLayer?.push(args);
    });

  if (!runtime.doc.getElementById(GA4_SCRIPT_ID)) {
    const script = runtime.doc.createElement('script');
    script.id = GA4_SCRIPT_ID;
    script.async = true;
    script.src = `${GA4_SCRIPT_SRC}?id=${encodeURIComponent(runtime.measurementId)}`;
    runtime.doc.head.appendChild(script);
  }

  runtime.win.gtag('js', new Date());
  runtime.win.gtag('config', runtime.measurementId, { send_page_view: false });
  initialized = true;
}

export function trackPageView(options: AnalyticsOptions = {}) {
  const runtime = getRuntime(options);

  if (
    !runtime.isBrowser ||
    !runtime.win ||
    !runtime.doc ||
    !isAnalyticsEnabled(runtime.measurementId, runtime.environment)
  ) {
    return;
  }

  initAnalytics(options);

  if (!runtime.win.gtag) {
    return;
  }

  const pageLocation = runtime.win.location.href;

  if (pageLocation === lastPageLocation) {
    return;
  }

  lastPageLocation = pageLocation;
  runtime.win.gtag('event', 'page_view', {
    page_title: runtime.doc.title,
    page_location: pageLocation,
    page_path: `${runtime.win.location.pathname}${runtime.win.location.search}`
  });
}

export function resetAnalyticsForTest() {
  initialized = false;
  lastPageLocation = '';
}
