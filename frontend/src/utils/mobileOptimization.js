// Mobile optimization utilities
export const isMobile = () => {
  return window.innerWidth < 768;
};

export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

export const isDesktop = () => {
  return window.innerWidth >= 1024;
};

// Responsive grid classes
export const getGridClass = (defaultCols = 3) => {
  if (isMobile()) return 'grid-cols-1';
  if (isTablet()) return 'grid-cols-2';
  return `grid-cols-${defaultCols}`;
};

// Responsive padding
export const getResponsivePadding = () => {
  if (isMobile()) return 'p-3 sm:p-4';
  if (isTablet()) return 'p-4 md:p-6';
  return 'p-6 lg:p-8';
};

// Responsive text sizes
export const getResponsiveTextSize = (mobile, tablet, desktop) => {
  if (isMobile()) return mobile;
  if (isTablet()) return tablet;
  return desktop;
};

// Touch-friendly button size
export const getTouchFriendlySize = () => {
  return 'min-h-12 min-w-12'; // 48px minimum for touch targets
};

// Responsive image sizes
export const getImageSrcSet = (baseUrl) => {
  return {
    small: `${baseUrl}?w=300&h=300&fit=crop`,
    medium: `${baseUrl}?w=500&h=500&fit=crop`,
    large: `${baseUrl}?w=800&h=800&fit=crop`
  };
};
