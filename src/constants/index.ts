import { AgentIcon } from '../types';

/**
 * Configuration for agent icons in the sidebar
 */
export const AGENT_ICONS: AgentIcon[] = [
  { id: 'ad', icon: '/icones/AD.png', name: 'AD' },
  { id: 'ai1', icon: '/icones/AI Assistant-1.png', name: 'AI Assistant 1' },
  { id: 'campaigns', icon: '/icones/Campaigns.png', name: 'Campaigns' },
  { id: 'customerservice', icon: '/icones/CustomerService.png', name: 'Customer Service' },
  { id: 'fullfilment', icon: '/icones/Fullfilment.png', name: 'Fullfilment' },
  { id: 'handling', icon: '/icones/Handling.png', name: 'Handling' },
  { id: 'insights', icon: '/icones/Insights.png', name: 'Insights' },
  { id: 'offers', icon: '/icones/Offers.png', name: 'Offers' },
  { id: 'productrec', icon: '/icones/ProductRec.png', name: 'Product Rec' },
  { id: 'salesassistant', icon: '/icones/SalesAssistant.png', name: 'Sales Assistant' },
  { id: 'search', icon: '/icones/Search.png', name: 'Search' },
  { id: 'thirdparty', icon: '/icones/ThirdParty.png', name: 'Third Party' },
  { id: 'visualeditor', icon: '/icones/VisualEditor.png', name: 'Visual Editor' },
  { id: 'vtexhelp', icon: '/icones/VTEXHelp.png', name: 'VTEX Help' },
  { id: 'projects', icon: '/icones/Projects.png', name: 'Projects' },
];

/**
 * Navigation icons configuration
 */
export const NAVIGATION_ICONS = {
  search: '/icones/MagnifyingGlass.png',
  notification: '/icones/Notification.png',
  user: '/icones/User.png',
  logo: '/icones/Logo.png',
} as const;

/**
 * Layout dimensions
 */
export const LAYOUT_DIMENSIONS = {
  agentSidebarWidth: 80,
  expandedSidebarWidth: 320,
  iconSize: 28,
  iconButtonSize: 40,
  logoSize: 32,
  navigationIconSize: 20,
  navigationButtonSize: 40,
} as const;

/**
 * Spacing configuration
 */
export const SPACING = {
  sidebarPadding: 24,
  logoMarginTop: 16,
  logoMarginBottom: 24,
  titleMarginTop: 18,
  iconGap: 8,
  bottomMargin: 24,
} as const;
