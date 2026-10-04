// bg.png基準の0〜1座標ぽよん
export type Point = [number, number];

export type SceneObject = {
  id: string;
  src?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  action: string;
  hitArea: {
    type: "polygon";
    points: Point[];
  };
};

export type SceneData = {
  background: {
    src: string;
    width: number;
    height: number;
  };
  objects: SceneObject[];
};

export type BgRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};