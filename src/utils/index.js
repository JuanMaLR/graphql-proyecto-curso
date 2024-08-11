import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const SECRET = 'edteam'

export const getUserId = () => {
    return 'Hello World'
}

export const hashPassword = password => {
    if(password.length < 6) {
        throw new Error('Password must be 6 characters or longer')
    }

    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

export const validatePassword = (requestPassword, password) => {
    return bcrypt.compareSync(requestPassword, password)
}

export const generateToken = (userId) => {
    return jwt.sign({ userId }, SECRET, { expiresIn: '2 days' })
}