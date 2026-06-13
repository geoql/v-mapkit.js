export interface NavItem {
  title: string;
  path: string;
}

export interface NavSection {
  title: string;
  path: string;
  children: NavItem[];
}
