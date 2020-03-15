var TreeNode = /** @class */ (function () {
    function TreeNode(data) {
        this.left = null;
        this.right = null;
        this.count = 0;
        this.data = data;
    }
    TreeNode.prototype.show = function () {
        return this.data;
    };
    return TreeNode;
}());
var BST = /** @class */ (function () {
    function BST() {
        this.root = null;
        this.length = 0;
    }
    // 插入节点
    BST.prototype.insert = function (data) {
        // 先创建新的节点
        var node = new TreeNode(data);
        if (this.root === null) {
            this.root = node;
            return;
        }
        else {
            var originNode 
            // 将当前节点设为树根节点
            = void 0;
            // 将当前节点设为树根节点
            var currentNode = this.root;
            // 开始循环
            while (true) {
                // 保存原节点引用
                originNode = currentNode;
                //  如果插入节点的数据小于当前节点的数据
                if (data < currentNode.data) {
                    // 将新当前节点设为原当前节点的左节点
                    currentNode = currentNode.left;
                    // 如果当前节点的左节点为 `null` ，就将新的节点插入这个位置，退出循环；否则执行下一次循环
                    if (currentNode === null) {
                        originNode.left = node;
                        break;
                    }
                }
                else {
                    // 将新当前节点设为原当前节点的右节点
                    currentNode = currentNode.right;
                    // 如果当前节点的右节点为 `null` ，就将新的节点插入这个位置，退出循环；否则执行下一次循环
                    if (currentNode === null) {
                        originNode.right = node;
                        break;
                    }
                }
            }
        }
    };
    // 中序遍历
    BST.prototype.inOrder = function (node) {
        if (node !== null) {
            this.inOrder(node.left);
            node.show();
            this.inOrder(node.right);
        }
    };
    // 先序遍历
    BST.prototype.preOrder = function (node) {
        if (node !== null) {
            node.show();
            this.preOrder(node.left);
            this.preOrder(node.right);
        }
    };
    // 后序遍历
    BST.prototype.postOrder = function (node) {
        if (node !== null) {
            this.postOrder(node.left);
            this.postOrder(node.right);
            node.show();
        }
    };
    // 最小值节点
    BST.prototype.min = function (node) {
        if (node === void 0) { node = this.root; }
        var currentNode = node;
        while (currentNode.left !== null) {
            currentNode = currentNode.left;
        }
        return currentNode;
    };
    // 最大值节点
    BST.prototype.max = function (node) {
        if (node === void 0) { node = this.root; }
        var currentNode = node;
        while (currentNode.right !== null) {
            currentNode = currentNode.right;
        }
        return currentNode;
    };
    // 查找节点
    BST.prototype.find = function (data) {
        var currentNode = this.root;
        while (currentNode !== null) {
            if (currentNode.data === data) {
                return currentNode;
            }
            else if (currentNode.data > data) {
                currentNode = currentNode.left;
            }
            else {
                currentNode = currentNode.right;
            }
        }
        return null;
    };
    // 删除节点
    BST.prototype.remove = function (data) {
        this.root = this.removeNode(this.root, data);
    };
    BST.prototype.removeNode = function (node, data) {
        if (node === null) {
            return null;
        }
        if (data === node.data) {
            // 没有子节点
            if (node.left === null && node.right === null) {
                return null;
            }
            // 没有左子节点
            if (node.left === null) {
                return node.right;
            }
            // 没有右子节点
            if (node.right === null) {
                return node.left;
            }
            // 有左右两个节点
            var tempNode = this.min(node.right);
            node.data = tempNode.data;
            node.right = this.removeNode(node.right, tempNode.data);
            return node;
        }
        else if (node.data > data) {
            node.left = this.removeNode(node.left, data);
            return node;
        }
        else {
            node.right = this.removeNode(node.right, data);
            return node;
        }
    };
    // 更新节点
    BST.prototype.update = function (data) {
        var node = this.find(data);
        node.data = data;
        node.count++;
        return node;
    };
    return BST;
}());
var random = function (num) { return Math.ceil(Math.random() * num); };
var bst = new BST();
for (var index = 0; index < 99; index++) {
    var num = random(99);
    if (bst.find(num)) {
        bst.update(num);
    }
    else {
        bst.insert(num);
    }
}
bst.inOrder(bst.root);
