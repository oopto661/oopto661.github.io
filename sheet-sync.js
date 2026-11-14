/**
 * Old Orchard Elementary PTO — "Zero-Tech Parent" Live Google Sheet Sync & Interactive UI
 * =========================================================================================
 * HOW TO CONNECT YOUR GOOGLE SHEET (OPTIONAL):
 * 1. Import `pto-website-template.csv` into Google Sheets.
 * 2. In Google Sheets, click File -> Share -> Publish to web.
 * 3. Choose "Entire Document" (or Sheet1) and format "Comma-separated values (.csv)", then click Publish.
 * 4. Paste that published CSV link inside the quotes below for `GOOGLE_SHEET_CSV_URL`.
 *
 * NOTE: Even if left blank (""), 100% of the 2026-2027 school year schedule is pre-rendered
 * directly in `index.html` for an instantaneous 0.1s initial load and offline support!
 */

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjCFGy-Rjqhbn1FLaf1GNtP_irKnAFEfFf9EkgO7GEusMsQi_sGXtw6XeJGLOJPTlO0aiA17QS46e6/pub?gid=252000025&single=true&output=csv";
const CACHE_KEY = "oo_pto_sheet_cache_v26_27";

// Default Baked-In 2026-2027 Dataset (used for instant spotlight computation & fallback)
const DEFAULT_PTO_DATA = {
  events: [
    { month: "August", date: "Aug 12", title: "Popsicles with PTO", desc: "Cool off, meet fellow Owl families, and kick off the 2026–2027 school year together!", link: "#events", color: "pink" },
    { month: "August", date: "Aug 13", title: "Coffee with the Principals", desc: "Informal morning chat and Q&A with school leadership and PTO board members.", link: "#events", color: "pink" },
    { month: "August", date: "Aug 24", title: "PTO Meeting (8:15 AM – Library)", desc: "Welcome back meeting, annual budget overview, and Fall event planning.", link: "#meetings", color: "pink", isMeeting: true },
    { month: "September", date: "Sep 14", title: "PowerUp PledgeDrive Kickoff", desc: "Launch of our biggest annual school fundraiser supporting assemblies, field trips, and classrooms!", link: "https://orchard.pledgestar.com/Welcome.html", color: "gold" },
    { month: "September", date: "Sep 18", title: "Fall Festival", desc: "Evening of family carnival games, food, music, and community fun on campus.", link: "#committees", color: "gold" },
    { month: "September", date: "Sep 28", title: "PTO Meeting (8:15 AM – Library)", desc: "PowerUp Fun Run final prep and Fall Festival wrap-up.", link: "#meetings", color: "gold", isMeeting: true },
    { month: "October", date: "Oct 1", title: "PowerUp Fun Run", desc: "Our high-energy school-wide lap run! Cheer on our Owls as they run for their classrooms.", link: "https://orchard.pledgestar.com/Welcome.html", color: "sage" },
    { month: "October", date: "Oct 26", title: "PTO Meeting (8:15 AM – Library)", desc: "Trunk or Treat logistics and November Book Fair planning.", link: "#meetings", color: "sage", isMeeting: true },
    { month: "October", date: "Oct 30", title: "Trunk or Treat", desc: "Decorated car trunks, candy, and festive family fun in the school parking lot.", link: "#committees", color: "sage" },
    { month: "October", date: "Oct 30", title: "Halloween Parade", desc: "Our beloved morning costume parade on campus for students and families.", link: "#events", color: "sage" },
    { month: "November", date: "Nov 12–19", title: "Book Fair", desc: "Stock up on great reads! Every book purchased helps grow our school and classroom libraries.", link: "#committees", color: "sky" },
    { month: "November", date: "Nov 30**", title: "PTO Meeting (8:15 AM – Library)", desc: "Holiday Gift Shop & Winter events planning (5th Monday due to Thanksgiving).", link: "#meetings", color: "sky", isMeeting: true },
    { month: "December", date: "Dec 1–4", title: "Family Gift Basket Collection", desc: "Classrooms and families donate themed items for our seasonal raffle baskets.", link: "#events", color: "gold" },
    { month: "December", date: "Dec 7–11", title: "Holiday Gift Shop", desc: "Students shop for affordable, kid-friendly holiday gifts for family members and loved ones.", link: "#events", color: "gold" },
    { month: "January", date: "Jan 25", title: "PTO Meeting (8:15 AM – Library)", desc: "Mid-year budget check-in and February family events prep.", link: "#meetings", color: "sage", isMeeting: true },
    { month: "January", date: "Jan 29", title: "Chuck E Cheese Night", desc: "Dine and play out with Owl families! A percentage of sales comes right back to Old Orchard PTO.", link: "#events", color: "sage" },
    { month: "February", date: "Feb 16", title: "Bingo For Books", desc: "Free family bingo night where every winning card takes home a brand-new book!", link: "#committees", color: "sky" },
    { month: "February", date: "Feb 17", title: "Pastries with Parents", desc: "Enjoy a sweet morning treat on campus with your student before the school bell rings.", link: "#events", color: "sky" },
    { month: "February", date: "Feb 18", title: "Career Day", desc: "Community members and parents share their professions and inspire our students.", link: "#contact", color: "sky" },
    { month: "February", date: "Feb 19", title: "Owls' Family Dance", desc: "Put on your dancing shoes for a memorable evening of music, photo booths, and treats!", link: "#committees", color: "sky" },
    { month: "February", date: "Feb 22", title: "PTO Meeting (8:15 AM – Library)", desc: "Read Across America, Read-A-Thon, and Variety Show planning.", link: "#meetings", color: "sky", isMeeting: true },
    { month: "March", date: "Mar 1–5", title: "Read Across America", desc: "Spirit days, guest readers, and campus-wide celebrations of the joy of reading.", link: "#events", color: "pink" },
    { month: "March", date: "All Month", title: "Read-A-Thon", desc: "Month-long reading challenge encouraging students to log minutes and build literacy skills.", link: "#events", color: "pink" },
    { month: "March", date: "Mar 10", title: "Picnic with Parents", desc: "Bring a blanket and lunch to campus to enjoy midday sunshine with your Owl!", link: "#events", color: "pink" },
    { month: "March", date: "Mar 22", title: "PTO Meeting (8:15 AM – Library)", desc: "Multicultural Night and Staff Appreciation Week planning.", link: "#meetings", color: "pink", isMeeting: true },
    { month: "March", date: "TBD", title: "Variety Show", desc: "Our talented Old Orchard Owls take the stage to sing, dance, and perform!", link: "#events", color: "pink" },
    { month: "April", date: "Apr 22", title: "Multicultural Night", desc: "Celebrate the rich cultures, traditions, foods, and heritage of our Old Orchard families.", link: "#events", color: "sage" },
    { month: "April", date: "Apr 26", title: "PTO Meeting (8:15 AM – Library)", desc: "Next year PTO Board nominations and Open House prep.", link: "#meetings", color: "sage", isMeeting: true },
    { month: "April", date: "Apr 26–30", title: "Staff Appreciation", desc: "A full week of pampering, lunches, and gratitude for our extraordinary teachers and staff.", link: "#committees", color: "sage" },
    { month: "May", date: "May 6", title: "Open House", desc: "Tour classrooms, celebrate student work from the year, and connect with teachers.", link: "#events", color: "sky" },
    { month: "May", date: "May 17–21", title: "Penny Wars (TBD)", desc: "Friendly grade-level coin challenge raising funds for campus enrichment!", link: "#events", color: "sky" },
    { month: "May", date: "May 24", title: "PTO Meeting (8:15 AM – Library)", desc: "2027–2028 Board election, year-end celebration, and summer handoff.", link: "#meetings", color: "sky", isMeeting: true },
    { month: "June", date: "Summer", title: "Have a Great Summer!", desc: "Wishing all our Old Orchard Owls and families a safe, sunny, and restful summer break!", link: "#events", color: "pink" }
  ],
  meetings: [
    { month: "August", date: "August 24", timeLoc: "8:15 AM – School Library", desc: "Welcome back meeting, annual budget overview, and Fall event planning.", note: "Regular" },
    { month: "September", date: "September 28", timeLoc: "8:15 AM – School Library", desc: "PowerUp Fun Run final prep and Fall Festival wrap-up.", note: "Regular" },
    { month: "October", date: "October 26", timeLoc: "8:15 AM – School Library", desc: "Trunk or Treat logistics and November Book Fair planning.", note: "Regular" },
    { month: "November", date: "November 30**", timeLoc: "8:15 AM – School Library", desc: "Holiday Gift Shop & Winter events planning.", note: "**4th Monday is during Thanksgiving break" },
    { month: "December", date: "NO DECEMBER MEETING", timeLoc: "Happy Holidays!", desc: "No general PTO meeting in December. Enjoy the winter break with family!", note: "NoMeeting" },
    { month: "January", date: "January 25", timeLoc: "8:15 AM – School Library", desc: "Mid-year budget check-in and February family events prep.", note: "Regular" },
    { month: "February", date: "February 22", timeLoc: "8:15 AM – School Library", desc: "Read Across America, Read-A-Thon, and Variety Show planning.", note: "Regular" },
    { month: "March", date: "March 22", timeLoc: "8:15 AM – School Library", desc: "Multicultural Night and Staff Appreciation Week planning.", note: "Regular" },
    { month: "April", date: "April 26", timeLoc: "8:15 AM – School Library", desc: "Next year PTO Board nominations and Open House prep.", note: "Regular" },
    { month: "May", date: "May 24", timeLoc: "8:15 AM – School Library", desc: "2027–2028 Board election, year-end celebration, and summer handoff.", note: "Regular" }
  ]
};

