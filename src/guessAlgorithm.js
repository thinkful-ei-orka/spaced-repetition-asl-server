const express = require('express')
const LinkedList = require('./linked-list')
const LanguageService = require('./language/language-service')
const wordList = new LinkedList

let display = (list) => {
    console.log('list is as follows:')
    let currentNode = list.head;
    while (currentNode !== null) {
        console.log(currentNode);
        currentNode = currentNode.next
    }
};

// wordList.insertLast({
//     id: 1, 
//     memory_value: 1, 
//     original: 'https://thinkful-ei-orka.github.io/sp-asl-pics/1.jpg', 
//     translation: 'again',
// })

// wordList.insertLast({
//     id: 2, 
//     memory_value: 1, 
//     original: 'https://thinkful-ei-orka.github.io/sp-asl-pics/2.jpg',
//     translation: 'good',
// })

// wordList.insertLast({
//     id: 3, 
//     memory_value: 1, 
//     original: 'https://thinkful-ei-orka.github.io/sp-asl-pics/3.jpg',
//     translation: 'hello',
// })

// wordList.insertLast({
//     id: 4, 
//     memory_value: 1, 
//     original: 'https://thinkful-ei-orka.github.io/sp-asl-pics/4.jpg',
//     translation: 'I don\' understand',
// })

// wordList.insertLast({
//     id: 5, 
//     memory_value: 1, 
//     original: 'https://thinkful-ei-orka.github.io/sp-asl-pics/5.jpg',
//     translation: 'I\'m sorry',
// })


// wordList.insertLast({
//     id: 6, 
//     memory_value: 1, 
//     original: 'https://thinkful-ei-orka.github.io/sp-asl-pics/6.jpg', 
//     translation: 'no',
// })

// wordList.insertLast({
//     id: 7, 
//     memory_value: 1, 
//     original: 'https://thinkful-ei-orka.github.io/sp-asl-pics/7.jpg', 
//     translation: 'please',
// })

// wordList.insertLast({
//     id: 8, 
//     memory_value: 1, 
//     original: 'https://thinkful-ei-orka.github.io/sp-asl-pics/8.jpg', 
//     translation: 'see you late',
// })

// wordList.insertLast({
//     id: 9, 
//     memory_value: 1, 
//     original: 'https://thinkful-ei-orka.github.io/sp-asl-pics/9.jpg', 
//     translation: 'thank you',
// })

// wordList.insertLast({
//     id: 10, 
//     memory_value: 1, 
//     original: 'https://thinkful-ei-orka.github.io/sp-asl-pics/10.jpg', 
//     translation: 'yes',
// })

// display(wordList);


function learnWorder(list, numOfGuesses) {

    for (let i = 0; i < numOfGuesses; i++){
        console.log('guess no.',i)
        let isCorrect = true
        let chance = Math.floor(Math.random() * 2)
        console.log('chance', chance)
        if(chance === 1) {
            isCorrect = true
            console.log('should be true', isCorrect)
        } else {
            isCorrect = false;
            console.log('should be false', isCorrect)
        }
        
        let tempNode = list.head
        console.log('first/head word:', tempNode)
        console.log('type of memory value', typeof tempNode.value.memory_value)
        if (isCorrect) {
            tempNode.value.memory_value = parseInt(tempNode.value.memory_value) * 2
            console.log('guess corect, memory value now:', tempNode.value.memory_value)
        }
        else {
            tempNode.value.memory_value = 1
            console.log('memory value should be 1', tempNode.value.memory_value)
        }
        list.head = list.head.next
        if (parseInt(tempNode.value.memory_value) > list.size) {
            list.insertLast(tempNode.value)
        }
        else if (tempNode.value.memory_value > 1){
            list.insertAt(tempNode.value, parseInt(tempNode.value.memory_value))
        }
        else {
            list.insertAt(tempNode.value, 2)
        }

        console.log('first word now:', list.head)
    }
}

// learnWorder(wordList, 5)
// display(wordList)

LanguageService.getLinkedList()
wordGuesser = (list, guess) => {
        console.log('guess', guess)
        console.log('type of', typeof guess)
        let isCorrect = true
        let tempNode = list.head
        if(tempNode.value.translation.toLowerCase() === guess.toLowerCase()) {
            isCorrect = true
            tempNode.value.correct_count = tempNode.value.correct_count + 1
            tempNode.value.memory_value = parseInt(tempNode.value.memory_value) * 2
            console.log('should be true', isCorrect)
        } else {
            isCorrect = false;
            tempNode.value.incorrect_count = tempNode.value.incorrect_count + 1
            tempNode.value.memory_value = 1
            console.log('should be false', isCorrect)
        }
     
        list.head = list.head.next
        if (parseInt(tempNode.value.memory_value) > list.size) {
            list.insertLast(tempNode.value)
        }
        else if (tempNode.value.memory_value > 1){
            list.insertAt(tempNode.value, parseInt(tempNode.value.memory_value))
        }
        else {
            list.insertAt(tempNode.value, 2)
        }

        console.log('first word now:', list.head)

        let previous = list.findPrevious(list, tempNode.value)

        let returnNode = {
            isCorrect: this.isCorrect,
            word: { ...tempNode.value },
            previousId: previous.id,
            list: list
        }
}

// export default wordGuesser 