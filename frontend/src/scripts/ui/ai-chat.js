// ── Imports ──
import {askQuestion} from "/src/scripts/services/ai-chat-service.js";

// ── Elements ──
const btn = document.getElementById("ai-chat-btn");
const popup = document.getElementById("ai-popup");
const overlay = document.getElementById("ai-overlay");
const closeBtn = document.getElementById("ai-close-btn");
const input = document.getElementById("ai-input");
const sendBtn = document.getElementById("ai-send-btn");
const messages = document.getElementById("ai-messages");

// ── Open / Close ──
function openPopup() {
    popup.classList.add("active");
    overlay.classList.add("active");
    input.focus();
}

function closePopup() {
    popup.classList.remove("active");
    overlay.classList.remove("active");
}

btn.addEventListener("click", openPopup);
closeBtn.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);


function cleanAnswer(text) {
    return text.replace(/\* /g, '').replace(/\*/g, '');
}

// ── Messages ──
function addMessage(text, type, source = null) {
    const div = document.createElement("div");
    div.classList.add("ai-msg", type);
    div.textContent = text;

    if (source && type === "bot") {
        const badge = document.createElement("div");
        badge.classList.add("ai-source");
        const sourceMap = {
            "db+rag": "منابع داخلی ایران‌گرد",
            "comments": "نظرات کاربران",
            "general": "دانش عمومی"
        };
        badge.textContent = sourceMap[source] || source;
        div.appendChild(badge);
    }

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
}

// ── Send ──
async function sendQuestion() {
    const question = input.value.trim();
    if (!question) return;

    addMessage(question, "user");
    input.value = "";
    sendBtn.disabled = true;

    const loading = addMessage("در حال پردازش...", "loading");

    try {
        const response = await askQuestion(question);
        loading.remove();

        if (response.success && response.data) {
            const cleanText = cleanAnswer(response.data.answer);
            addMessage(cleanText, "bot", response.data.source);
        } else {
            addMessage("مشکلی پیش آمد. لطفاً دوباره تلاش کن.", "bot");
        }
    } catch (err) {
        loading.remove();
        console.error("AI Error:", err);
        addMessage("خطا در اتصال به سرور.", "bot");
    } finally {
        sendBtn.disabled = false;
        input.focus();
    }
}

sendBtn.addEventListener("click", sendQuestion);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendQuestion();
});