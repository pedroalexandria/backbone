/**
 * Agent icon configuration
 */
export interface AgentIcon {
  id: string;
  icon: string;
  name: string;
}

/**
 * Task item configuration
 */
export interface TaskItem {
  title: string;
  hasNotification?: boolean;
}

/**
 * Sidebar state
 */
export interface SidebarState {
  expandedSidebar: boolean;
  selectedAgent: string | null;
}
