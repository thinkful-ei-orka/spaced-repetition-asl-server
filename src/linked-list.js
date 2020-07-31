class _Node {
    constructor(value, next) {
        this.value = value
        this.next = next
    }
}

class LinkedList {
    constructor() {
        this.head = null
    }

    insertFirst(item) {
        this.head = new _Node(item, this.head)
    }

    insertLast(item) {
        if (this.head === null) {
            this.insertFirst(item)
        }
        else {
            let tempNode = this.head
            while (tempNode.next !== null) {
                tempNode = tempNode.next
            }
            let newNode = new _Node(item, null)
            tempNode.next = newNode
            tempNode.value.next = newNode.value.id
        }
    }

    makeEnd(item) {
        if (this.head === null) {
            this.insertFirst(item)
        }
        else {
            let tempNode = this.head
            while (tempNode.next !== null) {
                tempNode = tempNode.next
            }
            tempNode.next = new _Node(item, null)
        }
    }

    insertAt(item, index) {
        let currentNode = this.head
        let previousNode = null

        for(let i = 0; i < index; i++) {
            if(currentNode === null) {
                console.log('Invalid index')
                return
            }

            previousNode = currentNode
            currentNode = currentNode.next
        }
        //set newNode as var to use values in it
        let newNode = new _Node(item, currentNode)
        previousNode.next = newNode
        previousNode.value.next = newNode.value.id
        newNode.value.next = currentNode.value.id
    }

    findPrevious(item) {
        let currentNode = this.head
        let previousNode = null

        while((currentNode !== null) && (currentNode.value.id !== item)) {
            previousNode = currentNode
            currentNode = currentNode.next
        }

        if(currentNode === null) {
            console.log('Target not found.')
            return null
        }

        return previousNode
    }

    size() {
        if(!this.head){
            return 0
        }

        let currentNode = this.head
        let size = 0

        while(currentNode !== null) {
            size++
            currentNode = currentNode.next
        }

        return size
    }
}

module.exports = LinkedList