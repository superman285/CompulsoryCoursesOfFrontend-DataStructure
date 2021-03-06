'use strict'
import DoublyLinkedListNode from "./DoublyLinkedListNode";
import Comparator from "../utils/Comparator";

/**
 在计算机科学中, 一个 双向链表(doubly linked list) 是由一组称为节点的顺序链接记录组成的链接数据结构。
 每个节点包含两个字段，称为链接，它们是对节点序列中上一个节点和下一个节点的引用。
 开始节点和结束节点的上一个链接和下一个链接分别指向某种终止节点，通常是前哨节点或null，以方便遍历列表。
 如果只有一个前哨节点，则列表通过前哨节点循环链接。它可以被概念化为两个由相同数据项组成的单链表，但顺序相反。

 两个节点链接允许在任一方向上遍历列表。

 在双向链表中进行添加或者删除节点时,需做的链接更改要比单向链表复杂得多。
 这种操作在单向链表中更简单高效,因为不需要关注一个节点（除第一个和最后一个节点以外的节点）的两个链接,而只需要关注一个链接即可。
 */
export default class DoublyLinkedList<T> {
    public head: DoublyLinkedListNode<T>;
    public tail: DoublyLinkedListNode<T>;
    private compare: Comparator;
    constructor(compareFunction?: Function) {
        this.head = null;
        this.tail = null;
        this.compare = new Comparator(compareFunction);
    }

    /**
     * 在链表头部插入新的结点
     * @param value
     * @return DoublyLinkedList
     */
    public prepend(value: T): DoublyLinkedList<T> {
        // 构造一个新的结点，其前驱结点指向null,后继结点指向this.head
        const newNode: DoublyLinkedListNode<T> = new DoublyLinkedListNode<T>(value,this.head);
        // 如果头结点存在，则将头结点的前驱指针指向newNode
        if(this.head) {
            this.head.previous = newNode;
        }
        // 将链表的头结点指向newNode
        this.head = newNode

        // 如果尾结点不存在，则说明这个链表在此之前是一个空链表，所以要将其尾结点指向此结点（newNode），此时整个链表只有这一个结点
        if(!this.tail) {
            this.tail = newNode
        }
        return this
    }

    /**
     * 在链表尾部插入新的结点
     * @param value
     * @return DoublyLinkedList<T>
     */
    public append(value: T): DoublyLinkedList<T> {
        // 构造一个新的结点，前驱指向this.tail,后继指向null
        const newNode: DoublyLinkedListNode<T> = new DoublyLinkedListNode<T>(value, null, this.tail);
        // 如果尾结点存在，则将其next指向newNode
        if (this.tail) {
            this.tail.next = newNode
        }

        // 将尾结点指向newNode
        this.tail = newNode

        //如果头结点 不存在，则说明之前是空链表
        if(!this.head) {
            this.head = newNode
        }
        return this
    }

    /**
     * 从链表中删除值为value的元素
     * @param value
     */
    public delete(value: T): DoublyLinkedListNode<T> {
        if(!this.head) {
            return null
        }
        let currentNode = this.head;
        let deletedNode = null;
        while(currentNode) {
            if(this.compare.equal(currentNode.value,value)) {
                deletedNode = currentNode;
                // 如果头结点要删除
                if(deletedNode === this.head) {
                    if(this.head === this.tail) {
                        this.head = null
                        this.tail = null
                    }
                    else {
                        this.head = currentNode.next;
                        this.head.previous = null;
                    }
                }
                // 尾结点需要删除
                else if (deletedNode === this.tail) {
                    if(deletedNode.previous) {
                        this.tail = deletedNode.previous;
                        this.tail.next = null;
                    } else {
                        this.tail = null;
                        this.head = null;
                    }
                }
                // 中间结点需要删除
                else {
                    const previousNode = deletedNode.previous
                    const nextNode = deletedNode.next;
                    previousNode.next = nextNode;
                    nextNode.previous = previousNode;
                }
            }
            currentNode = currentNode.next;
        }
        return deletedNode;
    }

    /**
     * 删除头结点
     */
    public deleteHead(): DoublyLinkedListNode<T> {
        if(!this.head) {
            return null;
        }
        const headNode = this.head
        if(this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = headNode.next;
            this.head.previous = null;
        }
        return headNode;
    }

    /**
     * 删除链表的尾结点
     */
    public deleteTail(): DoublyLinkedListNode<T> {
        if(!this.head) {
            return null;
        }
        const tailNode = this.tail
        if(this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = tailNode.previous;
            this.tail.next = null;
        }
    }

    /**
     * 从链表中查找元素
     * @param value
     * @param callback
     */
    public find(value: T,callback: Function): DoublyLinkedListNode<T> {
        if(!this.head) {
            return null;
        }
        if(value === undefined || value === null) {
            return null;
        }
        let currentNode: DoublyLinkedListNode<T> = this.head;
        while(currentNode) {
            if(callback && callback(currentNode.value,value)) {
                return currentNode;
            }
            if(value && currentNode.value === value) {
                return currentNode;
            }
            currentNode = currentNode.next;
        }
        return null;
    }

    /**
     * 将链表转化为数组
     */
    toArray(): Array<DoublyLinkedListNode<T>> {
        const nodeArray: Array<DoublyLinkedListNode<T>> = new Array<DoublyLinkedListNode<T>>();
        let currentNode = this.head;
        while(currentNode) {
            nodeArray.push(currentNode)
            currentNode = currentNode.next;
        }
        return nodeArray;
    }

    /**
     * 从数组中初始化链表
     * @param nodeArray
     */
    fromArray(nodeArray: Array<T>): DoublyLinkedList<T> {
        const doublyLinkedList: DoublyLinkedList<T> = new DoublyLinkedList<T>();
        nodeArray.forEach(item=> {
            doublyLinkedList.append(item);
        })
        return doublyLinkedList;
    }

    /**
     * toString 方法
     * @param callback
     */
    toString(callback: Function): string {
        return this.toArray().map(item=>{
            item.toString(callback)
        }).toString()
    }

    /**
     * 将双向链表转置
     */
    public reverse(): DoublyLinkedList<T> {
        let currentNode = this.head;
        let previousNode = null;
        let nextNode = null;

        // 对元素逐一进行处理
        while(currentNode) {
            // 两个临时元素记录previous 和 next 结点情况
            previousNode = currentNode.previous;
            nextNode = currentNode.next;

            // 将当前元素的前后元素进行交换
            currentNode.previous = nextNode;
            currentNode.next = previousNode;

            // 记录当前元素
            previousNode = currentNode;

            // 处理下一个元素
            currentNode = nextNode;
        }

        this.head = previousNode;
        this.tail = this.head;

        return this;
    }
}
