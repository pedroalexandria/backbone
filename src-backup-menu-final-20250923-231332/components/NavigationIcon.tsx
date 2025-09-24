import React from 'react';

const NAVIGATION_ICONS = {
  search: '/icones/MagnifyingGlass.png',
  notification: '/icones/Notification.png',
  user: '/icones/User.png',
  logo: '/icones/Logo.png',
} as const;

interface NavigationIconProps {
  icon: keyof typeof NAVIGATION_ICONS;
  alt: string;
  hasNotification?: boolean;
  className?: string;
}

/**
 * Navigation icon component (search, notification, user)
 */
export const NavigationIcon: React.FC<NavigationIconProps> = ({ 
  icon, 
  alt, 
  hasNotification = false,
  className = "w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 transition-colors"
}) => {
  const iconSize = icon === 'user' ? 'w-7 h-7' : 'w-5 h-5';
  
  return (
    <button className={className}>
      <img 
        src={`${NAVIGATION_ICONS[icon]}?v=${Date.now()}`} 
        alt={alt}
        className={iconSize}
        onError={(e) => {
          console.error(`Failed to load ${String(icon)} icon`);
          e.currentTarget.style.display = 'none';
        }}
      />
      {hasNotification && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" style={{ marginRight: 0 }}></div>
      )}
    </button>
  );
};
