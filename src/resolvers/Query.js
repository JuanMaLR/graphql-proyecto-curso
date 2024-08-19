import { getUserId } from "../utils"

//Resolvers de tipo query
const Query = {
    //Resolvers reciben 4 parámetros
    //parent, arguments, context, information
    //parent, args, ctx, info
    //Queries root no tienen parent
    //Contexto permite guardar información global que luego puede ser accedida desde 
    //cualquier resolver
    //Info es metadata, es decir, te va a decir qué estas ejecutando (query, mutation, etc)
    //Tipo (query, mutation, etc), nombre de la query, etc
    //hello: () => "Hola Mundo",
    hello: (parent, args, ctx, info) => {
        const { name } = args

        return `Hello ${name || 'world'}`
    },
    quantity: () => 1,
    //getUser: () => ({name: "Josh", lastName: "Ospina"}),
    user: (parent, { id }, { request, prisma }, info) => { 
        //const { db } = ctx

        const userId = getUserId(request)

        if(!id){ //Si no recibo un id
            //return db.users //Regreso todos
            return prisma.users.findMany()
        } 

        //return db.users.filter((user) => user.id === id)
        return prisma.users.findOne({
            where: {
                id
            }
        })
    },
    author: (parent, { id, quantity, skip, orderBy }, { request, prisma }, info) => {
        const userId = getUserId(request)

        if(!id) {
            //return db.authors
            return prisma.authors.findMany({
                take: quantity,
                skip,
                orderBy
            })
        }

        //return db.authors.filter(author => author.id === id) 
        return prisma.authors.findOne({
            where: {
                id
            }
        })
    },
    book: (parent, { id, quantity, skip, orderBy }, { /* db */ request, prisma }, info) => {
        const userId = getUserId(request)

        if(!id) {
            //return db.books
            return prisma.books.findMany({
                take: quantity,
                skip,
                orderBy
            })
        }

        //return db.books.filter(book => book.id === id)
        return prisma.books.findOne({
            where: {
                id
            }
        })
    }
}

export default Query