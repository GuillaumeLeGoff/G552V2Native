interface Item {
  id: number;
  title: string;
}

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ItemLayouts = {
  [key: number]: Layout;
};

export type { Item };
