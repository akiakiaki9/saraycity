import { NextResponse } from "next/server";

function cleanText(value) {
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().replace(/\s+/g, " ");
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid reservation details." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? cleanText(payload.name) : "";
  const phone = typeof payload.phone === "string" ? cleanText(payload.phone) : "";
  const date = typeof payload.date === "string" ? payload.date : "";
  const time = typeof payload.time === "string" ? payload.time : "";
  const guests = Number(payload.guests);
  const note = typeof payload.note === "string" ? cleanText(payload.note) : "";
  const phoneDigits = phone.replace(/\D/g, "");
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
  }).format(new Date());

  if (
    !name ||
    name.length > 80 ||
    phone.length > 30 ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15 ||
    !isValidDate(date) ||
    date < today ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
    !Number.isInteger(guests) ||
    guests < 1 ||
    guests > 100 ||
    note.length > 500
  ) {
    return NextResponse.json({ error: "Please check the reservation details." }, { status: 400 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!botToken || !adminChatId) {
    console.error("Telegram reservation delivery is not configured.");
    return NextResponse.json(
      { error: "Reservation service is not configured." },
      { status: 503 },
    );
  }

  const message = [
    "New Saray City table reservation",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Date: ${date}`,
    `Time: ${time}`,
    `Guests: ${guests}`,
    ...(note ? [`Note: ${note}`] : []),
  ].join("\n");

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: adminChatId, text: message }),
        signal: AbortSignal.timeout(8000),
      },
    );
    const result = await telegramResponse.json();
    if (!telegramResponse.ok || !result.ok) {
      console.error("Telegram rejected a Saray City reservation.", {
        status: telegramResponse.status,
        description: result.description,
      });
      return NextResponse.json(
        { error: "Reservation delivery failed." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Could not deliver a Saray City reservation to Telegram.", error);
    return NextResponse.json(
      { error: "Reservation delivery failed." },
      { status: 502 },
    );
  }
}
