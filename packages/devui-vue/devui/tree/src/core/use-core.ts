import { computed, ComputedRef, Ref } from 'vue';
import { IInnerTreeNode, ITreeNode, IUseCore, valueof } from './tree-factory-types';
import { generateInnerTree } from './utils';

export default function useCore(data: Ref<IInnerTreeNode[]>): IUseCore {
  console.log('useCore:', data, data.value);

  const getLevel = (node: ITreeNode): number => {
    return data.value.find((item) => item.id === node.id).level;
  }
  
  const getChildren = (node: ITreeNode): IInnerTreeNode[] => {
    let result = [];
    const startIndex = data.value.findIndex((item) => item.id === node.id);

    for (let i = startIndex + 1; i < data.value.length && getLevel(node) < data.value[i].level; i++) {
      result.push(data.value[i]);
    }
    console.log('result:', result);
    
    return result;
  }

  const getExpendedTree = (): ComputedRef<IInnerTreeNode[]> => {
    return computed(() => {
      let excludeNodes = [];
      let result = [];

      for (let i = 0, len = data?.value.length; i < len; i++) {
        const item = data?.value[i];

        if (excludeNodes.map(node => node.id).includes(item.id)) {
          continue;
        }
        
        if (item.expanded !== true) {
          excludeNodes = getChildren(item);
        }

        result.push(item);
      }

      return result;
    });
  }

  const getIndex = (node: ITreeNode): number => {
    return data.value.findIndex((item) => item.id === node.id);
  }

  const getNode = (node: ITreeNode): IInnerTreeNode => {
    return data.value.find((item) => item.id === node.id);
  }

  const setNodeValue = (node: IInnerTreeNode, key: keyof IInnerTreeNode, value: valueof<IInnerTreeNode>): void => {
    data.value[getIndex(node)][key] = value;
  }

  const setTree = (newTree: ITreeNode[]): void => {
    data.value = generateInnerTree(newTree);
  }

  return {
    getLevel,
    getChildren,
    getExpendedTree,
    getIndex,
    getNode,
    setNodeValue,
    setTree,
  }
}