const SCHOOL_YEAR_MONTHS = [
  "August", "September", "October", "November", "December",
  "January", "February", "March", "April", "May", "June"
];

const MONTH_SEASONS = {
  August: "fall",
  September: "fall",
  October: "fall",
  November: "fall",
  December: "winter",
  January: "winter",
  February: "winter",
  March: "spring",
  April: "spring",
  May: "spring",
  June: "spring"
};

const OWL_CARD_STYLE = {
  headerBg: "bg-[#1B2668]",
  border: "border-[#1B2668]/15",
  headerBorder: "border-b-2 border-[#F5B716]",
  pill: "bg-[#D81E28]/10 text-[#D81E28]"
};

const MONTH_STYLE_MAP = {
  August: OWL_CARD_STYLE,
  September: OWL_CARD_STYLE,
  October: OWL_CARD_STYLE,
  November: OWL_CARD_STYLE,
  December: OWL_CARD_STYLE,
  January: OWL_CARD_STYLE,
  February: OWL_CARD_STYLE,
  March: OWL_CARD_STYLE,
  April: OWL_CARD_STYLE,
  May: OWL_CARD_STYLE,
  June: OWL_CARD_STYLE
};

/**
 * Lightweight RFC-4180 CSV parser (Zero external dependencies)
 */
function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentVal = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentVal += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentVal.trim());
        currentVal = "";
      } else if (char === "\n" || (char === "\r" && nextChar === "\n")) {
        if (char === "\r") i++;
        currentRow.push(currentVal.trim());
        if (currentRow.some((cell) => cell !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
  }
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some((cell) => cell !== "")) {
      rows.push(currentRow);
    }
  }
  return rows;
}

