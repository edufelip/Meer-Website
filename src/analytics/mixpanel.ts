import mixpanel from "mixpanel-browser";

const isProduction = process.env.NODE_ENV === "production";
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

let isInitialized = false;

export const initMixpanel = () => {
  if (isInitialized || !MIXPANEL_TOKEN) {
    if (!MIXPANEL_TOKEN && isProduction) {
      console.warn("Mixpanel token is missing in production.");
    }
    return;
  }

  mixpanel.init(MIXPANEL_TOKEN, {
    debug: !isProduction,
    track_pageview: false, // We will handle this manually for Next.js App Router
    persistence: "localStorage",
  });
  isInitialized = true;
};

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (!isInitialized) return;
  
  try {
    mixpanel.track(eventName, properties);
  } catch (error) {
    console.error(`Failed to track event ${eventName} in Mixpanel:`, error);
  }
};

export const identifyUser = (userId: string, traits?: Record<string, unknown>) => {
  if (!isInitialized) return;

  try {
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  } catch (error) {
    console.error("Failed to identify user in Mixpanel:", error);
  }
};
