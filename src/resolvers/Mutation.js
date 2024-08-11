import { generateToken, hashPassword } from '../utils'

const Mutation = {
    signUp: async (parent, { data }, { /* db */ prisma }, info) => {
        /* const isEmailTaken = db.users.some(user => user.email === data.email)

        if(isEmailTaken) {
            throw new Error('Email Taken')
        }

        const user = {
            id: uuidv4(),
            ...data
        }

        db.users.push(user)

        return user */
        /* return prisma.users.create({
            data
        }) */
        const password = hashPassword(data.password)

        const user = await prisma.users.create({
            data: {
                ...data,
                password
            }
        })

        return {
            user,
            token: generateToken(user.id)
        }
    },
    updateUser: (parent, { id, data }, { prisma }, info) => {
        /* const userExist = db.users.find(user => user.id === id)

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

        return { ...userExist, ...data } */

        return prisma.users.update({
            where: {
                id: Number(id)
            },
            data
        })
    },
    createAuthor: async (parent, { data }, { /* db, */ pubsub, prisma }, info) => {
        /* const author = {
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

        return author */
        const { register_by, ...rest } = data

        const newAuthor = await prisma.authors.create({
            data: {
                ...rest,
                users: {
                    connect: {
                        id: Number(register_by)
                    }
                }
            }
        })

        pubsub.publish('author', { author: {
            mutation: 'CREATED',
            data: newAuthor
        } })

       return newAuthor
    },
    updateAuthor: async (parent, { id, data }, { prisma, pubsub }, info) => {
        /* const authorExist = db.authors.find(author => author.id === id)

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

        return authorUpdated */
        const { register_by, ...rest } = data

        if (register_by) {
            rest.users = {
                connect: {
                    id: Number(register_by)
                }
            }
        }

        const authorUpdated = await prisma.authors.update({
            where: {
                id: Number(id)
            },
            data: {
                ...rest
            }
        })

        pubsub.publish('author', { author: {
            mutation: 'UPDATED',
            data: authorUpdated
        } })

        return authorUpdated 
    },
    createBook: async (parent, { data }, { prisma, pubsub }, info) => {
       /*  const isAuthorExist = db.authors.some(author => author.id === data.writted_by)
        
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

        return book */

        const { register_by, writted_by, ...rest } = data

        const newBook = await prisma.books.create({
            data: {
                ...rest,
                users: {
                    connect: {
                        id: Number(register_by)
                    }
                }, 
                authors: {
                    connect: {
                        id: Number(writted_by)
                    }
                }
            }
        })

        pubsub.publish(`book - ${newBook.writted_by}`, {
            book: {
                mutation: "CREATED",
                data: newBook
            }
        })

        return newBook
    },
    updateBook: async (parent, { id, data }, { prisma, pubsub }, info) => {
        /* const bookExist = db.books.find(book => book.id === id)

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

        return bookUpdated */

        const { register_by, writted_by, ...rest } = data

        if(register_by) {
            rest.users = {
                connect: {
                    id: Number(register_by)
                }
            }
        }

        if(writted_by) {
            rest.authors = {
                connect: {
                    id: Number(writted_by)
                }
            }
        }

        const bookUpdated = await prisma.books.update({
            where: {
                id: Number(id)
            },
            data: {
                ...rest
            }
        })

        pubsub.publish(`book - ${bookUpdated.writted_by}`, {
            book: {
                mutation: 'UPDATED',
                data: bookUpdated
            }
        })

        return bookUpdated
    },
    deleteBook: async (parent, { id }, { prisma, pubsub }, info) => {
        /* const bookExist = db.books.find(book => book.id === id)

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

        return bookExist */

        const bookDeleted = await prisma.books.delete({
            where: {
                id: Number(id)
            }
        })

        pubsub.publish(`book - ${bookDeleted.writted_by}`, {
            book: {
                mutation: 'DELETED',
                data: bookDeleted
            }
        })

        return bookDeleted
    }
}

export default Mutation