/**
 * Transform parsed CSV rows into structured sections
 */
function transformCSVToStructuredData(rows) {
  if (!rows || rows.length < 2) return null;
  const data = {
    events: [],
    meetings: [],
    committees: [],
    board: [],
    links: {}
  };

  // Skip header row (index 0)
  for (let i = 1; i < rows.length; i++) {
    const [section, group, dateOrRole, titleOrName, descOrEmail, linkUrl, notesOrColor] = rows[i];
    if (!section) continue;
    const type = section.toUpperCase();

    if (type === "EVENT") {
      data.events.push({
        month: group || "August",
        date: dateOrRole || "",
        title: titleOrName || "",
        desc: descOrEmail || "",
        link: linkUrl || "#events",
        color: notesOrColor || "pink"
      });
    } else if (type === "MEETING") {
      data.meetings.push({
        month: group || "",
        date: dateOrRole || "",
        timeLoc: titleOrName || "8:15 AM – School Library",
        desc: descOrEmail || "",
        link: linkUrl || "",
        note: notesOrColor || "Regular"
      });
    } else if (type === "COMMITTEE") {
      data.committees.push({
        category: group || "Volunteer",
        season: dateOrRole || "2026–2027",
        title: titleOrName || "",
        desc: descOrEmail || "",
        link: linkUrl || "#contact",
        badge: notesOrColor || "Join Team"
      });
    } else if (type === "BOARD") {
      data.board.push({
        group: group || "Executive",
        role: dateOrRole || "",
        name: titleOrName || "Placeholder Name",
        email: descOrEmail || "",
        term: notesOrColor || "2026–2027 Term"
      });
    } else if (type === "LINK") {
      data.links[dateOrRole] = {
        label: titleOrName,
        desc: descOrEmail,
        url: linkUrl
      };
    }
  }
  return data;
}

/**
 * Determine visitor's current & next school year months
 */
function getCurrentAndNextSchoolMonths() {
  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentCalendarMonth = monthNames[now.getMonth()];

  // If visiting in July, spotlight August & September kickoff
  if (currentCalendarMonth === "July") {
    return { currentMonth: "August", nextMonth: "September", rawMonthName: "July" };
  }

  const idx = SCHOOL_YEAR_MONTHS.indexOf(currentCalendarMonth);
  const currentMonth = idx !== -1 ? SCHOOL_YEAR_MONTHS[idx] : "August";
  const nextMonth = idx !== -1 && idx + 1 < SCHOOL_YEAR_MONTHS.length
    ? SCHOOL_YEAR_MONTHS[idx + 1]
    : "August";

  return { currentMonth, nextMonth, rawMonthName: currentCalendarMonth };
}

/**
 * Escape HTML safely for dynamic rendering
 */
function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Render Current & Next Month Spotlight at the top of #events
 */
