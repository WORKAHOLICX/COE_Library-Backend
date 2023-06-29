const books = require('./RecommendedBooks.json')
let list = []
let i = 0

books.map((course)=> {
    if (i > 112) return
    list.push(course.courseName)
    i++
})
console.log(list);
