"use client";

import { useEffect } from "react";
import {
  removeHomeSectionIntentQueryParam,
  resolveHomeSectionIntent,
  scrollToHomeSection
} from "./homeSections";

export default function HomeSectionIntentHandler() {
  useEffect(() => {
    const sectionId = resolveHomeSectionIntent(window.location.search, window.location.hash);
    if (!sectionId) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const didScroll = scrollToHomeSection(sectionId);
      if (!didScroll) {
        return;
      }

      const nextSearch = removeHomeSectionIntentQueryParam(window.location.search);
      const isHomeSectionHash = resolveHomeSectionIntent("", window.location.hash) !== null;
      const nextHash = isHomeSectionHash ? "" : window.location.hash;
      const nextUrl = `${window.location.pathname}${nextSearch}${nextHash}`;
      window.history.replaceState(window.history.state, "", nextUrl);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return null;
}
