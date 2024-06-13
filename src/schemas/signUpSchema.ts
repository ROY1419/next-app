import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(6, "username must be atleast 2 charcters")
    .max(20, "username must be no more then 20 charcters")
    .regex(/^[a-zA-Z0-9_]+$/,'Username must not contain special characters')

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid email Address' }),
    password: z.string().min(8, { message: "password must be at least 8 chracters" })
})