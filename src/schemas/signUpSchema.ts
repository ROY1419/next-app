import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "username must be atleast 2 charcters")
    .max(20, "username must be no more then 20 charcters")
    .regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        "special charcter")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid email Address' }),
    password: z.string().min(5, { message: "password must be at least 6 chracters" })
})