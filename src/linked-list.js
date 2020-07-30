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
        // console.log('insertLast', item)
        if (this.head === null) {
            this.insertFirst(item);
        }
        else {
            let tempNode = this.head;
            while (tempNode.next !== null) {
                tempNode = tempNode.next;
            }
            let newNode = new _Node(item, null)
            tempNode.next = newNode
            tempNode.value.next = newNode.value.id
        }
    }

    makeEnd(item) {
        // console.log('insertLast', item)
        if (this.head === null) {
            this.insertFirst(item);
        }
        else {
            let tempNode = this.head;
            while (tempNode.next !== null) {
                tempNode = tempNode.next;
            }
            let newNode = new _Node(item, null)
        }
    }

    insertBefore(item, value) {
        // console.log('value type', typeof value)
        // console.log('value in insertBefore', value)
        let newNode = new _Node(item, null);
        if (this.head.value.id === value|| this.head === null) {
            this.insertFirst(item)
        }
        else {
            let tempNode = this.head;
            while (tempNode.next.value.id !== value) {
                tempNode = tempNode.next
            }
            newNode.next = tempNode.next;
            // newNode.value.next = tempNode.id
            tempNode.next = newNode;
            // tempNode.value.next = newNode.id
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

    // insertAt(item, position) {
    //     // console.log()
    //     if (this.head === null || position === 1) {
    //         this.insertFirst(item)
    //     }
    //     else {
    //         let currentNode = this.head
    //         for (let i = 1; i < position; i++) {
    //             if(currentNode.next === null) {
    //                 this.insertLast(item)
    //                 item.value.next = null
    //             }
    //             currentNode = currentNode.next
    //         }
    //         this.insertBefore(item, currentNode.value)
    //     }
    // }
    insertAt(item, index) {
        let currentNode = this.head;
        let previousNode = null;

        for(let i = 0; i < index; i++) {
            if(currentNode === null) {
                console.log('Invalid index');
                return;
            }

            previousNode = currentNode;
            currentNode = currentNode.next;
        }

        previousNode.next = new _Node(item, currentNode);
        previousNode.value.next = currentNode.id
        currentNode.value.next = currentNode.next.value.id
        
    }


    findPrevious(item) {
        let currentNode = this.head;
        let previousNode = null;

        while((currentNode !== null) && (currentNode.value.id !== item)) {
            previousNode = currentNode;
            currentNode = currentNode.next;
        }

        if(currentNode === null) {
             console.log('Target not found.');
             return null;
        }

        return previousNode;
    }

    find(item) {
        // Start at the head
        let currNode = this.head;
        // If the list is empty
        if (!this.head) {
            return null;
        }
        // Check for the item 
        while (currNode.value.id !== item) {
            /* Return null if it's the end of the list 
               and the item is not on the list */
            if (currNode.next === null) {
                return false;
            }
            else {
                // Otherwise, keep looking 
                currNode = currNode.next;
            }
        }
        // Found it
        return true;
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

// let findPrevious = (list, item) => {

//     if (isEmpty(list)) {
//         return ('List is empty')
//     }

//     if (list.head.value === item) {
//         return (`No value before ${item}`)
//     }

//     let currentNode = list.head
//     let prevNode = null
//     while (currentNode.value !== item) {
//         prevNode = currentNode
//         currentNode = currentNode.next
//     }
//     return prevNode.value
// };

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