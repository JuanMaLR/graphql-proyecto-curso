const Author = {
    register_by: (parent, args, { /* db */ prisma }, info) => {
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
    books: (parent, args, { prisma }, info) => {
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