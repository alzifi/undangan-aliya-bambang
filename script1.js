document.addEventListener('DOMContentLoaded', function() {
    // --- 1. MENAMPILKAN NAMA TAMU DARI URL PARAMETER (GUEST NAME) ---
    const urlParams = new URLSearchParams(window.location.search);
    let guestName = urlParams.get('to');
    const guestNameElement = document.getElementById('guest-name');
    
    // Default jika parameter 'to' tidak ada
    if (!guestName) {
        guestName = "Tamu Undangan";
    }
    
    // Mengganti '+' menjadi spasi (dari encoding URL)
    guestName = guestName.replace(/\+/g, ' '); 
    guestNameElement.textContent = guestName;


   // --- 2. LOGIKA LANDING PAGE & BUKA UNDANGAN ---
    const landingPage = document.getElementById('landing-page');
    const mainContent = document.getElementById('main-content');
    const footer = document.querySelector('footer');
    const openInvitationBtn = document.getElementById('open-invitation');
    const mainNav = document.getElementById('main-nav'); // Ambil elemen nav

    openInvitationBtn.addEventListener('click', function() {
        // Sembunyikan Landing Page
        landingPage.classList.add('hidden');
        // Tampilkan Konten Utama dan Navigasi
        mainContent.classList.remove('hidden');
        footer.classList.remove('hidden');
        mainNav.classList.remove('hidden'); // Tampilkan Navigasi
        // Mulai Putar Musik
        playMusic();
        
        // Opsional: Scroll ke atas setelah membuka
        window.scrollTo(0, 0); 
    });
  

    // --- 3. HITUNG MUNDUR (COUNTDOWN) ---
    // Tanggal acara: Minggu, 18 Januari 2026, 10:00:00 WIB
    const eventDate = new Date("Jan 18, 2026 10:00:00").getTime();
    
    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        // Perhitungan waktu
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Tampilkan hasilnya
        document.getElementById("days").textContent = days.toString().padStart(2, '0');
        document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');

        // Jika hitungan mundur selesai
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "<h3>Acara Sedang Berlangsung!</h3>";
        }
    }, 1000);


    // --- 4. MUSIK LATAR (PLAY/PAUSE) ---
    const music = document.getElementById('background-music');
    const musicToggleBtn = document.getElementById('music-toggle');
    let isPlaying = false;

    // Fungsi untuk memulai musik
    function playMusic() {
        if (!isPlaying) {
            music.volume = 0.5; // Atur volume
            music.play().then(() => {
                isPlaying = true;
                musicToggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => {
                // Handle autoplay block
                console.log("Autoplay dicegah. Klik tombol untuk memutar.");
            });
        }
    }

    // Toggle Play/Pause
    musicToggleBtn.addEventListener('click', function() {
        if (isPlaying) {
            music.pause();
            isPlaying = false;
            musicToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            playMusic();
        }
    });

    // --- 5. UCAPAN & RSVP (Menggunakan localStorage) ---
    const rsvpForm = document.getElementById('rsvp-form');
    const greetingsListContainer = document.getElementById('greetings-list');
    const STORAGE_KEY = 'aliya_bambang_greetings';

    // Ambil data ucapan dari localStorage
    function getGreetings() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    // Simpan data ucapan ke localStorage
    function saveGreetings(greetings) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(greetings));
    }

    // Tampilkan ucapan di halaman
    function renderGreetings() {
        const greetings = getGreetings().reverse(); // Tampilkan yang terbaru di atas
        greetingsListContainer.innerHTML = '<h4>Ucapan Terbaru:</h4>';

        if (greetings.length === 0) {
            greetingsListContainer.innerHTML += '<p style="text-align: center;">Belum ada ucapan.</p>';
            return;
        }

        greetings.slice(0, 10).forEach(item => { // Tampilkan 10 ucapan terbaru
            const div = document.createElement('div');
            div.className = 'greeting-item';
            
            const nameEl = document.createElement('strong');
            nameEl.textContent = item.name;

            const statusEl = document.createElement('span');
            statusEl.className = 'status-tag';
            statusEl.textContent = ` (${item.status})`;
            nameEl.appendChild(statusEl);

            const messageEl = document.createElement('p');
            messageEl.textContent = item.message;

            div.appendChild(nameEl);
            div.appendChild(messageEl);

            greetingsListContainer.appendChild(div);
        });
    }

    // Handler saat form disubmit
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const status = document.getElementById('status').value;
        const message = document.getElementById('message').value;

        if (!name || !status || !message) {
            alert("Semua kolom harus diisi!");
            return;
        }

        const newGreeting = {
            name: name,
            status: status,
            message: message,
            timestamp: new Date().toISOString()
        };

        // Simpan ke localStorage
        const greetings = getGreetings();
        greetings.push(newGreeting);
        saveGreetings(greetings);

        // Reset form
        rsvpForm.reset();

        // Muat ulang daftar ucapan
        renderGreetings();
        
        // Beri feedback ke user
        alert("Terima kasih, ucapan dan konfirmasi kehadiran Anda telah terkirim!");
    });

    // Muat ucapan saat halaman utama dimuat
    renderGreetings();

// --- 6. LOGIKA SMOOTH SCROLL UNTUK NAVIGASI ---
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});