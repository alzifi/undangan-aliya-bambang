document.addEventListener('DOMContentLoaded', () => {
    // Tanggal target acara: Minggu, 18 Januari 2026, 10.00 WIB
    const targetDate = new Date("Jan 18, 2026 10:00:00").getTime();
    
    const countdownTimer = document.getElementById('countdown-timer');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Elemen Landing Page
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const openBtn = document.getElementById('open-invitation-btn');
    const guestNameEl = document.getElementById('guest-name');
    const musicBtn = document.getElementById('music-toggle');
    const musicPlayer = document.getElementById('background-music');

    // Elemen RSVP
    const rsvpForm = document.getElementById('rsvp-form');
    const greetingsList = document.getElementById('greetings-list');

    // --- 1. Fungsi Mengambil Nama Tamu dari URL Parameter (?to=...) ---
    function getGuestName() {
        const urlParams = new URLSearchParams(window.location.search);
        // Menggunakan "Tamu Undangan" sebagai default jika parameter 'to' tidak ada
        const guest = urlParams.get('to') || 'Tamu Undangan'; 
        
        // Dekode URL, ganti underscore/hyphen dengan spasi, dan kapitalisasi setiap kata
        const formattedGuest = decodeURIComponent(guest)
            .replace(/[_-]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        guestNameEl.textContent = formattedGuest;
    }

    // --- 2. Fungsi Hitung Mundur ---
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Perhitungan waktu untuk hari, jam, menit, dan detik
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownTimer.innerHTML = '<h2>Acara Telah Selesai!</h2>';
            return;
        }

        // Tampilkan hasil dengan format dua digit
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Panggil fungsi sekali saat load, lalu set interval
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // --- 3. Tombol Buka Undangan (Menampilkan Konten Utama & Memutar Musik) ---
    openBtn.addEventListener('click', () => {
        coverPage.style.display = 'none';
        mainContent.classList.remove('hidden');
        document.body.style.overflowY = 'scroll'; // Mengizinkan scroll
        
        // Coba putar musik secara otomatis (mungkin gagal karena kebijakan browser)
        playMusic(); 
    });

    // --- 4. Fungsi Musik Latar ---
    function playMusic() {
        // Hanya coba putar jika musik sedang berhenti
        if (musicPlayer.paused) {
             musicPlayer.play().then(() => {
                musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => {
                console.warn("Autoplay gagal, mungkin diblokir: ", error);
            });
        }
    }

    musicBtn.addEventListener('click', () => {
        if (musicPlayer.paused) {
            musicPlayer.play();
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            musicPlayer.pause();
            musicBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // --- 5. Fungsi RSVP & Ucapan (Menggunakan localStorage) ---

    // Memuat ucapan yang sudah ada
    function loadGreetings() {
        const storedGreetings = JSON.parse(localStorage.getItem('weddingGreetings')) || [];
        greetingsList.innerHTML = '<h3>Ucapan dari Tamu</h3>'; // Reset list

        if (storedGreetings.length === 0) {
            greetingsList.innerHTML += '<p style="text-align:center;">Belum ada ucapan.</p>';
            return;
        }

        storedGreetings.forEach(greeting => {
            const item = document.createElement('div');
            item.className = 'greeting-item';
            item.innerHTML = `
                <p><strong>${greeting.nama}</strong> (${greeting.hadir === 'hadir' ? 'Hadir' : 'Tidak Hadir'}, ${greeting.jumlah} orang)</p>
                <p>"${greeting.ucapan}"</p>
            `;
            greetingsList.appendChild(item);
        });
    }

    // Event handler submit form
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const hadir = document.getElementById('hadir').value;
        const jumlah = document.getElementById('jumlah').value;
        const ucapan = document.getElementById('ucapan').value;
        
        const newGreeting = { nama, hadir, jumlah, ucapan };

        // Simpan ke localStorage
        const storedGreetings = JSON.parse(localStorage.getItem('weddingGreetings')) || [];
        storedGreetings.push(newGreeting);
        localStorage.setItem('weddingGreetings', JSON.stringify(storedGreetings));

        // Tampilkan pesan sukses
        alert(`Terima kasih ${nama}!\nKonfirmasi: ${hadir === 'hadir' ? 'Inshaa Allah Hadir' : 'Mohon Maaf Tidak Hadir'}.\nUcapan Anda telah tercatat.`);
        
        // Muat ulang daftar ucapan
        loadGreetings();
        
        // Reset form
        rsvpForm.reset();
    });

    // Inisialisasi
    getGuestName();
    loadGreetings();
});
