from collections import deque

class TreeNode(object):
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution(object):
    def isValidBST(self, root):
        def kthSmallest(self, root, k):
            deka = deque()
            item_set = set()
            deka.append(root)
            while deka:
                for item in range(len(deka)):
                    node = deka.pop()
                    if node.left:
                        deka.appendleft(node.left)
                    if node.right:
                        deka.appendleft(node.right)
                    item_set.add(node.value)
            result = None
            while k:
                result = min(item_set)
                item_set.remove(result)
                k -= 1
            return result
