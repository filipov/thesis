import { VertexNode, VertexNodeNS } from './VertexNode'

const treeToNestedSetsArray = (nodes: VertexNode[], parentId = 0, depth = 0, id = 0) => {
  let array: VertexNodeNS[] = []

  nodes.forEach((node) => {
    id += 1

    array.push({
      id,
      depth,
      name: node.name,
      parentId,
      childrenCount: node.nodes ? node.nodes.length : 0,
    })

    if (node.nodes) {
      const deepArray = treeToNestedSetsArray(node.nodes, id, depth + 1, id)

      id += deepArray.length

      array = [...array, ...deepArray]
    }
  })

  return array
}

export default treeToNestedSetsArray
