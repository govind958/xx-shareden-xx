import mixpanel, { Config } from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string | undefined;

let initialized = false;

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  if (MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: false,
      debug: process.env.NODE_ENV === "development",
      persistence: "localStorage",
      batch_requests: true,
      batch_flush_interval_ms: 5000,
    } as Partial<Config>);
    initialized = true;
  }
}

const lazyMixpanel = new Proxy(mixpanel, {
  get(target, prop, receiver) {
    ensureInit();
    return Reflect.get(target, prop, receiver);
  },
});

export default lazyMixpanel;
