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
    user: (parent, { id }, ctx, info) => { 
        const { db } = ctx

        if(!id){ //Si no recibo un id
            return db.users //Regreso todos
        } 

        return db.users.filter((user) => user.id === id)
    },
    author: (parent, { id }, { db }, info) => {
        if(!id) {
            return db.authors
        }

        return db.authors.filter(author => author.id === id) 
    },
    book: (parent, { id }, { db }, info) => {
        if(!id) {
            return db.books
        }

        return db.books.filter(book => book.id === id)
    }
}

export default Query