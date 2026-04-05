/**
 * calendarUtils.js
 * Generates a downloadable .ics file from surprise plan timeline steps.
 */

function toICSDate(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function parseOffset(label) {
  const l = label.toLowerCase();
  if (l.includes("2 week")) return -14;
  if (l.includes("1 week")) return -7;
  if (l.includes("3 day")) return -3;
  if (l.includes("2 day")) return -2;
  if (l.includes("1 day") || l.includes("day before")) return -1;
  if (l.includes("morning")) return 0;
  if (l.includes("afternoon")) return 0;
  if (l.includes("evening")) return 0;
  if (l.includes("next day")) return 1;
  if (l.includes("memory")) return 2;
  return 0;
}

function buildEvent({ uid, summary, description, date }) {
  const start = toICSDate(date);
  const end = toICSDate(new Date(date.getTime() + 60 * 60 * 1000));
  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:🎉 ${summary}`,
    `DESCRIPTION:${description.replace(/,/g, "\\,")}`,
    "END:VEVENT",
  ].join("\r\n");
}

export function downloadCalendar(plan, eventDate) {
  const base = new Date(eventDate);
  const allSteps = [
    ...(plan.timeline?.before || []),
    ...(plan.timeline?.during || []),
    ...(plan.timeline?.after || []),
  ];

  const events = allSteps.map((step, i) => {
    const [label, ...rest] = step.split(":");
    const description = rest.join(":").trim() || step;
    const offset = parseOffset(label);
    const date = new Date(base);
    date.setDate(base.getDate() + offset);
    if (label.toLowerCase().includes("afternoon")) date.setHours(13, 0, 0, 0);
    else if (label.toLowerCase().includes("evening")) date.setHours(18, 0, 0, 0);
    else date.setHours(10, 0, 0, 0);

    return buildEvent({
      uid: `surprise-planner-${i}-${Date.now()}`,
      summary: description.length > 50 ? description.slice(0, 50) + "…" : description,
      description,
      date,
    });
  });

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Surprise Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "surprise-plan.ics";
  a.click();
  URL.revokeObjectURL(url);
}