function renderSpotlightBanner(eventsList, meetingsList) {
  const { currentMonth, nextMonth } = getCurrentAndNextSchoolMonths();
  const spotlightContainer = document.getElementById("current-month-spotlight");
  if (!spotlightContainer) return;

  const currentEvents = eventsList.filter((e) => e.month.toLowerCase() === currentMonth.toLowerCase());
  const nextEvents = eventsList.filter((e) => e.month.toLowerCase() === nextMonth.toLowerCase());
  const currentMeeting = meetingsList.find((m) => m.month.toLowerCase() === currentMonth.toLowerCase()) ||
                         meetingsList.find((m) => m.month.toLowerCase() === nextMonth.toLowerCase());

  const labelEl = document.getElementById("spotlight-months-label");
  if (labelEl) {
    labelEl.textContent = `${currentMonth} & ${nextMonth} Spotlight`;
  }

  const buildEventItems = (items, badgeColor) => {
    if (!items.length) {
      return `<li class="text-sm text-slate-600 italic">No scheduled events this month.</li>`;
    }
    return items.map((ev) => `
      <li class="flex items-start gap-3 p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs">
        <span class="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${badgeColor}">
          ${escapeHTML(ev.date)}
        </span>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-[#1B2668] text-sm sm:text-base leading-snug">${escapeHTML(ev.title)}</p>
          ${ev.desc ? `<p class="text-xs text-slate-600 mt-0.5">${escapeHTML(ev.desc)}</p>` : ""}
        </div>
      </li>
    `).join("");
  };

  const meetingText = currentMeeting
    ? `${escapeHTML(currentMeeting.date)} (${escapeHTML(currentMeeting.timeLoc)})`
    : "4th Monday of the month at 8:15 AM in the School Library";

  spotlightContainer.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      <!-- Current Month Card -->
      <div class="lg:col-span-5 rounded-2xl bg-[#FDF8F2] border-2 border-[#F5B716] p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#F5B716] text-[#1B2668]">
              <span class="w-2 h-2 rounded-full bg-[#D81E28] animate-ping"></span>
              Happening in ${escapeHTML(currentMonth)}
            </span>
            <span class="text-xs font-semibold text-slate-500">Current Focus</span>
          </div>
          <ul class="space-y-2.5">
            ${buildEventItems(currentEvents, "bg-[#1B2668] text-white")}
          </ul>
        </div>
      </div>

      <!-- Next Month Card -->
      <div class="lg:col-span-4 rounded-2xl bg-white/95 border border-white/25 p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#E0F4FF] text-[#1B2668]">
              Coming Up in ${escapeHTML(nextMonth)}
            </span>
            <span class="text-xs font-semibold text-slate-500">On Deck</span>
          </div>
          <ul class="space-y-2.5">
            ${buildEventItems(nextEvents, "bg-[#D81E28] text-white")}
          </ul>
        </div>
      </div>

      <!-- Next PTO Meeting Callout -->
      <div class="lg:col-span-3 rounded-2xl bg-[#131b4d] border border-white/15 p-5 text-white flex flex-col justify-between">
        <div>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white/10 text-[#F5B716] mb-3">
            General PTO Meeting
          </span>
          <h4 class="font-display text-lg font-bold text-white leading-snug mb-1.5">
            ${escapeHTML(currentMonth)} Meeting
          </h4>
          <p class="text-sm text-[#F5B716] font-semibold mb-2">${meetingText}</p>
          <p class="text-xs text-slate-200 leading-relaxed">
            ${currentMeeting && currentMeeting.note && currentMeeting.note !== "Regular" && currentMeeting.note !== "NoMeeting"
              ? escapeHTML(currentMeeting.note)
              : "All Old Orchard parents, guardians, and teachers are warmly invited!"}
          </p>
        </div>
        <a href="#meetings" class="mt-4 inline-flex items-center justify-center gap-1.5 w-full px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition">
          View All 26–27 Meeting Dates &rarr;
        </a>
      </div>
    </div>
  `;
}

/**
 * Highlight the active & next month cards on the pre-rendered or synced DOM grid
 */
function highlightActiveMonthsInDOM() {
  const { currentMonth, nextMonth } = getCurrentAndNextSchoolMonths();

  // Highlight Month Cards in Annual Planner
  document.querySelectorAll("[data-month-card]").forEach((card) => {
    const m = card.getAttribute("data-month-card");
    const badgeSlot = card.querySelector("[data-month-badge]");
    card.classList.remove("ring-4", "ring-[#F5B716]", "shadow-lg", "ring-2", "ring-[#1B2668]/30");
    if (badgeSlot) badgeSlot.innerHTML = "";

    if (m && m.toLowerCase() === currentMonth.toLowerCase()) {
      card.classList.add("ring-4", "ring-[#F5B716]", "shadow-lg");
      if (badgeSlot) {
        badgeSlot.innerHTML = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F5B716] text-[#1B2668] shadow-xs">This Month</span>`;
      }
    } else if (m && m.toLowerCase() === nextMonth.toLowerCase()) {
      card.classList.add("ring-2", "ring-[#1B2668]/30");
      if (badgeSlot) {
        badgeSlot.innerHTML = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 text-white border border-white/25">Next Month</span>`;
      }
    }
  });

  // Highlight Meeting Rows
  document.querySelectorAll("[data-meeting-month]").forEach((row) => {
    const m = row.getAttribute("data-meeting-month");
    const badge = row.querySelector("[data-meeting-badge]");
    if (m && m.toLowerCase() === currentMonth.toLowerCase()) {
      row.classList.add("ring-2", "ring-[#F5B716]", "bg-[#FDF8F2]");
      if (badge) {
        badge.classList.remove("hidden");
        badge.textContent = "This Month";
      }
    }
  });

  groupPastItemsIntoDetails(currentMonth);
}

/**
 * Automatically move past months/meetings (before currentMonth) into collapsed <details> accordions
 */
function groupPastItemsIntoDetails(currentMonth) {
  const currentIdx = SCHOOL_YEAR_MONTHS.indexOf(currentMonth);
  if (currentIdx <= 0) return;

  // 1. Annual Events Grid
  const eventsGrid = document.getElementById("annual-events-grid");
  if (eventsGrid) {
    let pastDetails = document.getElementById("past-events-details");
    if (!pastDetails) {
      eventsGrid.classList.remove("mb-14");
      eventsGrid.classList.add("mb-6");
      pastDetails = document.createElement("details");
      pastDetails.id = "past-events-details";
      pastDetails.className = "mb-14 rounded-2xl bg-slate-50/90 border border-slate-200/90 p-4 sm:p-5";
      pastDetails.innerHTML = `
        <summary class="cursor-pointer select-none flex items-center justify-between gap-3 font-display font-bold text-sm sm:text-base text-slate-600 hover:text-[#1B2668] transition">
          <span class="inline-flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-200 text-slate-600">Archive</span>
            <span id="past-events-summary-label">View Past Events</span>
          </span>
          <span class="text-xs font-semibold text-slate-400">Click to expand / collapse</span>
        </summary>
        <div id="past-events-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5"></div>
      `;
      eventsGrid.insertAdjacentElement("afterend", pastDetails);
    }

    const pastEventsGrid = document.getElementById("past-events-grid");
    const allMonthCards = Array.from(document.querySelectorAll("[data-month-card]"));
    const seenEventMonths = new Set();
    let pastCount = 0;

    allMonthCards.forEach((card) => {
      const m = card.getAttribute("data-month-card");
      if (seenEventMonths.has(m)) {
        card.remove();
        return;
      }
      seenEventMonths.add(m);
      const mIdx = SCHOOL_YEAR_MONTHS.indexOf(m);
      if (mIdx !== -1 && mIdx < currentIdx) {
        card.classList.add("opacity-85");
        pastEventsGrid.appendChild(card);
        pastCount++;
      } else {
        card.classList.remove("opacity-85");
        eventsGrid.appendChild(card);
      }
    });

    const summaryLabel = document.getElementById("past-events-summary-label");
    if (summaryLabel) {
      const lastPast = SCHOOL_YEAR_MONTHS[currentIdx - 1];
      summaryLabel.textContent = `View Past Events (Aug – ${lastPast})`;
    }
    pastDetails.classList.toggle("hidden", pastCount === 0);
  }

  // 2. General PTO Meetings Schedule
  const meetingsGrid = document.getElementById("meetings-schedule-grid");
  if (meetingsGrid) {
    let pastMeetingsDetails = document.getElementById("past-meetings-details");
    if (!pastMeetingsDetails) {
      pastMeetingsDetails = document.createElement("details");
      pastMeetingsDetails.id = "past-meetings-details";
      pastMeetingsDetails.className = "mt-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 p-4";
      pastMeetingsDetails.innerHTML = `
        <summary class="cursor-pointer select-none flex items-center justify-between gap-2 font-display font-bold text-xs sm:text-sm text-slate-600 hover:text-[#1B2668] transition">
          <span class="inline-flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-200 text-slate-600">Archive</span>
            <span id="past-meetings-summary-label">View Past Meetings</span>
          </span>
          <span class="text-[11px] font-semibold text-slate-400">Click to expand</span>
        </summary>
        <div id="past-meetings-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4"></div>
      `;
      meetingsGrid.insertAdjacentElement("afterend", pastMeetingsDetails);
    }

    const pastMeetingsGrid = document.getElementById("past-meetings-grid");
    const allMeetingRows = Array.from(document.querySelectorAll("[data-meeting-month]"));
    const seenMeetingMonths = new Set();
    let pastMeetingCount = 0;

    allMeetingRows.forEach((row) => {
      const m = row.getAttribute("data-meeting-month");
      if (seenMeetingMonths.has(m)) {
        row.remove();
        return;
      }
      seenMeetingMonths.add(m);
      const mIdx = SCHOOL_YEAR_MONTHS.indexOf(m);
      if (mIdx !== -1 && mIdx < currentIdx) {
        row.classList.add("opacity-75");
        pastMeetingsGrid.appendChild(row);
        pastMeetingCount++;
      } else {
        row.classList.remove("opacity-75");
        meetingsGrid.appendChild(row);
      }
    });

    const summaryLabel = document.getElementById("past-meetings-summary-label");
    if (summaryLabel) {
      const lastPast = SCHOOL_YEAR_MONTHS[currentIdx - 1];
      summaryLabel.textContent = `View Past PTO Meetings (Aug – ${lastPast})`;
    }
    pastMeetingsDetails.classList.toggle("hidden", pastMeetingCount === 0);
  }
}

