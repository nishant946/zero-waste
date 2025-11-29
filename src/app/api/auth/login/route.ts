import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "email and password required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
                accountType: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Create token payload (non-sensitive)
        const payload = {
            sub: user.id,
            role: user.role,
            accountType: user.accountType,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

        // Remove hashed password before returning user
        const { password: _pwd, ...userSafe } = user;

        return NextResponse.json({ message: "Login successful", token, user: userSafe }, { status: 200 });
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
