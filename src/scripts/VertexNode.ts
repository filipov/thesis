export interface VertexNode {
  name: string
  nodes?: VertexNode[]
}

export interface VertexNodeNS {
  name: string

  id: number
  parentId?: number
  depth: number

  childrenCount: number
}
