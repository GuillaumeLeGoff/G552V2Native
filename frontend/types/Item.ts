interface Item {
  id: number;
  title: string;
}

interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
  item: Item;
  index: number;
}

export type { Item, Layout };
