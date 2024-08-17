import { getUserId } from "../utils"

const Book = {
    writted_by: (parent, args, { /* db */ request, prisma }, info) => {
        const userId = getUserId(request)
        //return db.authors.find(author => author.id === parent.writted_by)
        return prisma.authors.findUnique({
            where: {
                id: parent.writted_by
            }
        })
        /* return prisma.books.findOne({
            where: {
                id: parent.id
            }
        }).authors() */
    },
    register_by: (parent, args, { request, prisma }, info) => {
        /* return db.users.find(user => user.id === parent.register_by) */
        const userId = getUserId(request)
        return prisma.users.findUnique({
            where: {
                id: parent.register_by
            }
        })
        /* return prisma.books.findOne({
            where: {
                id: parent.id
            }
        }).users() */
    }
}

export default Book