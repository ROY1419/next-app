import dbConnect from "@/lib/bdConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user;
    if (!session || session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authenticated'
            }),
            { status: 400 }
        );
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            // match with uaerID
            { $match: { _id: userId } }, 
            // unwind is use for messages
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }

        ])
        if (!user || user.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'User not found'
                }),
                { status: 400 }
            );
        }
        return new Response(
            JSON.stringify({
                success: true,
                messages: user[0].messages
                
            }),
            { status: 200 }
        );


    } catch (error) {

    }

}