/**
 * Set up interactive Season / Month Filter buttons on the 2026-2027 Annual Grid
 */
function setupCalendarFilters() {
  const filterBtns = document.querySelectorAll("[data-calendar-filter]");
  if (!filterBtns.length) return;

  const { currentMonth, nextMonth } = getCurrentAndNextSchoolMonths();

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filterType = btn.getAttribute("data-calendar-filter");

      // Update active button state
      filterBtns.forEach((b) => {
        b.classList.remove("bg-[#1B2668]", "text-white", "shadow-sm");
        b.classList.add("bg-white", "text-slate-700", "hover:bg-slate-100");
      });
      btn.classList.remove("bg-white", "text-slate-700", "hover:bg-slate-100");
      btn.classList.add("bg-[#1B2668]", "text-white", "shadow-sm");

      // Show/hide month cards
      document.querySelectorAll("[data-month-card]").forEach((card) => {
        const month = card.getAttribute("data-month-card");
        const season = MONTH_SEASONS[month] || "all";

        let visible = true;
        if (filterType === "spotlight") {
          visible = month === currentMonth || month === nextMonth;
        } else if (filterType !== "all") {
          visible = season === filterType;
        }

        if (visible) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });

      // Handle past events <details> visibility & state based on filter
      const pastDetails = document.getElementById("past-events-details");
      if (pastDetails) {
        const hasVisiblePast = Array.from(pastDetails.querySelectorAll("[data-month-card]"))
          .some((card) => !card.classList.contains("hidden"));
        pastDetails.classList.toggle("hidden", !hasVisiblePast);
        if (filterType === "fall" && hasVisiblePast) {
          pastDetails.open = true;
        } else if (filterType === "all") {
          pastDetails.open = false;
        }
      }
    });
  });
}

/**
 * Apply synced Google Sheet data to the DOM (Events, Meetings, Committees, Board, Links)
 */
