
import { ReactNode, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    const trackPageView = () => {
      if (typeof window.gtag !== 'undefined' && import.meta.env.VITE_GA_MEASUREMENT_ID) {
        window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
          page_path: location.pathname + location.search
        });
      }
    };

    trackPageView();
  }, [location]);

  // Function to track specific events
  const trackEvent = (category: string, action: string, label?: string, value?: number) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  };

  // Make trackEvent available globally
  useEffect(() => {
    window.trackEvent = trackEvent;
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Layout;
