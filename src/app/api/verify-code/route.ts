import dbConnect from "@/lib/bdConnect";
import UserModel from "@/models/User";



export async function GET(request: Request) {
    await dbConnect()
    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return new Response(
                JSON.stringify(
                    {
                        success: false,
                        message: "user not found "
                    }),
                {
                    status: 404
                }
            )
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if (isCodeValid && isCodeNotExpired) {
            user.isVerifed = true
            await user.save()
            return new Response(
                JSON.stringify(
                    {
                        success: true,
                        message: "Account verified successfully"
                    }),
                {
                    status: 200
                }
            )
        } else if (!isCodeNotExpired) {
            // Code has expired
            return new Response(
                JSON.stringify(
                    {
                        success: false,
                        message: "Verification code has expired. Please sign up again to get a new code.'"
                    }),
                {
                    status: 400
                }
            )
        } else {
            // Code is incorrect
            return new Response(
                JSON.stringify(
                    {
                        success: false,
                        message: "Incorrect verification code"
                    }),
                {
                    status: 400
                }
            )
        }
    } catch (error) {
        console.error("Error verify user", error);
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