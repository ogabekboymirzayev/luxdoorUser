import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, product } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminId = process.env.TELEGRAM_BOT_ADMIN_ID;

    if (!botToken || !adminId) {
      console.error('Missing Telegram bot token or admin ID');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const message = `Yangi so'rov:\nIsm: ${name || 'Noma\'lum'}\nTelefon: ${phone}\nMahsulot: ${product || 'Noma\'lum'}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    await axios.post(url, {
      chat_id: adminId,
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}