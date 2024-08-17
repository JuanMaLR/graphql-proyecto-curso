import { getUserId } from "../utils"

const Subscription = {
    count: {
        subscribe: (parent, args, { request, pubsub }, info) => {
            const userId = getUserId(request)
            let count = 0

            setInterval(() => {
                count++
                pubsub.publish('count', { count })
            }, 1000)

            return pubsub.asyncIterator('count')
        }
    },
    author: {
        subscribe: (parent, args, { request, pubsub }, info) => {
            const userId = getUserId(request)
            return pubsub.asyncIterator('author') //Creo una suscripción a el pool/canal de author
            //Cada vez que alguien haga una mutación a author, los que se hayan suscrito
            //a este subscriber, van a recibir la información nueva de la mutación
        }
    },
    book: {
        subscribe: (parent, { authorId }, { request, pubsub }, info) => {
            const userId = getUserId(request)
            return pubsub.asyncIterator(`book - ${authorId}`)
        }
    }
}

export default Subscription