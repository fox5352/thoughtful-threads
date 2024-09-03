import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { deleteUserByID, getAllUsers, getUserById } from "@/model/user.model";


export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({message: "user unauthorized"}, {status: 401, statusText: "user unauthorized"});
    }
    
    const user = await getUserById(Number(session.user.id));

    if (!user) {
        return NextResponse.json({message: "failed to get user"}, {status: 401, statusText: "user not found"});
    }

    if (user.role !== "admin") {
        return NextResponse.json({message: "user is not admin"}, {status: 401, statusText: "user is not admin"});
    }

    const allUsers = await getAllUsers();

    if (!allUsers) {
        return NextResponse.json({message: "users not found"}, {status: 401, statusText: "users not found"});
    }

    return NextResponse.json({message: "success", body: allUsers});
}

export async function UPDATE(req: NextRequest) {
    const { id, role } = await req.json();
    
    type RoleTypes = "user"| "admin";
    
    function isRoleType(value: string): value is RoleTypes {
        return value === "user" || value === "admin";
    }

    if (!id || !role || isRoleType(role)) {
        return NextResponse.json({message: "invalid data"}, {status: 418});
    }

    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json({message: "user unauthorized"}, {status: 401, statusText: "user unauthorized"});
    }

    const user = await getUserById(Number(session.user.id));

    if (!user) {
        return NextResponse.json({message: "failed to get user"}, {status:401, statusText: "user not found"});
    }

    if (user.role!== "admin") {
        return NextResponse.json({message: "user is not admin"}, {status: 401, statusText: "user is not admin"});
    }

}

export async function DELETE(req: NextRequest) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({message: "invalid request id missing"}, {status: 400, statusText: "invalid request"});
    }

    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.json({message: "user unauthorized"}, {status: 401, statusText: "user unauthorized"});
    }

    const user = await getUserById(Number(session.user.id));
    
    if (!user) {
        return NextResponse.json({message: "failed to get user"}, {status: 401, statusText: "user not found"});
    }

    if (user.role!== "admin") {
        return NextResponse.json({message: "user is not admin"}, {status: 401, statusText: "user is not admin"});
    }

    const deletedUser = await deleteUserByID(id);

    if (!deletedUser) {
        return NextResponse.json({message: "failed to delete user"}, {status: 500, statusText: "failed to delete user"});
    }

    return NextResponse.json({message: "successfully removed user"}, {status: 200, statusText: "success"});
}