function applySyncedDataToDOM(data) {
  if (!data) return;

  // 1. Update Spotlight
  if (data.events && data.events.length) {
    renderSpotlightBanner(data.events, data.meetings && data.meetings.length ? data.meetings : DEFAULT_PTO_DATA.meetings);
  }

  // 2. Update Annual Planner Grid if events exist
  if (data.events && data.events.length) {
    const pastEventsGrid = document.getElementById("past-events-grid");
    if (pastEventsGrid) pastEventsGrid.innerHTML = "";
    const gridEl = document.getElementById("annual-events-grid");
    if (gridEl) {
      const grouped = {};
      SCHOOL_YEAR_MONTHS.forEach((m) => { grouped[m] = []; });
      data.events.forEach((ev) => {
        if (!grouped[ev.month]) grouped[ev.month] = [];
        grouped[ev.month].push(ev);
      });

      gridEl.innerHTML = SCHOOL_YEAR_MONTHS.map((month) => {
        const style = MONTH_STYLE_MAP[month] || MONTH_STYLE_MAP.August;
        const items = grouped[month] || [];
        const listHTML = items.map((item) => {
          const isM = item.isMeeting || item.title.includes("PTO Meeting");
          const badgeClass = isM ? "bg-[#1B2668] text-white" : style.pill;
          return `
          <li class="flex items-start gap-2.5 text-sm ${isM ? "pt-1 border-t border-slate-200/60" : ""}">
            <span class="inline-block px-2 py-0.5 rounded-md font-bold text-xs whitespace-nowrap mt-0.5 ${badgeClass}">
              ${escapeHTML(item.date)}
            </span>
            <div>
              <span class="font-semibold text-slate-800 leading-snug ${isM ? "text-[#1B2668] font-bold block" : ""}">${escapeHTML(item.title)}</span>
              ${isM && !item.title.includes("8:15 AM") ? `<span class="text-[11px] text-slate-500 font-medium block">8:15 AM &bull; Library</span>` : ""}
            </div>
          </li>
        `;
        }).join("");

        return `
          <article data-month-card="${escapeHTML(month)}" class="rounded-2xl bg-[#FDF8F2] border ${style.border} overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div>
              <div class="${style.headerBg} px-5 py-3.5 flex items-center justify-between ${style.headerBorder || "border-b-2 border-[#F5B716]"}">
                <h3 class="font-script text-3xl text-white tracking-wide">${escapeHTML(month)}</h3>
                <div data-month-badge></div>
              </div>
              <div class="p-5">
                <ul class="space-y-3">
                  ${listHTML}
                </ul>
              </div>
            </div>
          </article>
        `;
      }).join("");
    }
  }

  // 3. Update Meetings List if present
  if (data.meetings && data.meetings.length) {
    const pastMeetingsGrid = document.getElementById("past-meetings-grid");
    if (pastMeetingsGrid) pastMeetingsGrid.innerHTML = "";
    const meetingsGrid = document.getElementById("meetings-schedule-grid");
    if (meetingsGrid) {
      meetingsGrid.innerHTML = data.meetings.map((m) => {
        const isNoMeeting = m.note === "NoMeeting" || m.date.toUpperCase().includes("NO DECEMBER");
        const isSpecial = m.date.includes("**");
        const zoomUrl = m.link || (data.links && data.links.Zoom_Meeting_URL ? data.links.Zoom_Meeting_URL.url : "https://zoom.us/j/YOUR_ZOOM_MEETING_ID");
        return `
          <div data-meeting-month="${escapeHTML(m.month)}" class="p-4 rounded-xl border ${isNoMeeting ? "bg-slate-100/80 border-slate-200 text-slate-500" : "bg-white border-slate-200/90"} flex items-start justify-between gap-3 shadow-2xs">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-extrabold uppercase tracking-wider ${isNoMeeting ? "text-slate-400" : "text-[#D81E28]"}">${escapeHTML(m.month)}</span>
                <span data-meeting-badge class="hidden px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#F5B716] text-[#1B2668]"></span>
                ${isSpecial ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDE2E4] text-[#D81E28]">Note Change</span>` : ""}
              </div>
              <p class="font-display font-bold text-base ${isNoMeeting ? "text-slate-500" : "text-[#1B2668]"} mt-0.5">${escapeHTML(m.date)}</p>
              <p class="text-xs text-slate-600 mt-0.5">${escapeHTML(m.desc || m.timeLoc)}</p>
            </div>
            ${!isNoMeeting ? `
              <a
                href="${escapeHTML(zoomUrl)}"
                data-config-link="zoom"
                target="_blank"
                rel="noopener noreferrer"
                title="Join ${escapeHTML(m.month)} Meeting via Zoom"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D8CFF]/10 hover:bg-[#2D8CFF] text-[#1A73E8] hover:text-white font-display font-bold text-xs transition shrink-0 mt-1"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                <span>Zoom</span>
              </a>
            ` : ""}
          </div>
        `;
      }).join("");
    }
  }

  // 4. Update Board Members if present
  if (data.board && data.board.length) {
    const boardGrid = document.getElementById("board-members-grid");
    if (boardGrid) {
      boardGrid.innerHTML = data.board.map((member) => `
        <div class="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#1B2668] text-white">
                ${escapeHTML(member.role)}
              </span>
              <span class="text-xs font-medium text-slate-400">${escapeHTML(member.term)}</span>
            </div>
            <h3 class="font-display text-xl font-bold text-[#1B2668] mb-1">${escapeHTML(member.name)}</h3>
            <p class="text-xs text-slate-500">Old Orchard Elementary PTO</p>
          </div>
          ${member.email ? `
            <div class="mt-4 pt-3 border-t border-slate-100">
              <a href="mailto:${escapeHTML(member.email)}" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#D81E28] hover:underline">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                ${escapeHTML(member.email)}
              </a>
            </div>
          ` : ""}
        </div>
      `).join("");
    }
  }

  // 5. Update Configurable Quick Links if present (ignore unconfigured YOUR_ or generic placeholders)
  const isValidConfiguredUrl = (u) => u && u.trim() !== "" && !u.includes("YOUR_") && !u.endsWith("/calendar/u/0/r");
  if (data.links) {
    if (data.links.Volunteer_Form_URL && isValidConfiguredUrl(data.links.Volunteer_Form_URL.url)) {
      document.querySelectorAll("[data-config-link='volunteer']").forEach((el) => {
        el.setAttribute("href", data.links.Volunteer_Form_URL.url);
      });
    }
    if (data.links.Committee_Form_URL && isValidConfiguredUrl(data.links.Committee_Form_URL.url)) {
      document.querySelectorAll("[data-config-link='committee']").forEach((el) => {
        el.setAttribute("href", data.links.Committee_Form_URL.url);
      });
    }
    if (data.links.Zoom_Meeting_URL && isValidConfiguredUrl(data.links.Zoom_Meeting_URL.url)) {
      document.querySelectorAll("[data-config-link='zoom']").forEach((el) => {
        el.setAttribute("href", data.links.Zoom_Meeting_URL.url);
      });
    }
    if (data.links.Google_Calendar_URL && isValidConfiguredUrl(data.links.Google_Calendar_URL.url)) {
      document.querySelectorAll("[data-config-link='gcal']").forEach((el) => {
        el.setAttribute("href", data.links.Google_Calendar_URL.url);
      });
    }
    if (data.links.Drive_Minutes_URL && isValidConfiguredUrl(data.links.Drive_Minutes_URL.url)) {
      document.querySelectorAll("[data-config-link='minutes']").forEach((el) => {
        el.setAttribute("href", data.links.Drive_Minutes_URL.url);
      });
    }
    if (data.links.Drive_Bylaws_URL && isValidConfiguredUrl(data.links.Drive_Bylaws_URL.url)) {
      document.querySelectorAll("[data-config-link='bylaws']").forEach((el) => {
        el.setAttribute("href", data.links.Drive_Bylaws_URL.url);
      });
    }
    if (data.links.PTO_Contact_Email && data.links.PTO_Contact_Email.label) {
      document.querySelectorAll("[data-config-email]:not([data-config-email='yearbook'])").forEach((el) => {
        el.textContent = data.links.PTO_Contact_Email.label;
        el.setAttribute("href", `mailto:${data.links.PTO_Contact_Email.label}`);
      });
    }
    if (data.links.Yearbook_Upload_URL && data.links.Yearbook_Upload_URL.url) {
      document.querySelectorAll("[data-config-link='yearbook']").forEach((el) => {
        el.setAttribute("href", data.links.Yearbook_Upload_URL.url);
      });
    }
    if (data.links.Yearbook_Email && data.links.Yearbook_Email.label) {
      document.querySelectorAll("[data-config-email='yearbook']").forEach((el) => {
        el.textContent = data.links.Yearbook_Email.label;
        el.setAttribute("href", `mailto:${data.links.Yearbook_Email.label}`);
      });
    }
    if (data.links.Instagram_URL && data.links.Instagram_URL.url) {
      document.querySelectorAll("[data-config-link='instagram']").forEach((el) => {
        el.setAttribute("href", data.links.Instagram_URL.url);
      });
    }
  }

  highlightActiveMonthsInDOM();
}

/**
 * Stale-While-Revalidate (SWR) Live Sync Engine
 */
async function initGoogleSheetSync() {
  const syncBadge = document.getElementById("cms-sync-status");

  // Always compute and render the spotlight and current month highlights immediately (0ms wait)
  renderSpotlightBanner(DEFAULT_PTO_DATA.events, DEFAULT_PTO_DATA.meetings);
  highlightActiveMonthsInDOM();

  if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL.trim() === "") {
    if (syncBadge) {
      syncBadge.textContent = "2026–2027 Schedule Pre-Loaded (Instant Mode)";
    }
    return;
  }

  // Step 1: Load from localStorage cache immediately if available (Stale)
  try {
    const cachedRaw = localStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cachedData = JSON.parse(cachedRaw);
      applySyncedDataToDOM(cachedData);
      if (syncBadge) {
        syncBadge.textContent = "Synced from Google Sheet Cache";
      }
    }
  } catch (err) {
    console.warn("Unable to read localStorage cache:", err);
  }

  // Step 2: Revalidate in background from live Google Sheet CSV
  try {
    let targetUrl = GOOGLE_SHEET_CSV_URL.trim();
    if (targetUrl.includes("/pubhtml")) {
      targetUrl = targetUrl.replace("/pubhtml", "/pub");
    }
    if (targetUrl.includes("docs.google.com/spreadsheets") && !targetUrl.includes("output=csv")) {
      targetUrl += (targetUrl.includes("?") ? "&" : "?") + "output=csv";
    }
    const response = await fetch(targetUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    const structured = transformCSVToStructuredData(rows);

    if (structured) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(structured));
      applySyncedDataToDOM(structured);
      if (syncBadge) {
        syncBadge.textContent = "Live Synced with Google Sheets";
      }
    }
  } catch (err) {
    console.warn("Google Sheet background sync skipped or offline:", err);
  }
}

/**
 * Zero-Maintenance Contact Form Handler
 */
function setupContactForm() {
  const form = document.getElementById("pto-contact-form");
  const statusBox = document.getElementById("contact-form-status");
  if (!form || !statusBox) return;

  form.addEventListener("submit", async (e) => {
    const actionUrl = form.getAttribute("action") || "";
    const submitBtn = form.querySelector("button[type='submit']");

    // Check if honeypot field was filled by a bot
    const honey = form.querySelector("input[name='_honey']");
    if (honey && honey.value) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const formData = new FormData(form);
    const parentName = formData.get("name") || "Owl Parent";
    const topic = formData.get("topic") || "General Question";

    // If FormSubmit still has the placeholder email, gracefully guide or open mailto fallback
    if (actionUrl.includes("YOUR_PTO_EMAIL_HERE")) {
      const email = formData.get("email") || "";
      const grade = formData.get("grade_teacher") || "Not specified";
      const message = formData.get("message") || "";

      statusBox.classList.remove("hidden", "bg-red-50", "text-red-800", "border-red-200");
      statusBox.classList.add("bg-[#E2F0CB]/60", "text-[#1B2668]", "border-[#c5e09b]");
      statusBox.innerHTML = `
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-green-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          <div>
            <p class="font-bold text-sm">Thank you, ${escapeHTML(parentName)}! Your message is ready.</p>
            <p class="text-xs text-slate-700 mt-1">
              Opening your email client with your <strong>${escapeHTML(topic)}</strong> inquiry pre-filled. (Note for PTO Admin: Replace <code>YOUR_PTO_EMAIL_HERE</code> in <code>index.html</code> to enable direct FormSubmit inbox delivery.)
            </p>
          </div>
        </div>
      `;

      const subject = encodeURIComponent(`[Old Orchard PTO] ${topic} from ${parentName}`);
      const body = encodeURIComponent(
        `Parent Name: ${parentName}\nEmail: ${email}\nChild's Grade/Teacher: ${grade}\nTopic: ${topic}\n\nMessage:\n${message}`
      );
      setTimeout(() => {
        window.location.href = `mailto:president@oopto661.com?subject=${subject}&body=${body}`;
      }, 600);
      return;
    }

    // Live FormSubmit AJAX submission when configured with real PTO email
    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending Message...";
      }
      const response = await fetch(actionUrl, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        form.reset();
        statusBox.classList.remove("hidden", "bg-red-50", "text-red-800", "border-red-200");
        statusBox.classList.add("bg-[#E2F0CB]/60", "text-[#1B2668]", "border-[#c5e09b]");
        statusBox.innerHTML = `
          <p class="font-bold text-sm">Message Sent! Thank you, ${escapeHTML(parentName)}.</p>
          <p class="text-xs text-slate-700 mt-0.5">A member of the Old Orchard PTO Board will get back to you soon.</p>
        `;
      } else {
        throw new Error("Form submission returned non-200 status");
      }
    } catch (err) {
      statusBox.classList.remove("hidden");
      statusBox.classList.add("bg-red-50", "text-red-800", "border-red-200");
      statusBox.innerHTML = `<p class="font-bold text-sm">Could not submit automatically. Please email us directly at <a href="mailto:president@oopto661.com" class="underline">president@oopto661.com</a>.</p>`;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message to PTO";
      }
    }
  });
}

