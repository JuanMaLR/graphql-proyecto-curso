import { v4 as uuidv4 } from 'uuid'

const Mutation = {
    createUser: (parent, { data }, { db }, info) => {
        const isEmailTaken = db.users.some(user => user.email === data.email)

        if(isEmailTaken) {
            throw new Error('Email Taken')
        }

        const user = {
            id: uuidv4(),
            ...data
        }

        db.users.push(user)

        return user
    },
    updateUser: (parent, { id, data }, { db }, info) => {
        const userExist = db.users.find(user => user.id === id)

        if (!userExist) {
            throw new Error('User not found')
        }

        const isEmailTaken = db.users.some(user => user.email === data.email)

        if(isEmailTaken) {
            throw new Error('Email Taken')
        }

        db.users = db.users.map(user => {
            if(user.id === id) {
                return { 
                    ...user,
                    ...data
                }
            }
            return user
        })

        return { ...userExist, ...data }
    },
    createAuthor: (parent, { data }, { db, pubsub }, info) => {
        const author = {
            id: uuidv4(),
            ...data
        }

        db.authors.push(author)

        //Publico al canal de author para que los suscritos puedan recibir la información
        //Recibe dos parámetros, el canal y el payload 
        pubsub.publish('author', { author: {
            mutation: 'CREATED',
            data: author
        } })

        return author
    },
    updateAuthor: (parent, { id, data }, { db, pubsub }, info) => {
        const authorExist = db.authors.find(author => author.id === id)

        if(!authorExist) {
            throw new Error("Author doesn't exist")
        }

        db.authors = db.authors.map(author => {
            if(author.id === id) {
                return { ...author, ...data }
            }
            return author
        })

        const authorUpdated = { ...authorExist, ...data }

        pubsub.publish('author', { author: {
            mutation: 'UPDATED',
            data: authorUpdated
        } })

        return authorUpdated
    },
    createBook: (parent, { data }, { db, pubsub }, info) => {
        const isAuthorExist = db.authors.some(author => author.id === data.writted_by)
        
        if(!isAuthorExist) {
            throw new Error("Author doesn't exist")
        }

        const book = {
            id: uuidv4(),
            ...data
        }

        db.books.push(book)

        pubsub.publish(`book - ${data.writted_by}`, {
            book: {
                mutation: "CREATED",
                data: book
            }
        })

        return book
    },
    updateBook: (parent, { id, data }, { db, pubsub }, info) => {
        const bookExist = db.books.find(book => book.id === id)

        if(!bookExist) {
            throw new Error("Book doesn't exist")
        }

        const authorExist = db.authors.some(author => author.id === data.writted_by)

        if(data.writted_by && !authorExist) {
            throw new Error("Author doesn't exist")
        }

        db.books = db.books.map(book => {
            if(book.id === id) {
                return { ...book, ...data }
            }

            return book
        })

        const bookUpdated = { ...bookExist, ...data }

        pubsub.publish(`book - ${bookUpdated.writted_by}`, {
            book: {
                mutation: 'UPDATED',
                data: bookUpdated
            }
        })

        return bookUpdated
    },
    deleteBook: (parent, { id }, { db, pubsub }, info) => {
        const bookExist = db.books.find(book => book.id === id)

        if(!bookExist) {
            throw new Error("Book doesn't exist")
        }

        db.books = db.books.reduce((accum, book) => {
            if(book.id !== id) {
                accum.push(book)
            }
            return accum
        }, [])

        pubsub.publish(`book - ${bookExist.writted_by}`, {
            book: {
                mutation: 'DELETED',
                data: bookExist
            }
        })

        return bookExist
    }
}

export default Mutation