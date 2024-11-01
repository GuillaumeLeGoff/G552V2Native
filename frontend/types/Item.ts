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
}

export type { Item, Layout };
