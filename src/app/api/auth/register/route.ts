import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, accountType } = body;

        // 1. Required fields
        if (!name || !email || !password || !accountType) {
            return NextResponse.json(
                { error: "name, email, password, accountType required" },
                { status: 400 }
            );
        }

        // 2. accountType must be DONOR or NGO
        if (!["DONOR", "NGO"].includes(accountType)) {
            return NextResponse.json(
                { error: "accountType must be DONOR or NGO" },
                { status: 400 }
            );
        }

        // 3. Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER",
                accountType: accountType,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                accountType: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            { message: "User registered", user },
            { status: 201 }
        );
    } catch (err) {
        console.error("Register error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
