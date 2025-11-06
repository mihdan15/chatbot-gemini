# 🤖 Chatbot AI (Gemini 2.5 Flash + Express + React)

Proyek ini menggabungkan **backend Node.js (Express)** dan **frontend React (Vite)** untuk membuat chatbot AI sederhana berbasis model **Gemini 2.5 Flash**.  
Chatbot bisa diajak ngobrol secara umum, menyimpan konteks percakapan sementara di memori (RAM), dan ditampilkan dalam antarmuka chat interaktif.

---

## 🚀 Cara Menjalankan

### 1️⃣ Jalankan Backend

-dapatkan api gemini di https://aistudio.google.com/
-simpan API_KEY
-masuk folder backend
-ubah .env.example menjadi .env
-ubah GEMINI_API_KEY=YOUR_GEMINI_API_KEY
-setelah itu ubah menjadi API_KEY gemini mu

```bash
cd backend
npm install
npm run dev
```

Server akan berjalan di `http://localhost:3001`

### 2️⃣ Jalankan Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend jalan di `http://localhost:5173`

> Pastikan file `.env` di folder `frontend` berisi:
>
> ```
> VITE_API_BASE=http://localhost:3001
> ```

---

## ⚙️ Fitur

- Chat interaktif dua arah dengan AI Gemini
- Mengingat konteks percakapan selama sesi aktif
- UI bergaya modern (dark mode) dengan bubble chat
- Tombol **Reset Chat** untuk menghapus memori percakapan
- Endpoint `GET /api/health` untuk memeriksa status server

---

## 📁 Struktur Folder

```
chatbot-project/
├─ backend/
│  ├─ src/
│  │  ├─ server.ts      # API utama & penyimpanan konteks chat
│  │  └─ gemini.ts      # Pemanggilan model Gemini
│  ├─ package.json
│  └─ .env.example
└─ frontend/
   ├─ src/
   │  ├─ App.tsx         # UI chatbot
   │  ├─ main.tsx
   │  └─ index.css
   ├─ package.json
   └─ .env.example
```

---

## 💬 API Endpoint

**POST** `/api/chat`

```json
{ "message": "Hai, siapa kamu?" }
```

Response:

```json
{
  "success": true,
  "data": { "reply": "Halo! Aku asisten AI yang siap membantu kamu 😊" },
  "timestamp": "2025-11-06T12:00:00.000Z"
}
```

---

## 🧠 Teknologi

- Backend: Node.js, Express.js, TypeScript
- Frontend: React, Vite, Tailwind (CSS custom)
- AI: Google Gemini 2.5 Flash (`@google/genai`)

---

## 📜 Lisensi

MIT License — bebas dipakai dan dikembangkan kembali.
