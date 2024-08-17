import { getUserId } from "../utils"

const Author = {
    register_by: (parent, args, { /* db */ request, prisma }, info) => {
        const userId = getUserId(request)
        //return db.users.find(user => user.id === parent.register_by)
        return prisma.users.findUnique({
            where: {
                id: parent.register_by
            }
        })
        /* return prisma.authors.findOne({
            where: {
                id: parent.id
            }
        }).users() */
    },
    books: (parent, args, { request, prisma }, info) => {
        const userId = getUserId(request)
        //return db.books.filter(book => book.writted_by === parent.id)
        return prisma.books.findMany({
            where: {
                writted_by: parent.id
            }
        })
        /* return prisma.authors.findOne({
            where: {
                id: parent.id
            }
        }).books() */
    }
}

export default Author