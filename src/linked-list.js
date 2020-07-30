class _Node {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    insertFirst(item) {
        this.head = new _Node(item, this.head);
    }

    insertLast(item) {
        if (this.head === null) {
            this.insertFirst(item);
        }
        else {
            let tempNode = this.head;
            while (tempNode.next !== null) {
                tempNode = tempNode.next;
            }
            tempNode.next = new _Node(item, null);
        }
    }

    insertBefore(item, value) {
        let newNode = new _Node(item, null);
        if (this.head.value === value || this.head === null) {
            this.insertFirst(item)
        }
        else {
            let tempNode = this.head;
            while (tempNode.next.value !== value) {
                tempNode = tempNode.next
            }
            newNode.next = tempNode.next;
            tempNode.next = newNode;
        }
    }

    insertAfter(item, value) {
        if (this.head === null) {
            this.insertFirst(item)
        }
        else {
            let tempNode = this.head;
            while (tempNode.value !== value) {
                tempNode = tempNode.next
            }
            let newNode = new _Node(item, tempNode.next);
            tempNode.next = newNode;
        }
    }

    insertAt(item, position) {
        if (this.head === null || position === 1) {
            this.insertFirst(item)
        }
        else {
            let currentNode = this.head
            for (let i = 1; i < position; i++) {
                if(currentNode.next === null) {
                    this.insertLast(item)
                }
                currentNode = currentNode.next
            }
            this.insertBefore(item, currentNode.value)
        }
    }

    find(item) {
        // Start at the head
        let currNode = this.head;
        // If the list is empty
        if (!this.head) {
            return null;
        }
        // Check for the item 
        while (currNode.value !== item) {
            /* Return null if it's the end of the list 
               and the item is not on the list */
            if (currNode.next === null) {
                return null;
            }
            else {
                // Otherwise, keep looking 
                currNode = currNode.next;
            }
        }
        // Found it
        return currNode;
    }

    remove(item){ 
        // If the list is empty
        if (!this.head) {
            return null;
        }
        // If the node to be removed is head, make the next node head
        if (this.head.value === item) {
            this.head = this.head.next;
            return;
        }
        // Start at the head
        let currNode = this.head;
        // Keep track of previous
        let previousNode = this.head;

        while ((currNode !== null) && (currNode.value !== item)) {
            // Save the previous node 
            previousNode = currNode;
            currNode = currNode.next;
        }
        if (currNode === null) {
            console.log('Item not found');
            return;
        }
        previousNode.next = currNode.next;
    }
}

let display = (list) => {
    let currentNode = list.head;
    while (currentNode !== null) {
        console.log(currentNode);
        currentNode = currentNode.next
    }
};

let size = (list) => {
    let count = 0;
    let currentNode = list.head;
    while (currentNode !== null) {
        count += 1
        currentNode = currentNode.next
    }
    return count
};

let isEmpty = (list) => {
    
    if (list.head === null) return true
    else return false
    
};

let findPrevious = (list, item) => {

    if (isEmpty(list)) {
        return ('List is empty')
    }

    if (list.head.value === item) {
        return (`No value before ${item}`)
    }

    let currentNode = list.head
    let prevNode = null
    while (currentNode.value !== item) {
        prevNode = currentNode
        currentNode = currentNode.next
    }
    return prevNode.value
};

let findLast = (list) => {
    if (isEmpty(list)) {
        return ('List is empty')
    }

    if (list.head.next === null) {
        return list.head
    }

    let currentNode = list.head
    while (currentNode.next !== null) {
        currentNode = currentNode.next
    }

    return currentNode.value
};

// export default {display, size, isEmpty, findPrevious, findLast}


module.exports = LinkedList