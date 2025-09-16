import mixpanel, { Config } from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string | undefined;

// Initialize immediately (safe because Mixpanel won’t init twice)
if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    autocapture: true,
    debug: process.env.NODE_ENV === "development",
  } as Partial<Config>);
} else {
  console.warn("Mixpanel token is missing! Check your .env.local file.");
}

// Export the initialized mixpanel instance
export default mixpanel;
