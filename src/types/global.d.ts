
interface Window {
  gtag?: (command: string, ...args: any[]) => void;
  dataLayer?: any[];
  trackEvent?: (category: string, action: string, label?: string, value?: number) => void;
}