/**
 * Mobile Navigation & Planner Preview Modal
 */
function setupUIInteractions() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-nav-drawer");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!isExpanded));
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Planner Lightbox Zoom Modal
  const openModalBtn = document.getElementById("open-planner-modal");
  const closeModalBtn = document.getElementById("close-planner-modal");
  const modal = document.getElementById("planner-lightbox-modal");

  if (openModalBtn && closeModalBtn && modal) {
    openModalBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.style.overflow = "hidden";
    });
    const closeModal = () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "";
    };
    closeModalBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
    });
  }
}

/**
 * Dual Language Immersion (DLI) Spanish Translation Engine
 * Enables 1-click toggling between English and Spanish with persistence.
 */
function setupLanguageToggle() {
  const desktopBtn = document.getElementById("lang-toggle-btn");
  const desktopLabel = document.getElementById("lang-toggle-label");
  const mobileBtn = document.getElementById("mobile-lang-toggle-btn");
  const mobileLabel = document.getElementById("mobile-lang-toggle-label");

  if (!desktopBtn && !mobileBtn) return;

  const checkIsSpanish = () => {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
    const cookieVal = cookieMatch ? decodeURIComponent(cookieMatch[1]) : "";
    const localVal = localStorage.getItem("oo_pto_lang");
    return cookieVal.includes("/es") || localVal === "es";
  };

  const updateUI = () => {
    const isSpanish = checkIsSpanish();
    if (isSpanish) {
      if (desktopLabel) desktopLabel.textContent = "Switch to English";
      if (desktopBtn) desktopBtn.setAttribute("title", "Switch back to English");
      if (mobileLabel) mobileLabel.textContent = "🇺🇸 Switch to English";
      if (mobileBtn) mobileBtn.setAttribute("title", "Switch back to English");
    } else {
      if (desktopLabel) desktopLabel.textContent = "Traducir al Español";
      if (desktopBtn) desktopBtn.setAttribute("title", "Translate website into Spanish");
      if (mobileLabel) mobileLabel.textContent = "🌐 Traducir al Español";
      if (mobileBtn) mobileBtn.setAttribute("title", "Traducir este sitio al español");
    }
  };

  const setTranslateCookie = (targetLang) => {
    const host = window.location.hostname;
    const cookieVal = `/en/${targetLang}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    if (host && host !== "localhost" && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      document.cookie = `googtrans=${cookieVal}; path=/; domain=.${host};`;
    }
  };

  const clearTranslateCookie = () => {
    const host = window.location.hostname;
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=/en/en; path=/;";
    if (host && host !== "localhost" && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`;
      document.cookie = `googtrans=/en/en; path=/; domain=.${host};`;
    }
  };

  const handleToggle = () => {
    const currentlySpanish = checkIsSpanish();
    if (currentlySpanish) {
      // Revert to English
      clearTranslateCookie();
      localStorage.setItem("oo_pto_lang", "en");

      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = "en";
        select.dispatchEvent(new Event("change"));
        setTimeout(() => {
          updateUI();
          window.location.reload();
        }, 150);
      } else {
        window.location.reload();
      }
    } else {
      // Translate to Spanish
      setTranslateCookie("es");
      localStorage.setItem("oo_pto_lang", "es");

      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = "es";
        select.dispatchEvent(new Event("change"));
        updateUI();
      } else {
        window.location.reload();
      }
    }
  };

  if (desktopBtn) {
    desktopBtn.addEventListener("click", handleToggle);
  }
  if (mobileBtn) {
    mobileBtn.addEventListener("click", handleToggle);
  }

  // Update initial label state
  updateUI();

  // If saved preference was Spanish, ensure cookie is active
  if (checkIsSpanish()) {
    setTranslateCookie("es");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initGoogleSheetSync();
  setupCalendarFilters();
  setupContactForm();
  setupUIInteractions();
  setupLanguageToggle();
});
