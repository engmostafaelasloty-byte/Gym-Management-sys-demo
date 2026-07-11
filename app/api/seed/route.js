import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(
        { success: false, error: 'Seeding route is disabled for security reasons.' },
        { status: 403 }
    );
}
