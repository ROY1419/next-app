
import dbConnect from "@/lib/bdConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

// query Schema for check any query 


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    // console.log(`Received request with method: ${request.method}`);

    // if (request.method !== 'GET') {
    //     return new Response(
    //         JSON.stringify({
    //             success: false,
    //             message: 'Method not Allowed'
    //         }),
    //         { status: 400 }
    //     );
    // }
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username'),
        };
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams);
        console.log(result);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return new Response(
                JSON.stringify({
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(',') : 'Invalid query parameters',
                }),
                { status: 400 }
            );
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Username is already taken'
                }),
                { status: 400 }
            );
        }
        return new Response(
            JSON.stringify({
                success: true,
                message: 'Username is unique'
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error checking username", error);
        return new Response(
            JSON.stringify(
                {
                    success: false,
                    message: "Error checking username "
                }),
            {
                status: 500
            }
        )

    }
}

