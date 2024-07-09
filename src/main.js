//Permite crear y levantar el servidor de manera rápida 
import { GraphQLServer } from 'graphql-yoga'
import Query from './resolvers/Query'
import db from './db'

//Schema definition directly on JS file
//! es para que a fuerzas regrese un valor (es decir, algo no nulo)
/*const typeDefs = `
    type Query {
        hello: String! 
    }
`*/

//Funciones a ejecutar cada vez que se ejecute una query
/*const resolvers = {
    Query: {
        hello: () => 'Hello world'
    }
}*/
const resolvers = {
    Query
}

//Para no tener que hacer un import en cada resolver hay que agregar la BD al contexto
const context = { db }

//Asociar schemas y resolvers con el servidor
//Puedo poner typeDefs: typeDefs o sólo poner typeDefs una vez gracias a ES6
//Si voy a usar una definición de schema en un archivo aparte se debe escribir como
//typeDefs: './src/schema.graphql'
//Aquí se agrega el contexto 
const server = new GraphQLServer({typeDefs: './src/schema.graphql', resolvers, context})

//Se levanta el servidor y se queda escuchando las peticiones 
server.start(() => console.log("Server is running on localhost:4000")) //Port 4000 by default