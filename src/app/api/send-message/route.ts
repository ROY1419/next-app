import dbConnect from "@/lib/bdConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne(username)
        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Not authenticated'
                }),
                { status: 404 }
            );
        }
        if (!user.isAcceptingMessages) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Not authenticated'
                }),
                { status: 403 }
            );
        }
        const newMessage = { content, createdAt: new Date() }
        user.message.push(newMessage as Message)
        await user.save()
        return new Response(
            JSON.stringify({
                success: true,
                message: 'Message sent successfully'
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error adding message:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Internal server error'
            }),
            { status: 500 }
        );
    }

}