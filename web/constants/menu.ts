export const MENU = {
  BASE: {
    key: "base",
    label: "Base Hotel",
    type: "modal"
  },
  SELECT: {
    key: "select",
    label: "Select Hotel",
    type: "modal"
  },
  
} as const;

export type MenuType = typeof MENU[keyof typeof MENU]["key"];

export const MENU_MAP: Record<MenuType, (typeof MENU)[keyof typeof MENU]> =
  Object.fromEntries(
    Object.values(MENU).map(m => [m.key, m])
  ) as any;