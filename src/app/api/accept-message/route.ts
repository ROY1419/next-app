import dbConnect from "@/lib/bdConnect";
import UserModel from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../sign-up/auth/[...nextauth]/options";



export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authenticated'
            }),
            { status: 400 }
        );
    }
    const userId = user._id;
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );
        if (!updatedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Unable to find user to update message acceptance status'
                }),
                { status: 404 }
            );
        }
        return new Response(
            JSON.stringify({
                success: true,
                message: 'Message acceptance status updated successfully',
                updatedUser
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating message acceptance status:', error);
        return new Response(
            JSON.stringify(
                {
                    success: false,
                    message: "Error updating message acceptance status'"
                }),
            {
                status: 500
            }
        )
    }

}

export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user = session?.user as User
    if (!session || session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authenticated'
            }),
            { status: 400 }
        );
    }
    try {
        const foundUser = await UserModel.findById(user._id);
        if (!foundUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'User not found'
                }),
                { status: 404 }
            );
        }
        return new Response(
            JSON.stringify({
                success: true,
                isAcceptingMessages : foundUser.isAcceptingMessages
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return new Response(
            JSON.stringify(
                {
                    success: false,
                    message: 'Error retrieving message acceptance status'
                }),
            {
                status: 500
            }
        )
    }

}