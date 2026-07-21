// ==================== Shared Template Configurations ====================
// This file is used by both /detail/[id] and /dashboard/list-template/[id] pages

// ==================== Elite Wedding Template ====================
export const ELITE_WEDDING_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Italiana&family=Jost:wght@300;400&display=swap');
        :root { --bg: #0a0807; --bg-card: #14110d; --gold: #c9a961; --cream: #f5ecd9; --line: rgba(201,169,97,0.2); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: var(--bg); color: var(--cream); font-family: 'Jost', sans-serif; overflow-x: hidden; text-align: center; }
        h1,h2,h3,.serif { font-family: 'Cormorant Garamond', serif; font-weight: normal; }
        .italiana { font-family: 'Italiana', serif; }
        section { padding: 5rem 1.5rem; border-bottom: 1px solid var(--line); position: relative; }
        .gold-text { color: var(--gold); }
        .uppercase { text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.8rem; }
        #s-cover { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at center, #1a1611 0%, var(--bg) 100%); }
        .hero-names { font-size: 4rem; margin: 1rem 0; line-height: 1; text-shadow: 0 0 20px rgba(201,169,97,0.3); }
        .scroll-cue { position: absolute; bottom: 2rem; width: 1px; height: 50px; background: var(--gold); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity:0; } 50%{ opacity:1; } 100%{ opacity:0; } }
        .timer-grid { display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; }
        .time-box { background: var(--bg-card); border: 1px solid var(--line); padding: 1rem; width: 70px; }
        .time-val { font-size: 2rem; color: var(--gold); font-family: 'Cormorant Garamond'; }
        .time-label { font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; }
        .couple-photo { width: 100%; max-width: 300px; height: 400px; object-fit: cover; border-radius: 100rem 100rem 0 0; border: 1px solid var(--line); margin: 1rem auto; padding: 0.5rem; }
        .timeline-item { border-left: 1px solid var(--gold); padding-left: 1.5rem; margin-bottom: 2rem; text-align: left; position: relative; max-width: 400px; margin-inline: auto; }
        .timeline-item::before { content: ''; position: absolute; left: -4px; top: 0; width: 7px; height: 7px; background: var(--gold); border-radius: 50%; }
        .event-card,.gift-card { background: var(--bg-card); border: 1px solid var(--line); padding: 2rem; margin: 1rem auto; max-width: 400px; }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px,1fr)); gap: 0.5rem; max-width: 600px; margin: 2rem auto; }
        .gallery-grid img { width: 100%; aspect-ratio:1; object-fit: cover; filter: sepia(0.3) brightness(0.8); transition: filter 0.3s; }
        .gallery-grid img:hover { filter: sepia(0) brightness(1); }
        input,textarea { width:100%; background:transparent; border:none; border-bottom:1px solid var(--line); color:var(--cream); padding:0.5rem 0; margin-bottom:1rem; font-family:'Jost'; }
        input:focus,textarea:focus { outline:none; border-bottom-color:var(--gold); }
        .btn { background:transparent; border:1px solid var(--gold); color:var(--gold); padding:0.8rem 2rem; font-family:'Jost'; text-transform:uppercase; letter-spacing:0.2em; cursor:pointer; transition:0.3s; }
        .btn:hover { background:var(--gold); color:var(--bg); }
        #audio-btn { position:fixed; bottom:20px; right:20px; background:var(--bg-card); border:1px solid var(--gold); color:var(--gold); width:40px; height:40px; border-radius:50%; cursor:pointer; z-index:100; display:flex; justify-content:center; align-items:center; }
        @media (min-width:768px) { .couple-grid { display:flex; justify-content:center; gap:4rem; } .event-grid { display:flex; justify-content:center; gap:2rem; } }
    </style>
</head>
<body>
    <section id="s-cover">
        <div class="uppercase gold-text">The Wedding Of</div>
        <div class="hero-names italiana"><span id="e-bride-nick">Bride</span> <br>&<br> <span id="e-groom-nick">Groom</span></div>
        <div class="uppercase" id="e-date-text" style="margin-top:2rem;font-size:0.9rem;">Date</div>
        <div class="scroll-cue"></div>
    </section>
    <section id="s-countdown">
        <h2 class="serif gold-text" style="font-size:2rem;font-style:italic;">Counting Down</h2>
        <div class="timer-grid">
            <div class="time-box"><div class="time-val" id="t-days">00</div><div class="time-label">Days</div></div>
            <div class="time-box"><div class="time-val" id="t-hours">00</div><div class="time-label">Hrs</div></div>
            <div class="time-box"><div class="time-val" id="t-mins">00</div><div class="time-label">Min</div></div>
            <div class="time-box"><div class="time-val" id="t-secs">00</div><div class="time-label">Sec</div></div>
        </div>
    </section>
    <section id="s-couple">
        <h2 class="serif gold-text" style="font-size:2.5rem;" id="e-couple-title">Title</h2>
        <p style="max-width:500px;margin:1rem auto;line-height:1.6;" id="e-couple-sub">Subtitle</p>
        <div class="couple-grid">
            <div><img id="e-groom-photo" class="couple-photo" src="" alt="Groom"><div class="uppercase gold-text" id="e-groom-role">The Groom</div><h3 class="italiana" style="font-size:2rem;margin:0.5rem 0;" id="e-groom-full">Name</h3><p style="font-size:0.9rem;">Son of <br><span id="e-groom-dad"></span> & <span id="e-groom-mom"></span></p></div>
            <div><img id="e-bride-photo" class="couple-photo" src="" alt="Bride"><div class="uppercase gold-text" id="e-bride-role">The Bride</div><h3 class="italiana" style="font-size:2rem;margin:0.5rem 0;" id="e-bride-full">Name</h3><p style="font-size:0.9rem;">Daughter of <br><span id="e-bride-dad"></span> & <span id="e-bride-mom"></span></p></div>
        </div>
    </section>
    <section id="s-verse">
        <h2 class="italiana gold-text" style="font-size:2rem;margin-bottom:1rem;">Holy Verse</h2>
        <p class="serif" style="font-size:1.5rem;font-style:italic;max-width:600px;margin:0 auto;line-height:1.4;" id="e-verse-text">Verse</p>
        <div class="uppercase" style="margin-top:1rem;color:var(--gold);" id="e-verse-source">Source</div>
    </section>
    <section id="s-story">
        <h2 class="serif gold-text" style="font-size:2.5rem;margin-bottom:2rem;">Our Story</h2>
        <div class="timeline-item"><div class="uppercase gold-text" id="e-story-date-1">Date</div><h3 class="serif" style="font-size:1.5rem;" id="e-story-title-1">Title</h3><p id="e-story-desc-1">Desc</p></div>
        <div class="timeline-item"><div class="uppercase gold-text" id="e-story-date-2">Date</div><h3 class="serif" style="font-size:1.5rem;" id="e-story-title-2">Title</h3><p id="e-story-desc-2">Desc</p></div>
    </section>
    <section id="s-events">
        <h2 class="serif gold-text" style="font-size:2.5rem;margin-bottom:2rem;">Wedding Events</h2>
        <div class="event-grid">
            <div class="event-card"><h3 class="italiana" style="font-size:2rem;margin-bottom:1rem;">Akad Nikah</h3><div class="uppercase gold-text" id="e-akad-date">Date</div><p id="e-akad-time" style="margin:0.5rem 0;">Time</p><p id="e-akad-place" class="serif" style="font-size:1.2rem;">Place</p></div>
            <div class="event-card"><h3 class="italiana" style="font-size:2rem;margin-bottom:1rem;">Resepsi</h3><div class="uppercase gold-text" id="e-resepsi-date">Date</div><p id="e-resepsi-time" style="margin:0.5rem 0;">Time</p><p id="e-resepsi-place" class="serif" style="font-size:1.2rem;">Place</p></div>
        </div>
    </section>
    <section id="s-gallery">
        <h2 class="serif gold-text" style="font-size:2.5rem;">Memories</h2>
        <div class="gallery-grid"><img id="e-gal-1" src="" alt="G1"><img id="e-gal-2" src="" alt="G2"><img id="e-gal-3" src="" alt="G3"><img id="e-gal-4" src="" alt="G4"><img id="e-gal-5" src="" alt="G5"><img id="e-gal-6" src="" alt="G6"></div>
    </section>
    <section id="s-rsvp">
        <h2 class="italiana gold-text" style="font-size:2.5rem;" id="e-rsvp-title">RSVP</h2>
        <p style="margin-bottom:2rem;" id="e-rsvp-desc">Desc</p>
        <div class="event-card" style="text-align:left;"><input type="text" placeholder="Your Name"><input type="number" placeholder="Number of Guests"><textarea placeholder="Message"></textarea><button class="btn" style="width:100%;">Confirm Attendance</button></div>
    </section>
    <section id="s-gifts">
        <h2 class="serif gold-text" style="font-size:2.5rem;">Wedding Gift</h2>
        <div class="gift-card"><h3 class="uppercase" id="e-bank-name">Bank</h3><p class="italiana gold-text" style="font-size:2rem;margin:0.5rem 0;" id="e-bank-acc">Account</p><p class="uppercase" style="font-size:0.8rem;margin-bottom:1rem;" id="e-bank-holder">Holder</p><button class="btn" onclick="navigator.clipboard.writeText(document.getElementById('e-bank-acc').innerText)">Copy Number</button></div>
    </section>
    <section id="s-stream">
        <h2 class="serif gold-text" style="font-size:2.5rem;" id="e-stream-title">Live</h2>
        <p style="margin-bottom:2rem;max-width:400px;margin-inline:auto;" id="e-stream-desc">Desc</p>
        <button class="btn">Join Live Stream</button>
    </section>
    <section id="s-wishes">
        <h2 class="italiana gold-text" style="font-size:2.5rem;" id="e-wishes-title">Wishes</h2>
        <p style="margin-bottom:2rem;" id="e-wishes-desc">Desc</p>
        <div class="event-card" style="text-align:left;"><div style="background:rgba(255,255,255,0.02);padding:1rem;margin-bottom:1rem;border-left:2px solid var(--gold);"><strong class="gold-text">Sarah & John</strong><br><span class="serif" style="font-style:italic;">"Wishing you a lifetime of happiness!"</span></div><input type="text" placeholder="Name"><textarea placeholder="Your Wish"></textarea><button class="btn">Send Wish</button></div>
    </section>
    <section id="s-closing" style="padding-bottom:8rem;border-bottom:none;">
        <h2 class="italiana" style="font-size:4rem;margin-bottom:1rem;" id="e-closing-thanks">Terima Kasih</h2>
        <div class="gold-text" style="font-family:'Cormorant Garamond';font-size:3rem;font-style:italic;"><span id="e-bride-nick-close">B</span> & <span id="e-groom-nick-close">G</span></div>
        <div class="uppercase" style="margin-top:2rem;letter-spacing:0.3em;font-size:0.8rem;" id="e-closing-fam">Family</div>
    </section>
    <button id="audio-btn" onclick="toggleAudio()"><i class="fas fa-music"></i></button>
    <script>
        let audioCtx, osc1, osc2, gainNode, isPlaying = false;
        function initAudio() {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioCtx.createGain(); gainNode.gain.value = 0.05; gainNode.connect(audioCtx.destination);
            osc1 = audioCtx.createOscillator(); osc1.type = 'sine'; osc1.frequency.setValueAtTime(110, audioCtx.currentTime); osc1.connect(gainNode);
            osc2 = audioCtx.createOscillator(); osc2.type = 'triangle'; osc2.frequency.setValueAtTime(164.81, audioCtx.currentTime); osc2.connect(gainNode);
            osc1.start(); osc2.start();
        }
        function toggleAudio() {
            if (!audioCtx) initAudio();
            if (isPlaying) { audioCtx.suspend(); document.getElementById('audio-btn').style.background = 'var(--bg-card)'; }
            else { audioCtx.resume(); document.getElementById('audio-btn').style.background = 'var(--gold)'; document.getElementById('audio-btn').style.color = 'var(--bg)'; }
            isPlaying = !isPlaying;
        }
        let countdownInterval;
        function updateCountdown(targetStr) {
            clearInterval(countdownInterval); if(!targetStr) return;
            const targetDate = new Date(targetStr).getTime();
            countdownInterval = setInterval(() => {
                const now = new Date().getTime();
                const distance = targetDate - now;
                if (distance < 0) { clearInterval(countdownInterval); ['days','hours','mins','secs'].forEach(id => document.getElementById('t-'+id).innerText='00'); return; }
                document.getElementById('t-days').innerText = Math.floor(distance/(1000*60*60*24)).toString().padStart(2,'0');
                document.getElementById('t-hours').innerText = Math.floor((distance%(1000*60*60*24))/(1000*60*60)).toString().padStart(2,'0');
                document.getElementById('t-mins').innerText = Math.floor((distance%(1000*60*60))/(1000*60)).toString().padStart(2,'0');
                document.getElementById('t-secs').innerText = Math.floor((distance%(1000*60))/1000).toString().padStart(2,'0');
            }, 1000);
        }
        window.addEventListener('message', (e) => {
            if(e.data.type === 'UPDATE') {
                const data = e.data.payload;
                for (const key in data) {
                    const el = document.getElementById('e-' + key);
                    if (el) { if (el.tagName === 'IMG') el.src = data[key]; else el.innerText = data[key]; }
                }
                if(data['bride-nick']) document.getElementById('e-bride-nick-close').innerText = data['bride-nick'];
                if(data['groom-nick']) document.getElementById('e-groom-nick-close').innerText = data['groom-nick'];
                if(data['countdown-master']) updateCountdown(data['countdown-master']);
            }
        });
    </script>
</body>
</html>`;

// ==================== Honey Wedding Template ====================
export const HONEY_WEDDING_TEMPLATE = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sienna & Arka</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500&family=Italiana&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  :root {
    --bg: #0a0807; --bg-2: #14110d; --bg-3: #1d1813;
    --cream: #f5ecd9; --cream-dim: #d4cab3;
    --gold: #c9a961; --gold-bright: #e2c478; --gold-deep: #8a6f33;
    --muted: rgba(245, 236, 217, 0.5); --line: rgba(201, 169, 97, 0.2);
  }
  * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--cream); font-family: 'Jost', sans-serif; font-weight: 300; overflow-x: hidden; margin: 0; line-height: 1.6; letter-spacing: 0.02em; }
  .font-display { font-family: 'Cormorant Garamond', serif; }
  .font-italiana { font-family: 'Italiana', serif; }

  .letterbox-top, .letterbox-bottom { position: fixed; left: 0; right: 0; height: 30px; background: #000; z-index: 200; pointer-events: none; transition: height 0.6s ease; }
  .letterbox-top { top: 0; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
  .letterbox-bottom { bottom: 0; box-shadow: 0 -10px 40px rgba(0,0,0,0.8); }
  .grain { position: fixed; inset: -50%; width: 200%; height: 200%; pointer-events: none; z-index: 150; opacity: 0.06; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); animation: grainShift 0.8s steps(4) infinite; }
  @keyframes grainShift { 0% { transform: translate(0,0); } 25% { transform: translate(-5%, -5%); } 50% { transform: translate(5%, -3%); } 75% { transform: translate(-3%, 5%); } 100% { transform: translate(0,0); } }
  .vignette { position: fixed; inset: 0; pointer-events: none; z-index: 140; background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 90%, rgba(0,0,0,0.85) 100%); }
  .light-leak { position: fixed; inset: 0; pointer-events: none; z-index: 130; background: radial-gradient(circle at 20% 30%, rgba(201, 169, 97, 0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(201, 169, 97, 0.06), transparent 40%); mix-blend-mode: screen; }

  .hero { position: relative; height: 100vh; min-height: 700px; overflow: hidden; background: var(--bg); }
  .hero-scene { position: absolute; inset: 0; perspective: 1400px; transform-style: preserve-3d; }
  .layer { position: absolute; inset: 0; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1); will-change: transform; }
  .hero-bg { position: absolute; inset: -5%; background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(58, 42, 20, 0.4), transparent 70%), radial-gradient(ellipse 60% 80% at 30% 40%, rgba(40, 30, 18, 0.3), transparent 60%), linear-gradient(180deg, #0a0807 0%, #14110d 50%, #0a0807 100%); }
  .hero-bg::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle at 20% 20%, rgba(201, 169, 97, 0.04) 0%, transparent 2%), radial-gradient(circle at 80% 60%, rgba(201, 169, 97, 0.03) 0%, transparent 2%), radial-gradient(circle at 40% 80%, rgba(201, 169, 97, 0.04) 0%, transparent 2%); background-size: 300px 300px, 400px 400px, 350px 350px; animation: bgDrift 30s linear infinite; }
  @keyframes bgDrift { from { transform: translate(0,0); } to { transform: translate(-300px, -300px); } }
  .light-rays { position: absolute; top: -20%; left: 50%; width: 80%; height: 140%; transform: translateX(-50%); background: conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(201, 169, 97, 0.08) 10deg, transparent 20deg, rgba(201, 169, 97, 0.05) 35deg, transparent 50deg, rgba(201, 169, 97, 0.06) 65deg, transparent 80deg); filter: blur(40px); opacity: 0.7; animation: raysSway 12s ease-in-out infinite alternate; }
  @keyframes raysSway { from { transform: translateX(-50%) rotate(-3deg); opacity: 0.5; } to { transform: translateX(-45%) rotate(3deg); opacity: 0.8; } }
  .floral { position: absolute; color: var(--gold); pointer-events: none; }
  .floral-left { top: -5%; left: -8%; width: 35%; height: 110%; opacity: 0.7; }
  .floral-right { top: -5%; right: -8%; width: 35%; height: 110%; transform: scaleX(-1); opacity: 0.7; }
  .floral-front { bottom: -10%; left: 50%; transform: translateX(-50%); width: 80%; height: 50%; opacity: 0.4; filter: blur(2px); }
  .hero-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 1.5rem; }
  .hero-eyebrow { font-size: 0.7rem; letter-spacing: 0.6em; color: var(--gold); margin-bottom: 2rem; text-transform: uppercase; opacity: 0; animation: heroFadeIn 1.5s 1.5s forwards; }
  .hero-name { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-style: italic; font-size: clamp(4rem, 14vw, 13rem); line-height: 0.85; color: var(--cream); text-shadow: 0 0 80px rgba(201, 169, 97, 0.25), 0 0 30px rgba(0,0,0,0.5); letter-spacing: -0.02em; opacity: 0; animation: heroFadeIn 2s 1.8s forwards; }
  .hero-name .amp { display: block; font-size: 0.4em; color: var(--gold); margin: 0.1em 0; font-style: italic; text-shadow: 0 0 30px rgba(201, 169, 97, 0.5); }
  .hero-date { font-size: 0.75rem; letter-spacing: 0.5em; color: var(--gold); margin-top: 2.5rem; text-transform: uppercase; opacity: 0; animation: heroFadeIn 1.5s 2.5s forwards; }
  .hero-divider { width: 1px; height: 50px; background: linear-gradient(to bottom, transparent, var(--gold), transparent); margin: 1.5rem 0; opacity: 0; animation: heroFadeIn 1.5s 2.2s forwards; }
  @keyframes heroFadeIn { from { opacity: 0; transform: translateY(30px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
  .particle { position: absolute; background: var(--gold-bright); border-radius: 50%; pointer-events: none; box-shadow: 0 0 6px var(--gold); }
  .scroll-cue { position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 1rem; z-index: 10; opacity: 0; animation: heroFadeIn 1.5s 3s forwards; }
  .scroll-cue span { font-size: 0.65rem; letter-spacing: 0.4em; color: var(--gold); writing-mode: vertical-rl; text-orientation: mixed; }
  .scroll-cue .line { width: 1px; height: 60px; background: linear-gradient(to bottom, var(--gold), transparent); position: relative; overflow: hidden; }
  .scroll-cue .line::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 30%; background: var(--gold-bright); animation: scrollLine 2s ease-in-out infinite; }
  @keyframes scrollLine { 0% { top: -30%; } 100% { top: 100%; } }

  .music-toggle { position: fixed; top: 50px; right: 20px; width: 40px; height: 40px; border: 1px solid var(--line); background: rgba(10, 8, 7, 0.6); backdrop-filter: blur(10px); color: var(--gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 180; transition: all 0.4s; }
  .music-toggle:hover { border-color: var(--gold); transform: scale(1.1); }
  .music-toggle .bars { display: flex; gap: 2px; align-items: center; height: 12px; }
  .music-toggle .bars span { width: 2px; background: var(--gold); height: 4px; border-radius: 1px; }
  .music-toggle.playing .bars span { animation: bar 0.8s ease-in-out infinite alternate; }
  .music-toggle.playing .bars span:nth-child(1) { animation-delay: 0s; } .music-toggle.playing .bars span:nth-child(2) { animation-delay: 0.2s; } .music-toggle.playing .bars span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bar { from { height: 4px; } to { height: 12px; } }

  .side-nav { position: fixed; left: 30px; top: 50%; transform: translateY(-50%); z-index: 170; display: flex; flex-direction: column; gap: 1.2rem; }
  .side-nav a { width: 8px; height: 8px; border: 1px solid var(--gold); border-radius: 50%; transition: all 0.4s; position: relative; }
  .side-nav a.active { background: var(--gold); box-shadow: 0 0 10px var(--gold); }
  .side-nav a::after { content: attr(data-label); position: absolute; left: 20px; top: 50%; transform: translateY(-50%); font-size: 0.65rem; letter-spacing: 0.3em; color: var(--gold); text-transform: uppercase; opacity: 0; white-space: nowrap; transition: opacity 0.3s; }
  .side-nav a:hover::after { opacity: 1; }

  section { position: relative; padding: 8rem 2rem; z-index: 5; }
  .section-eyebrow { font-size: 0.7rem; letter-spacing: 0.5em; color: var(--gold); text-transform: uppercase; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; justify-content: center; }
  .section-eyebrow::before, .section-eyebrow::after { content: ''; width: 40px; height: 1px; background: var(--gold); opacity: 0.5; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-style: italic; font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1; color: var(--cream); text-align: center; margin-bottom: 1rem; }
  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 1.2s, transform 1.2s; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.2s; } .reveal-delay-2 { transition-delay: 0.4s; } .reveal-delay-3 { transition-delay: 0.6s; }

  .opening { text-align: center; max-width: 800px; margin: 0 auto; }
  .opening .bismillah { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 2rem; color: var(--gold); margin-bottom: 2rem; }
  .opening .verse { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.4rem; line-height: 1.8; color: var(--cream-dim); margin-bottom: 1.5rem; }
  .opening .verse-trans { font-size: 0.95rem; color: var(--muted); line-height: 1.8; max-width: 600px; margin: 0 auto; }
  .opening .verse-source { margin-top: 1.5rem; font-size: 0.75rem; letter-spacing: 0.3em; color: var(--gold); text-transform: uppercase; }

  .couple-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; max-width: 1200px; margin: 0 auto; }
  .couple-card { text-align: center; perspective: 1000px; }
  .couple-card .photo-wrap { position: relative; width: 280px; height: 360px; margin: 0 auto 2rem; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1); cursor: pointer; }
  .couple-card .photo-wrap::before { content: ''; position: absolute; inset: -15px; border: 1px solid var(--gold); opacity: 0.3; transform: translateZ(-20px); }
  .couple-card .photo-wrap::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(10, 8, 7, 0.8) 100%); z-index: 2; }
  .couple-card .photo { width: 100%; height: 100%; object-fit: cover; filter: sepia(0.3) contrast(1.05) brightness(0.85); transition: filter 0.6s; }
  .couple-card:hover .photo-wrap { transform: rotateY(-8deg) rotateX(3deg) translateZ(20px); }
  .couple-card:hover .photo { filter: sepia(0.1) contrast(1.1) brightness(0.95); }
  .couple-card .role { font-size: 0.7rem; letter-spacing: 0.4em; color: var(--gold); text-transform: uppercase; margin-bottom: 0.8rem; }
  .couple-card .name { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 2.5rem; color: var(--cream); margin-bottom: 0.5rem; line-height: 1; }
  .couple-card .fullname { font-size: 0.75rem; letter-spacing: 0.2em; color: var(--cream-dim); text-transform: uppercase; margin-bottom: 1.5rem; }
  .couple-card .parents { font-size: 0.85rem; color: var(--muted); line-height: 1.7; }
  .couple-card .parents .label { color: var(--gold); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.3rem; display: block; }
  .couple-amp { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 5rem; color: var(--gold); text-shadow: 0 0 30px rgba(201, 169, 97, 0.4); }

  .story { position: relative; }
  .story-bg-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: 'Italiana', serif; font-size: 30vw; color: rgba(201, 169, 97, 0.03); pointer-events: none; white-space: nowrap; z-index: -1; letter-spacing: -0.05em; }
  .story-quote { text-align: center; max-width: 900px; margin: 0 auto 6rem; position: relative; }
  .story-quote .mark { font-family: 'Cormorant Garamond', serif; font-size: 8rem; color: var(--gold); opacity: 0.2; line-height: 0.5; margin-bottom: 1rem; }
  .story-quote p { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.8rem; line-height: 1.5; color: var(--cream); }
  .story-quote .author { margin-top: 2rem; font-size: 0.75rem; letter-spacing: 0.4em; color: var(--gold); text-transform: uppercase; }
  .timeline { max-width: 900px; margin: 0 auto; position: relative; }
  .timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, var(--gold) 10%, var(--gold) 90%, transparent); opacity: 0.3; }
  .timeline-item { display: grid; grid-template-columns: 1fr 80px 1fr; gap: 2rem; margin-bottom: 4rem; align-items: center; }
  .timeline-item:nth-child(even) .timeline-content { grid-column: 3; text-align: left; }
  .timeline-item:nth-child(odd) .timeline-content { grid-column: 1; text-align: right; }
  .timeline-content { padding: 1.5rem; }
  .timeline-content .date { font-size: 0.7rem; letter-spacing: 0.3em; color: var(--gold); text-transform: uppercase; margin-bottom: 0.5rem; }
  .timeline-content h3 { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.8rem; color: var(--cream); margin-bottom: 0.8rem; }
  .timeline-content p { font-size: 0.9rem; color: var(--muted); line-height: 1.7; }
  .timeline-dot { width: 16px; height: 16px; border: 1px solid var(--gold); background: var(--bg); border-radius: 50%; margin: 0 auto; position: relative; z-index: 2; }
  .timeline-dot::after { content: ''; position: absolute; inset: 4px; background: var(--gold); border-radius: 50%; box-shadow: 0 0 10px var(--gold); }

  .events-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, rgba(58, 42, 20, 0.2), transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(58, 42, 20, 0.15), transparent 50%); z-index: -1; }
  .countdown { display: flex; justify-content: center; gap: 2rem; margin-bottom: 5rem; flex-wrap: wrap; }
  .countdown-item { text-align: center; min-width: 80px; }
  .countdown-item .num { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 3.5rem; color: var(--gold); line-height: 1; text-shadow: 0 0 20px rgba(201, 169, 97, 0.3); }
  .countdown-item .label { font-size: 0.65rem; letter-spacing: 0.3em; color: var(--muted); text-transform: uppercase; margin-top: 0.5rem; }
  .event-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 1100px; margin: 0 auto; }
  .event-card { position: relative; padding: 3rem 2rem; border: 1px solid var(--line); background: linear-gradient(180deg, rgba(20, 17, 13, 0.6), rgba(10, 8, 7, 0.6)); backdrop-filter: blur(10px); text-align: center; transition: all 0.6s; overflow: hidden; }
  .event-card::before { content: ''; position: absolute; top: 0; left: 50%; width: 60%; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); transform: translateX(-50%); }
  .event-card::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(201, 169, 97, 0.08), transparent 60%); opacity: 0; transition: opacity 0.6s; }
  .event-card:hover { transform: translateY(-8px); border-color: var(--gold); }
  .event-card:hover::after { opacity: 1; }
  .event-card .icon { font-size: 1.5rem; color: var(--gold); margin-bottom: 1.5rem; opacity: 0.8; }
  .event-card .type { font-size: 0.7rem; letter-spacing: 0.4em; color: var(--gold); text-transform: uppercase; margin-bottom: 1rem; }
  .event-card .title { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 2.2rem; color: var(--cream); margin-bottom: 1.5rem; line-height: 1.1; }
  .event-card .detail { margin-bottom: 1rem; }
  .event-card .detail .label { font-size: 0.65rem; letter-spacing: 0.3em; color: var(--gold); text-transform: uppercase; margin-bottom: 0.3rem; }
  .event-card .detail .value { font-size: 0.95rem; color: var(--cream-dim); font-family: 'Cormorant Garamond', serif; }
  .event-card .location-btn { margin-top: 1.5rem; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.5rem; border: 1px solid var(--gold); color: var(--gold); font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; transition: all 0.4s; background: transparent; text-decoration: none; }
  .event-card .location-btn:hover { background: var(--gold); color: var(--bg); }

  .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; max-width: 1200px; margin: 0 auto; }
  .gallery-item { position: relative; overflow: hidden; cursor: pointer; aspect-ratio: 3/4; transition: transform 0.6s; }
  .gallery-item:nth-child(2), .gallery-item:nth-child(5) { aspect-ratio: 3/4; margin-top: 2rem; }
  .gallery-item img { width: 100%; height: 100%; object-fit: cover; filter: sepia(0.25) contrast(1.05) brightness(0.85); transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
  .gallery-item::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(10, 8, 7, 0.7)); opacity: 0; transition: opacity 0.6s; }
  .gallery-item:hover img { transform: scale(1.1); filter: sepia(0) contrast(1.1) brightness(1); }
  .gallery-item:hover::after { opacity: 1; } .gallery-item:hover { transform: translateY(-5px); }

  .footer { text-align: center; padding: 6rem 2rem 4rem; position: relative; }
  .footer .thanks { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(2rem, 5vw, 3.5rem); color: var(--cream); margin-bottom: 2rem; line-height: 1.2; }
  .footer .closing { font-size: 0.9rem; color: var(--muted); max-width: 500px; margin: 0 auto 3rem; line-height: 1.8; }
  .footer .monogram { font-family: 'Italiana', serif; font-size: 3rem; color: var(--gold); margin-bottom: 1rem; }
  .footer .monogram .amp { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 0.5em; vertical-align: middle; margin: 0 0.1em; }
  .footer .signatures { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.8rem; color: var(--cream); margin-bottom: 0.5rem; }
  .footer .families { font-size: 0.75rem; letter-spacing: 0.2em; color: var(--muted); text-transform: uppercase; }
  .footer .copyright { margin-top: 4rem; font-size: 0.65rem; letter-spacing: 0.3em; color: var(--gold-deep); text-transform: uppercase; }

  @media (max-width: 900px) {
    .couple-grid { grid-template-columns: 1fr; gap: 4rem; }
    .couple-amp { font-size: 3rem; }
    .event-grid { grid-template-columns: 1fr; }
    .gallery-grid { grid-template-columns: repeat(2, 1fr); }
    .timeline::before { left: 20px; }
    .timeline-item { grid-template-columns: 40px 1fr; }
    .timeline-item:nth-child(even) .timeline-content, .timeline-item:nth-child(odd) .timeline-content { grid-column: 2; text-align: left; }
    .side-nav { display: none; }
    .music-toggle { top: 60px; right: 15px; }
    section { padding: 5rem 1.5rem; }
    .letterbox-top, .letterbox-bottom { height: 30px; }
    .scroll-cue { bottom: 50px; }
  }
</style>
</head>
<body>

<div class="letterbox-top"></div>
<div class="letterbox-bottom"></div>
<div class="grain"></div>
<div class="vignette"></div>
<div class="light-leak"></div>

<button class="music-toggle" id="musicToggle"><div class="bars"><span></span><span></span><span></span></div></button>

<nav class="side-nav">
  <a href="#hero" data-label="Beranda" class="active"></a>
  <a href="#opening" data-label="Ayat"></a>
  <a href="#couple" data-label="Mempelai"></a>
  <a href="#story" data-label="Kisah"></a>
  <a href="#events" data-label="Acara"></a>
  <a href="#gallery" data-label="Galeri"></a>
  <a href="#rsvp" data-label="RSVP"></a>
</nav>

<section class="hero" id="hero">
  <div class="hero-scene" id="heroScene">
    <div class="layer" data-depth="0.05"><div class="hero-bg"></div></div>
    <div class="layer" data-depth="0.15"><div class="light-rays"></div></div>
    <div class="layer" data-depth="0.25">
      <svg class="floral floral-left" viewBox="0 0 200 600" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e2c478"/><stop offset="100%" stop-color="#8a6f33"/></linearGradient></defs><g stroke="url(#leafGrad1)" fill="none" stroke-width="1" stroke-linecap="round"><path d="M100,0 C85,80 115,160 90,240 C75,320 110,400 95,480 C85,540 105,600 100,600"/><path d="M95,60 C65,55 40,70 30,95 C55,92 80,80 95,72 Z" fill="url(#leafGrad1)" opacity="0.7"/><path d="M95,60 C125,55 150,70 160,95 C135,92 110,80 95,72 Z" fill="url(#leafGrad1)" opacity="0.7"/><path d="M90,140 C60,135 35,150 25,175 C50,172 75,160 90,152 Z" fill="url(#leafGrad1)" opacity="0.65"/><path d="M90,140 C120,135 145,150 155,175 C130,172 105,160 90,152 Z" fill="url(#leafGrad1)" opacity="0.65"/><path d="M95,230 C65,225 40,240 30,265 C55,262 80,250 95,242 Z" fill="url(#leafGrad1)" opacity="0.6"/><path d="M95,230 C125,225 150,240 160,265 C135,262 110,250 95,242 Z" fill="url(#leafGrad1)" opacity="0.6"/><circle cx="30" cy="95" r="3" fill="#e2c478" opacity="0.8"/><circle cx="160" cy="95" r="3" fill="#e2c478" opacity="0.8"/></g></svg>
      <svg class="floral floral-right" viewBox="0 0 200 600" preserveAspectRatio="xMidYMid meet"><g stroke="url(#leafGrad1)" fill="none" stroke-width="1" stroke-linecap="round"><path d="M100,0 C85,80 115,160 90,240 C75,320 110,400 95,480 C85,540 105,600 100,600"/><path d="M95,60 C65,55 40,70 30,95 C55,92 80,80 95,72 Z" fill="url(#leafGrad1)" opacity="0.7"/><path d="M95,60 C125,55 150,70 160,95 C135,92 110,80 95,72 Z" fill="url(#leafGrad1)" opacity="0.7"/><path d="M90,140 C60,135 35,150 25,175 C50,172 75,160 90,152 Z" fill="url(#leafGrad1)" opacity="0.65"/><path d="M90,140 C120,135 145,150 155,175 C130,172 105,160 90,152 Z" fill="url(#leafGrad1)" opacity="0.65"/><path d="M95,230 C65,225 40,240 30,265 C55,262 80,250 95,242 Z" fill="url(#leafGrad1)" opacity="0.6"/><path d="M95,230 C125,225 150,240 160,265 C135,262 110,250 95,242 Z" fill="url(#leafGrad1)" opacity="0.6"/><circle cx="30" cy="95" r="3" fill="#e2c478" opacity="0.8"/><circle cx="160" cy="95" r="3" fill="#e2c478" opacity="0.8"/></g></svg>
    </div>
    <div class="layer" data-depth="0.45">
      <div class="hero-content">
        <div class="hero-eyebrow">The Wedding of</div>
        <h1 class="hero-name"><span id="e-bride-name">Sienna</span><span class="amp">&amp;</span><span id="e-groom-name">Arka</span></h1>
        <div class="hero-divider"></div>
        <div class="hero-date" id="e-hero-date">20 . 12 . 2025</div>
      </div>
    </div>
    <div class="layer" data-depth="0.7">
      <svg class="floral floral-front" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet"><g stroke="#e2c478" fill="none" stroke-width="1.2" stroke-linecap="round" opacity="0.6"><path d="M0,250 C100,200 200,220 300,180 C400,140 500,160 600,130 C700,100 800,120 800,120"/><path d="M0,280 C150,240 280,260 400,220 C520,180 650,200 800,170"/><path d="M150,225 C140,210 120,205 105,215 C115,225 135,230 150,225 Z" fill="#c9a961" opacity="0.5"/><path d="M280,195 C270,180 250,175 235,185 C245,195 265,200 280,195 Z" fill="#c9a961" opacity="0.5"/><path d="M450,155 C440,140 420,135 405,145 C415,155 435,160 450,155 Z" fill="#c9a961" opacity="0.5"/><path d="M620,125 C610,110 590,105 575,115 C585,125 605,130 620,125 Z" fill="#c9a961" opacity="0.5"/><circle cx="105" cy="215" r="3" fill="#e2c478"/><circle cx="405" cy="145" r="3" fill="#e2c478"/><circle cx="575" cy="115" r="3" fill="#e2c478"/></g></svg>
    </div>
    <div class="layer" data-depth="0.9" id="particleLayer"></div>
  </div>
  <div class="scroll-cue"><span>SCROLL</span><div class="line"></div></div>
</section>

<section id="opening">
  <div class="opening reveal">
    <div class="bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
    <p class="verse">"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."</p>
    <p class="verse-trans">Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.</p>
    <div class="verse-source">— Q.S. Ar-Rum : 21 —</div>
  </div>
</section>

<section id="couple">
  <div class="reveal"><div class="section-eyebrow">The Couple</div><h2 class="section-title">Bersatu dengan Cinta</h2></div>
  <div class="couple-grid mt-16">
    <div class="couple-card reveal reveal-delay-1">
      <div class="photo-wrap"><img id="e-bride-photo" src="https://picsum.photos/seed/bride-sienna-wedding/600/800.jpg" alt="Sienna" class="photo"></div>
      <div class="role">The Bride</div>
      <div class="name" id="e-bride-name2">Sienna</div>
      <div class="fullname" id="e-bride-full">Sienna Pradipta Reswari</div>
      <div class="parents"><span class="label">Putri Pertama Dari</span><span id="e-bride-parents">Bapak Surya Pratama, S.E.<br>& Ibu Lestari Wulandari, S.KM.</span></div>
    </div>
    <div class="couple-amp reveal reveal-delay-2">&amp;</div>
    <div class="couple-card reveal reveal-delay-3">
      <div class="photo-wrap"><img id="e-groom-photo" src="https://picsum.photos/seed/groom-arka-wedding/600/800.jpg" alt="Arka" class="photo"></div>
      <div class="role">The Groom</div>
      <div class="name" id="e-groom-name2">Arka</div>
      <div class="fullname" id="e-groom-full">Arka Mahesa Wijaya</div>
      <div class="parents"><span class="label">Putra Kedua Dari</span><span id="e-groom-parents">Bapak Dr. Wijaya Kusuma, M.Sc.<br>& Ibu Maharani Anggraini, S.Pd.</span></div>
    </div>
  </div>
</section>

<section id="story" class="story">
  <div class="story-bg-text">FOREVER</div>
  <div class="story-quote reveal">
    <div class="mark">"</div>
    <p>Cinta tidak ditakdirkan untuk dimulai, melainkan untuk bertumbuh. Dari pertemuan, menjadi kenalan, dari kenalan menjadi pengertian, dan dari pengertian menjadi komitmen seumur hidup.</p>
    <div class="author">— Awal Perjalanan Kami —</div>
  </div>
  <div class="timeline">
    <div class="timeline-item reveal"><div class="timeline-content"><div class="date">Maret 2020</div><h3>Pertemuan Pertama</h3><p>Sebuah pertemuan tak sengaja di sebuah pameran seni kecil di Jakarta. Sebuah obrolan singkat tentang karya seni yang menjadi awal dari segalanya.</p></div><div class="timeline-dot"></div><div></div></div>
    <div class="timeline-item reveal"><div></div><div class="timeline-dot"></div><div class="timeline-content"><div class="date">Juli 2021</div><h3>Ikatan Janji</h3><p>Setelah setahun lebih saling mengenal, kami memutuskan untuk melangkah serius. Dia adalah tempat pulang yang aku cari selama ini.</p></div></div>
    <div class="timeline-item reveal"><div class="timeline-content"><div class="date">Februari 2024</div><h3>Lamaran</h3><p>Di tengah hujan rintik dan kota yang menyala, Arka berlutut dan mengajakku menapaki babak baru. Tentu saja, ku-iyakan.</p></div><div class="timeline-dot"></div><div></div></div>
    <div class="timeline-item reveal"><div></div><div class="timeline-dot"></div><div class="timeline-content"><div class="date">Desember 2025</div><h3>Hari Bahagia</h3><p>Dan kini, di hadapan keluarga, sahabat, dan Tuhan, kami akan mengikat janji suci. Untuk setia, untuk bahagia, untuk selamanya.</p></div></div>
  </div>
</section>

<section id="events">
  <div class="events-bg"></div>
  <div class="reveal"><div class="section-eyebrow">Save The Date</div><h2 class="section-title">Hitung Mundur</h2></div>
  <div class="countdown reveal reveal-delay-1" id="countdown">
    <div class="countdown-item"><div class="num" id="cd-days">00</div><div class="label">Hari</div></div>
    <div class="countdown-item"><div class="num" id="cd-hours">00</div><div class="label">Jam</div></div>
    <div class="countdown-item"><div class="num" id="cd-mins">00</div><div class="label">Menit</div></div>
    <div class="countdown-item"><div class="num" id="cd-secs">00</div><div class="label">Detik</div></div>
  </div>
  <div class="event-grid">
    <div class="event-card reveal reveal-delay-2">
      <div class="icon"><i class="fas fa-rings-wedding"></i></div>
      <div class="type">Akad Nikah</div>
      <h3 class="title">Resepsi Akad</h3>
      <div class="detail"><div class="label">Hari / Tanggal</div><div class="value" id="e-akad-date">Sabtu, 20 Desember 2025</div></div>
      <div class="detail"><div class="label">Waktu</div><div class="value" id="e-akad-time">08.00 — 10.00 WIB</div></div>
      <div class="detail"><div class="label">Tempat</div><div class="value" id="e-akad-place">Masjid Agung Al-Azhar<br>Jakarta Selatan</div></div>
      <a class="location-btn" id="e-akad-maps" href="https://www.google.com/maps/search/?api=1&query=Masjid%20Agung%20Al-Azhar%20Jakarta" target="_blank"><i class="fas fa-map-marker-alt"></i> Lihat Lokasi</a>
    </div>
    <div class="event-card reveal reveal-delay-3">
      <div class="icon"><i class="fas fa-glass-cheers"></i></div>
      <div class="type">Resepsi</div>
      <h3 class="title">Walimatul Ursy</h3>
      <div class="detail"><div class="label">Hari / Tanggal</div><div class="value" id="e-resepsi-date">Sabtu, 20 Desember 2025</div></div>
      <div class="detail"><div class="label">Waktu</div><div class="value" id="e-resepsi-time">11.00 — 14.00 WIB</div></div>
      <div class="detail"><div class="label">Tempat</div><div class="value" id="e-resepsi-place">The Ritz-Carlton Ballroom<br>Jakarta Selatan</div></div>
      <a class="location-btn" id="e-resepsi-maps" href="https://www.google.com/maps/search/?api=1&query=The%20Ritz-Carlton%20Jakarta" target="_blank"><i class="fas fa-map-marker-alt"></i> Lihat Lokasi</a>
    </div>
  </div>
</section>

<section id="gallery">
  <div class="reveal"><div class="section-eyebrow">Our Moments</div><h2 class="section-title">Galeri Kenangan</h2></div>
  <div class="gallery-grid mt-16">
    <div class="gallery-item reveal"><img id="e-gallery-1" src="https://picsum.photos/seed/wedding-gallery-1/600/800.jpg" alt="Gallery 1"></div>
    <div class="gallery-item reveal reveal-delay-1"><img id="e-gallery-2" src="https://picsum.photos/seed/wedding-gallery-2/600/800.jpg" alt="Gallery 2"></div>
    <div class="gallery-item reveal reveal-delay-2"><img id="e-gallery-3" src="https://picsum.photos/seed/wedding-gallery-3/600/800.jpg" alt="Gallery 3"></div>
    <div class="gallery-item reveal"><img id="e-gallery-4" src="https://picsum.photos/seed/wedding-gallery-4/600/800.jpg" alt="Gallery 4"></div>
    <div class="gallery-item reveal reveal-delay-1"><img id="e-gallery-5" src="https://picsum.photos/seed/wedding-gallery-5/600/800.jpg" alt="Gallery 5"></div>
    <div class="gallery-item reveal reveal-delay-2"><img id="e-gallery-6" src="https://picsum.photos/seed/wedding-gallery-6/600/800.jpg" alt="Gallery 6"></div>
  </div>
</section>

<footer class="footer">
  <div class="reveal">
    <p class="thanks">Terima Kasih</p>
    <p class="closing">Atas doa, restu, dan kehadiran Anda dalam hari bahagia kami. Kami menantikan momen istimewa bersama Anda.</p>
    <div class="monogram">S<span class="amp">&amp;</span>A</div>
    <div class="signatures" id="e-footer-names">Sienna &amp; Arka</div>
    <div class="families">Keluarga Besar Pradipta &amp; Wijaya</div>
    <div class="copyright">Made With Love · 2025</div>
  </div>
</footer>

<script>
  // Parallax
  const heroScene = document.getElementById('heroScene');
  const heroLayers = heroScene.querySelectorAll('.layer');
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0, isHeroVisible = true;
  document.addEventListener('mousemove', (e) => {
    if (!isHeroVisible) return;
    targetX = (e.clientX / window.innerWidth - 0.5);
    targetY = (e.clientY / window.innerHeight - 0.5);
  });
  function animateParallax() {
    mouseX += (targetX - mouseX) * 0.08; mouseY += (targetY - mouseY) * 0.08;
    heroLayers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth);
      const tx = mouseX * depth * 50; const ty = mouseY * depth * 50; const tz = depth * 30;
      const rx = -mouseY * depth * 6; const ry = mouseX * depth * 6;
      layer.style.transform = \`translate3d(\${tx}px, \${ty}px, \${tz}px) rotateX(\${rx}deg) rotateY(\${ry}deg)\`;
    });
    requestAnimationFrame(animateParallax);
  }
  animateParallax();
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
      isHeroVisible = true;
      heroScene.style.opacity = 1 - (scrolled / window.innerHeight) * 1.3;
      heroScene.style.transform = \`translateY(\${scrolled * 0.4}px) scale(\${1 + (scrolled / window.innerHeight) * 0.1})\`;
    } else { isHeroVisible = false; }
  });

  // Particles
  const particleLayer = document.getElementById('particleLayer');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div'); p.className = 'particle';
    p.style.width = p.style.height = (Math.random() * 3 + 1) + 'px';
    p.style.left = Math.random() * 100 + '%'; p.style.top = Math.random() * 100 + '%';
    p.style.opacity = Math.random() * 0.6 + 0.2;
    p.style.animation = \`floatP \${Math.random() * 10 + 8}s linear infinite\`;
    particleLayer.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = \`@keyframes floatP { 0% { transform: translate(0, 0); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(\${Math.random() * 200 - 100}px, -200px); opacity: 0; } }\`;
  document.head.appendChild(style);

  // Reveal on scroll
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Side Nav Active
  const sideNavLinks = document.querySelectorAll('.side-nav a');
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sideNavLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(section => sectionObserver.observe(section));

  // Countdown
  let weddingDate = new Date('2025-12-20T08:00:00+07:00').getTime();
  function updateCountdown() {
    const distance = weddingDate - new Date().getTime();
    if (distance < 0) return;
    document.getElementById('cd-days').textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
  }
  updateCountdown(); setInterval(updateCountdown, 1000);

  // Couple Card Tilt
  document.querySelectorAll('.couple-card .photo-wrap').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = \`rotateY(\${x * 16}deg) rotateX(\${-y * 12}deg) translateZ(20px)\`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // Expose update function for parent window
  window.updateInvitation = function(data) {
    if (data.brideName) { document.getElementById('e-bride-name').textContent = data.brideName; document.getElementById('e-bride-name2').textContent = data.brideName; }
    if (data.groomName) { document.getElementById('e-groom-name').textContent = data.groomName; document.getElementById('e-groom-name2').textContent = data.groomName; }
    if (data.heroDate) document.getElementById('e-hero-date').textContent = data.heroDate;
    if (data.brideFull) document.getElementById('e-bride-full').textContent = data.brideFull;
    if (data.groomFull) document.getElementById('e-groom-full').textContent = data.groomFull;
    if (data.brideParents) document.getElementById('e-bride-parents').innerHTML = data.brideParents;
    if (data.groomParents) document.getElementById('e-groom-parents').innerHTML = data.groomParents;
    if (data.bridePhoto) document.getElementById('e-bride-photo').src = data.bridePhoto;
    if (data.groomPhoto) document.getElementById('e-groom-photo').src = data.groomPhoto;
    if (data.akadDate) document.getElementById('e-akad-date').textContent = data.akadDate;
    if (data.akadTime) document.getElementById('e-akad-time').textContent = data.akadTime;
    if (data.akadPlace) document.getElementById('e-akad-place').innerHTML = data.akadPlace;
    if (data.akadMaps) document.getElementById('e-akad-maps').href = \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(data.akadMaps)}\`;
    if (data.resepsiDate) document.getElementById('e-resepsi-date').textContent = data.resepsiDate;
    if (data.resepsiTime) document.getElementById('e-resepsi-time').textContent = data.resepsiTime;
    if (data.resepsiPlace) document.getElementById('e-resepsi-place').innerHTML = data.resepsiPlace;
    if (data.resepsiMaps) document.getElementById('e-resepsi-maps').href = \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(data.resepsiMaps)}\`;
    if (data.countdownDate) { weddingDate = new Date(data.countdownDate).getTime(); updateCountdown(); }
    if (data.gallery1) document.getElementById('e-gallery-1').src = data.gallery1;
    if (data.gallery2) document.getElementById('e-gallery-2').src = data.gallery2;
    if (data.gallery3) document.getElementById('e-gallery-3').src = data.gallery3;
    if (data.gallery4) document.getElementById('e-gallery-4').src = data.gallery4;
    if (data.gallery5) document.getElementById('e-gallery-5').src = data.gallery5;
    if (data.gallery6) document.getElementById('e-gallery-6').src = data.gallery6;
    if (data.brideName && data.groomName) document.getElementById('e-footer-names').innerHTML = \`\${data.brideName} &amp; \${data.groomName}\`;
  };

  // Listen for postMessage from parent (for detail page preview)
  window.addEventListener('message', function(e) {
    if (e.data.type === 'UPDATE') {
      if (window.updateInvitation) window.updateInvitation(e.data.payload);
    }
  });
</script>
</body>
</html>`;

// ==================== Java Batik Template ====================
export const JAVA_BATIK_TEMPLATE = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Undangan Pernikahan - Baskoro & Sekarwangi</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500&family=Prata&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  :root {
    --bg: #1a120b;
    --bg-2: #241810;
    --bg-3: #2e1f14;
    --cream: #f7eed8;
    --cream-dim: #d4cab3;
    --gold: #c5a059;
    --gold-bright: #e6c87a;
    --gold-deep: #8a6f33;
    --muted: rgba(247, 238, 216, 0.6);
    --line: rgba(197, 160, 89, 0.3);
  }

  * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    color: var(--cream);
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    margin: 0;
    overflow-x: hidden;
    line-height: 1.6;
  }

  /* Global Text Shadow for Readability */
  h1, h2, h3, p, span, div { text-shadow: 0 2px 15px rgba(0, 0, 0, 0.8); }

  .font-display { font-family: 'Prata', serif; }
  .font-cinzel { font-family: 'Cinzel', serif; }
  .font-body { font-family: 'Jost', sans-serif; }

  /* ============ FRAMEWORK SECTION ============ */
  .base-section {
    position: relative;
    overflow: hidden;
    padding: 8rem 1.5rem;
    z-index: 1;
  }

  /* ============ SECTION GANJIL (1, 3, 5, 7, 9, 11) - PARALLAX AKTIF ============ */
  .parallax-section {
    perspective: 1000px;
  }
  .parallax-bg {
    position: absolute;
    inset: -15%;
    z-index: 0;
    background-size: cover;
    background-position: center;
    filter: sepia(0.6) brightness(0.25) contrast(1.1);
    will-change: transform;
  }
  .parallax-pattern {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.1;
    background-size: 80px 80px;
    will-change: transform;
  }
  .parallax-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: linear-gradient(180deg, var(--bg) 0%, transparent 20%, transparent 80%, var(--bg) 100%);
  }
  .parallax-content {
    position: relative;
    z-index: 10;
    max-width: 900px;
    margin: 0 auto;
    transform-style: preserve-3d;
    transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
    will-change: transform;
  }
  .ornate-frame-parallax {
    position: absolute;
    top: 30px; left: 30px; right: 30px; bottom: 30px;
    z-index: 3;
    pointer-events: none;
    border: 1px solid var(--gold);
    opacity: 0.4;
    will-change: transform;
  }
  .ornate-frame-parallax::before {
    content: '';
    position: absolute;
    top: 6px; left: 6px; right: 6px; bottom: 6px;
    border: 1px solid var(--gold);
    opacity: 0.5;
  }

  /* ============ SECTION GENAP (2, 4, 6, 8, 10, 12) - FLAT / SOLID ============ */
  .solid-section {
    background: linear-gradient(180deg, #0f0a06 0%, #1a120b 50%, #0f0a06 100%);
  }
  .solid-pattern {
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.04;
    background-size: 80px 80px;
    pointer-events: none;
  }
  .solid-content {
    position: relative;
    z-index: 10;
    max-width: 900px;
    margin: 0 auto;
  }
  .ornate-frame-solid {
    position: absolute;
    top: 30px; left: 30px; right: 30px; bottom: 30px;
    z-index: 2;
    pointer-events: none;
    border: 1px solid var(--gold);
    opacity: 0.2;
  }
  .ornate-frame-solid::before {
    content: '';
    position: absolute;
    top: 6px; left: 6px; right: 6px; bottom: 6px;
    border: 1px solid var(--gold);
    opacity: 0.3;
  }

  /* ============ ORNAMENT CORNERS ============ */
  .corner-ornament {
    position: absolute;
    width: 60px;
    height: 60px;
    color: var(--gold);
    z-index: 4;
  }
  .corner-ornament.tl { top: 10px; left: 10px; }
  .corner-ornament.tr { top: 10px; right: 10px; transform: scaleX(-1); }
  .corner-ornament.bl { bottom: 10px; left: 10px; transform: scaleY(-1); }
  .corner-ornament.br { bottom: 10px; right: 10px; transform: scale(-1, -1); }

  /* Batik Patterns */
  .pattern-kawung { background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c5a059' stroke-width='1'%3E%3Cellipse cx='40' cy='20' rx='12' ry='18'/%3E%3Cellipse cx='40' cy='60' rx='12' ry='18'/%3E%3Cellipse cx='20' cy='40' rx='18' ry='12'/%3E%3Cellipse cx='60' cy='40' rx='18' ry='12'/%3E%3Ccircle cx='40' cy='40' r='4'/%3E%3C/g%3E%3C/svg%3E"); }
  .pattern-parang { background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c5a059' stroke-width='1'%3E%3Cpath d='M0 30 Q15 10 30 30 T60 30'/%3E%3Cpath d='M0 45 Q15 25 30 45 T60 45'/%3E%3Cpath d='M0 15 Q15 -5 30 15 T60 15'/%3E%3C/g%3E%3C/svg%3E"); }
  .pattern-megamendung { background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c5a059' stroke-width='0.8'%3E%3Cpath d='M50 10 Q70 20 80 40 Q60 30 50 50 Q40 30 20 40 Q30 20 50 10 Z'/%3E%3Cpath d='M50 50 Q70 60 80 80 Q60 70 50 90 Q40 70 20 80 Q30 60 50 50 Z'/%3E%3C/g%3E%3C/svg%3E"); }
  .pattern-tumpal { background-image: url("data:image/svg+xml,%3Csvg width='40' height='80' viewBox='0 0 40 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c5a059' stroke-width='1'%3E%3Cpath d='M20 0 L40 40 L20 30 L0 40 Z'/%3E%3Cpath d='M20 40 L40 80 L20 70 L0 80 Z'/%3E%3C/g%3E%3C/svg%3E"); background-size: 40px 80px; }

  /* ============ HERO / COVER (Section 1) ============ */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    background-color: var(--bg);
    perspective: 1000px;
  }
  .hero-bg {
    position: absolute;
    inset: -10%;
    background: url('https://picsum.photos/seed/javanese-palace-bg/1200/1600.jpg') no-repeat center center / cover;
    filter: sepia(0.6) brightness(0.35) contrast(1.1);
    z-index: 0;
    will-change: transform;
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 0%, var(--bg) 90%);
    z-index: 1;
  }
  .hero-pattern {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c5a059' stroke-width='1'%3E%3Cellipse cx='40' cy='20' rx='12' ry='18'/%3E%3Cellipse cx='40' cy='60' rx='12' ry='18'/%3E%3Cellipse cx='20' cy='40' rx='18' ry='12'/%3E%3Cellipse cx='60' cy='40' rx='18' ry='12'/%3E%3Ccircle cx='40' cy='40' r='4'/%3E%3C/g%3E%3C/svg%3E");
    background-size: 80px 80px;
    will-change: transform;
  }
  .hero-content {
    position: relative;
    z-index: 2;
    padding: 2.5rem 2rem;
    border: 1px solid var(--gold);
    background: rgba(26, 18, 11, 0.85);
    backdrop-filter: blur(8px);
    max-width: 90%;
    animation: fadeInUp 2s ease-out;
    transform-style: preserve-3d;
    will-change: transform;
    transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .hero-content::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(197, 160, 89, 0.3);
    pointer-events: none;
  }
  .gate-frame {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    width: 160px;
    height: 90px;
    color: var(--gold);
  }
  .hero-eyebrow { font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.4em; color: var(--gold); text-transform: uppercase; margin-top: 1.5rem; margin-bottom: 1.5rem; }
  .hero-names { font-family: 'Prata', serif; font-size: clamp(2.5rem, 8vw, 4.5rem); color: var(--cream); line-height: 1.1; text-shadow: 0 4px 20px rgba(0,0,0,0.9); margin: 0; }
  .hero-amp { display: block; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 0.5em; color: var(--gold); margin: 0.5rem 0; }
  .hero-date { font-family: 'Cinzel', serif; font-size: 0.85rem; letter-spacing: 0.3em; color: var(--cream-dim); margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--line); display: inline-block; }
  .hero-couple-info { font-size: 0.8rem; color: var(--muted); margin-top: 1rem; font-family: 'Cormorant Garamond', serif; font-style: italic; }

  /* ============ SECTION TITLES ============ */
  .section-title { font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.4em; color: var(--gold); text-transform: uppercase; text-align: center; margin-bottom: 0.5rem; }
  .section-heading { font-family: 'Prata', serif; font-size: clamp(2rem, 5vw, 3rem); color: var(--cream); text-align: center; margin-bottom: 1rem; }
  .ornament-divider { display: flex; align-items: center; justify-content: center; gap: 1rem; margin: 1.5rem 0 3rem; color: var(--gold); }
  .ornament-divider .line { height: 1px; width: 80px; background: linear-gradient(90deg, transparent, var(--gold)); }
  .ornament-divider .line.right { background: linear-gradient(90deg, var(--gold), transparent); }

  /* ============ COUNTDOWN ============ */
  .countdown-container { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
  .cd-box { background: rgba(36, 24, 16, 0.8); border: 1px solid var(--line); padding: 1.5rem 1rem; min-width: 90px; text-align: center; position: relative; backdrop-filter: blur(5px); }
  .cd-box::before, .cd-box::after { content: ''; position: absolute; width: 10px; height: 10px; border: 1px solid var(--gold); }
  .cd-box::before { top: 4px; left: 4px; border-right: none; border-bottom: none; }
  .cd-box::after { bottom: 4px; right: 4px; border-left: none; border-top: none; }
  .cd-num { font-family: 'Prata', serif; font-size: 2rem; color: var(--gold-bright); display: block; }
  .cd-label { font-family: 'Jost', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; color: var(--muted); text-transform: uppercase; margin-top: 0.5rem; display: block; }

  /* ============ THE COUPLE ============ */
  .couple-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: center; }
  @media (min-width: 768px) { .couple-grid { grid-template-columns: 1fr auto 1fr; gap: 2rem; } }
  .couple-card { text-align: center; position: relative; }
  .couple-photo-wrap { width: 240px; height: 320px; margin: 0 auto 2rem; position: relative; padding: 10px; border: 1px solid var(--gold); }
  .couple-photo-wrap::before { content: ''; position: absolute; inset: 5px; border: 1px solid rgba(197, 160, 89, 0.3); z-index: 2; pointer-events: none; }
  .couple-photo { width: 100%; height: 100%; object-fit: cover; filter: sepia(0.4) contrast(1.05) brightness(0.9); }
  .couple-role { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.3em; color: var(--gold); text-transform: uppercase; margin-bottom: 0.5rem; }
  .couple-name { font-family: 'Prata', serif; font-size: 2rem; color: var(--cream); margin-bottom: 0.5rem; }
  .couple-fullname { font-size: 0.9rem; color: var(--cream-dim); margin-bottom: 1.5rem; font-style: italic; }
  .couple-parents { font-size: 0.85rem; color: var(--muted); line-height: 1.8; }
  .couple-parents span { display: block; font-family: 'Cinzel', serif; font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold); text-transform: uppercase; margin-bottom: 0.5rem; }
  .couple-amp { font-family: 'Prata', serif; font-size: 3rem; color: var(--gold); text-align: center; }

  /* ============ HOLY VERSE ============ */
  .verse-container { text-align: center; max-width: 700px; margin: 0 auto; padding: 3rem 2rem; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); position: relative; background: rgba(16, 10, 5, 0.6); backdrop-filter: blur(5px); }
  .verse-container::before, .verse-container::after { content: '\u2756'; position: absolute; color: var(--gold); font-size: 1.5rem; background: var(--bg); padding: 0 1rem; }
  .verse-container::before { top: -12px; left: 50%; transform: translateX(-50%); }
  .verse-container::after { bottom: -12px; left: 50%; transform: translateX(-50%); }
  .verse-arabic { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: var(--gold-bright); margin-bottom: 2rem; direction: rtl; }
  .verse-text { font-style: italic; font-size: 1.1rem; color: var(--cream-dim); margin-bottom: 1.5rem; }
  .verse-source { font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.2em; color: var(--gold); }

  /* ============ LOVE STORY ============ */
  .timeline { position: relative; max-width: 600px; margin: 0 auto; padding-left: 30px; }
  .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: var(--line); }
  .timeline-item { position: relative; margin-bottom: 3rem; padding-left: 30px; }
  .timeline-item::before { content: ''; position: absolute; left: -6px; top: 5px; width: 12px; height: 12px; background: var(--bg); border: 1px solid var(--gold); transform: rotate(45deg); }
  .timeline-date { font-family: 'Cinzel', serif; font-size: 0.7rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.5rem; }
  .timeline-title { font-family: 'Prata', serif; font-size: 1.4rem; color: var(--cream); margin-bottom: 0.5rem; }
  .timeline-desc { font-size: 0.95rem; color: var(--muted); }

  /* ============ EVENTS ============ */
  .events-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
  @media (min-width: 768px) { .events-grid { grid-template-columns: 1fr 1fr; } }
  .event-card { background: linear-gradient(180deg, rgba(36, 24, 16, 0.8), rgba(16, 10, 5, 0.8)); border: 1px solid var(--line); padding: 3rem 2rem; text-align: center; position: relative; backdrop-filter: blur(5px); }
  .event-card::before { content: ''; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 1px solid rgba(197, 160, 89, 0.1); pointer-events: none; }
  .event-icon { font-size: 2rem; color: var(--gold); margin-bottom: 1.5rem; }
  .event-type { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.3em; color: var(--gold); text-transform: uppercase; margin-bottom: 1rem; }
  .event-title { font-family: 'Prata', serif; font-size: 1.8rem; color: var(--cream); margin-bottom: 1.5rem; }
  .event-detail { margin-bottom: 1rem; color: var(--cream-dim); }
  .event-detail i { color: var(--gold); margin-right: 0.5rem; }
  .event-btn { display: inline-block; margin-top: 1.5rem; padding: 0.8rem 2rem; border: 1px solid var(--gold); color: var(--gold); font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; }
  .event-btn:hover { background: var(--gold); color: var(--bg); }

  /* ============ GALLERY ============ */
  .gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  @media (min-width: 768px) { .gallery-grid { grid-template-columns: repeat(3, 1fr); } }
  .gallery-item { aspect-ratio: 3/4; overflow: hidden; cursor: pointer; border: 1px solid var(--line); position: relative; }
  .gallery-item img { width: 100%; height: 100%; object-fit: cover; filter: sepia(0.3) contrast(1.05); transition: transform 0.5s ease; }
  .gallery-item:hover img { transform: scale(1.1); }

  /* ============ FORM SECTIONS ============ */
  .form-card { background: rgba(36, 24, 16, 0.8); border: 1px solid var(--line); padding: 3rem 2rem; max-width: 600px; margin: 0 auto; position: relative; backdrop-filter: blur(5px); }
  .form-card::before { content: ''; position: absolute; inset: 8px; border: 1px solid rgba(197, 160, 89, 0.1); pointer-events: none; }
  .form-group { margin-bottom: 1.5rem; text-align: left; }
  .form-group label { display: block; font-family: 'Jost', sans-serif; font-size: 0.8rem; color: var(--cream-dim); margin-bottom: 0.5rem; }
  .form-control { width: 100%; background: rgba(10, 6, 4, 0.8); border: 1px solid var(--line); color: var(--cream); padding: 0.8rem 1rem; font-family: 'Jost', sans-serif; font-size: 0.9rem; outline: none; transition: border-color 0.3s; }
  .form-control:focus { border-color: var(--gold); }
  textarea.form-control { resize: vertical; min-height: 100px; }
  .btn-gold { background: transparent; border: 1px solid var(--gold); color: var(--gold); padding: 1rem 2rem; font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; width: 100%; }
  .btn-gold:hover { background: var(--gold); color: var(--bg); }
  .wishes-list { max-height: 300px; overflow-y: auto; margin-top: 2rem; padding-right: 10px; }
  .wishes-list::-webkit-scrollbar { width: 4px; }
  .wishes-list::-webkit-scrollbar-thumb { background: var(--gold-deep); }
  .wish-item { background: rgba(10, 6, 4, 0.8); border-left: 2px solid var(--gold); padding: 1rem; margin-bottom: 1rem; }
  .wish-name { font-family: 'Cinzel', serif; font-size: 0.8rem; color: var(--gold); margin-bottom: 0.3rem; }
  .wish-text { font-size: 0.9rem; color: var(--cream-dim); }

  /* ============ INFO CARDS ============ */
  .info-card { background: rgba(36, 24, 16, 0.8); border: 1px solid var(--line); padding: 2rem; text-align: center; margin-bottom: 1.5rem; position: relative; max-width: 500px; margin-left: auto; margin-right: auto; backdrop-filter: blur(5px); }
  .info-card::before { content: ''; position: absolute; inset: 8px; border: 1px solid rgba(197, 160, 89, 0.1); pointer-events: none; }
  .info-card .bank-name { font-family: 'Prata', serif; font-size: 1.5rem; color: var(--cream); margin-bottom: 0.5rem; }
  .info-card .acc-num { font-size: 1.2rem; color: var(--gold); letter-spacing: 0.1em; margin: 1rem 0; font-family: 'Cinzel', serif; }
  .info-card .acc-name { font-size: 0.9rem; color: var(--cream-dim); margin-bottom: 1.5rem; }

  /* ============ MUSIC TOGGLE ============ */
  .music-toggle { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; background: var(--bg-2); border: 1px solid var(--gold); border-radius: 50%; color: var(--gold); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 99; box-shadow: 0 0 20px rgba(0,0,0,0.5); transition: all 0.3s; }
  .music-toggle:hover { transform: scale(1.1); background: var(--gold); color: var(--bg); }

  /* ============ FOOTER ============ */
  .footer { text-align: center; padding: 6rem 1.5rem 3rem; position: relative; overflow: hidden; }
  .footer-monogram { font-family: 'Prata', serif; font-size: 3rem; color: var(--gold); margin-bottom: 2rem; }
  .footer-thanks { font-family: 'Prata', serif; font-size: 2rem; color: var(--cream); margin-bottom: 1.5rem; }
  .footer-closing { font-size: 0.9rem; color: var(--muted); max-width: 400px; margin: 0 auto 3rem; font-style: italic; }
  .footer-families { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.2em; color: var(--gold); text-transform: uppercase; }

  /* Reveal Animation */
  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 1s ease, transform 1s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

  /* Floating particles ONLY IN HERO */
  .particle { position: absolute; background: var(--gold-bright); border-radius: 50%; pointer-events: none; box-shadow: 0 0 6px var(--gold); opacity: 0; z-index: 1; }
</style>
</head>
<body>

<button class="music-toggle" id="musicToggle" aria-label="Toggle Music"><i class="fas fa-music"></i></button>

<!-- ============ 1. COVER (GANJIL - PARALLAX) ============ -->
<section class="hero" id="cover">
  <div class="hero-bg" data-speed="0.4"></div>
  <div class="hero-pattern" data-speed="0.2"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content" data-tilt="true">
    <svg class="gate-frame" viewBox="0 0 160 90" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M80 5 C60 25 35 25 15 12 C22 35 22 55 15 78 C35 65 60 65 80 85 C100 65 125 65 145 78 C138 55 138 35 145 12 C125 25 100 25 80 5 Z" /><circle cx="80" cy="45" r="6" fill="currentColor" /><path d="M80 35 L80 55 M70 45 L90 45" stroke-width="0.8" /></svg>
    <div class="hero-eyebrow">The Wedding of</div>
    <h1 class="hero-names"><span id="e-groom-name">Baskoro</span><span class="hero-amp">&amp;</span><span id="e-bride-name">Sekarwangi</span></h1>
    <div class="hero-couple-info" id="e-couple-info">Putra dari Bapak Suryo &amp; Ibu Dewi<br>Putri dari Bapak Ronggowarsito &amp; Ibu Retno</div>
    <div class="hero-date" id="e-hero-date">Sabtu, 20 Desember 2025</div>
  </div>
</section>

<!-- ============ 2. COUNTDOWN (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal" id="countdown-sec">
  <div class="solid-pattern pattern-parang"></div>
  <div class="ornate-frame-solid"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M8 8 L30 8 M8 8 L8 30" stroke-width="0.8" /><circle cx="8" cy="8" r="3" /><path d="M15 15 Q25 15 25 25" stroke-width="0.6" opacity="0.6" /></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M8 8 L30 8 M8 8 L8 30" stroke-width="0.8" /><circle cx="8" cy="8" r="3" /><path d="M15 15 Q25 15 25 25" stroke-width="0.6" opacity="0.6" /></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M8 8 L30 8 M8 8 L8 30" stroke-width="0.8" /><circle cx="8" cy="8" r="3" /><path d="M15 15 Q25 15 25 25" stroke-width="0.6" opacity="0.6" /></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M8 8 L30 8 M8 8 L8 30" stroke-width="0.8" /><circle cx="8" cy="8" r="3" /><path d="M15 15 Q25 15 25 25" stroke-width="0.6" opacity="0.6" /></svg>
  
  <div class="solid-content">
    <div class="section-title">Save The Date</div>
    <h2 class="section-heading">Hitung Mundur</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="countdown-container" id="countdown">
      <div class="cd-box"><span class="cd-num" id="days">00</span><span class="cd-label">Hari</span></div>
      <div class="cd-box"><span class="cd-num" id="hours">00</span><span class="cd-label">Jam</span></div>
      <div class="cd-box"><span class="cd-num" id="minutes">00</span><span class="cd-label">Mnt</span></div>
      <div class="cd-box"><span class="cd-num" id="seconds">00</span><span class="cd-label">Dtk</span></div>
    </div>
  </div>
</section>

<!-- ============ 3. THE COUPLE (GANJIL - PARALLAX) ============ -->
<section class="base-section parallax-section reveal" id="couple">
  <div class="parallax-bg" style="background-image: url('https://picsum.photos/seed/javanese-couple-bg/1200/1600.jpg');" data-speed="0.15"></div>
  <div class="parallax-pattern pattern-kawung" data-speed="0.05"></div>
  <div class="parallax-overlay"></div>
  <div class="ornate-frame-parallax" data-tilt="true"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M10 10 Q30 10 30 30 Q30 10 50 10" /><path d="M10 10 L10 50" stroke-width="0.8" /><circle cx="10" cy="10" r="4" /><path d="M20 20 Q35 20 35 35" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M10 10 Q30 10 30 30 Q30 10 50 10" /><path d="M10 10 L10 50" stroke-width="0.8" /><circle cx="10" cy="10" r="4" /><path d="M20 20 Q35 20 35 35" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M10 10 Q30 10 30 30 Q30 10 50 10" /><path d="M10 10 L10 50" stroke-width="0.8" /><circle cx="10" cy="10" r="4" /><path d="M20 20 Q35 20 35 35" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M10 10 Q30 10 30 30 Q30 10 50 10" /><path d="M10 10 L10 50" stroke-width="0.8" /><circle cx="10" cy="10" r="4" /><path d="M20 20 Q35 20 35 35" stroke-width="0.6" opacity="0.5" /></svg>

  <div class="parallax-content" data-tilt="true">
    <div class="section-title">Bismillahirrahmanirrahim</div>
    <h2 class="section-heading">Mempelai</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="couple-grid">
      <div class="couple-card">
        <div class="couple-photo-wrap"><img id="e-groom-photo" src="https://picsum.photos/seed/javanese-groom/600/800.jpg" alt="Groom" class="couple-photo"></div>
        <div class="couple-role">The Groom</div>
        <div class="couple-name" id="e-groom-name2">Baskoro</div>
        <div class="couple-fullname" id="e-groom-full">Raden Mas Baskoro Wicaksono, S.T.</div>
        <div class="couple-parents" id="e-groom-parents"><span>Putra Pertama Dari</span>Bapak R. Suryo Negoro, S.H.<br>& Ibu R. Ayu Retno Wulandari</div>
      </div>
      <div class="couple-amp">&amp;</div>
      <div class="couple-card">
        <div class="couple-photo-wrap"><img id="e-bride-photo" src="https://picsum.photos/seed/javanese-bride/600/800.jpg" alt="Bride" class="couple-photo"></div>
        <div class="couple-role">The Bride</div>
        <div class="couple-name" id="e-bride-name2">Sekarwangi</div>
        <div class="couple-fullname" id="e-bride-full">Raden Ayu Sekarwangi Putri, S.Ked.</div>
        <div class="couple-parents" id="e-bride-parents"><span>Putri Kedua Dari</span>Bapak R. Ronggowarsito, M.M.<br>& Ibu R. Ayu Maharani Dewi</div>
      </div>
    </div>
  </div>
</section>

<!-- ============ 4. HOLY VERSE (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal" id="verse">
  <div class="solid-pattern pattern-megamendung"></div>
  <div class="ornate-frame-solid"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L30 0 L30 2 L2 2 L2 30 L0 30 Z" /><circle cx="15" cy="15" r="8" stroke-width="0.6" opacity="0.5" /><circle cx="15" cy="15" r="3" /><path d="M25 8 Q35 8 35 18" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L30 0 L30 2 L2 2 L2 30 L0 30 Z" /><circle cx="15" cy="15" r="8" stroke-width="0.6" opacity="0.5" /><circle cx="15" cy="15" r="3" /><path d="M25 8 Q35 8 35 18" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L30 0 L30 2 L2 2 L2 30 L0 30 Z" /><circle cx="15" cy="15" r="8" stroke-width="0.6" opacity="0.5" /><circle cx="15" cy="15" r="3" /><path d="M25 8 Q35 8 35 18" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L30 0 L30 2 L2 2 L2 30 L0 30 Z" /><circle cx="15" cy="15" r="8" stroke-width="0.6" opacity="0.5" /><circle cx="15" cy="15" r="3" /><path d="M25 8 Q35 8 35 18" stroke-width="0.6" opacity="0.5" /></svg>

  <div class="solid-content">
    <div class="verse-container">
      <p class="verse-arabic">\u0648\u064e\u0645\u0650\u0646\u0652 \u0622\u064a\u064e\u0627\u062a\u0650\u0647\u0650 \u0623\u064e\u0646\u0652 \u062e\u064e\u0644\u064e\u0642\u064e \u0644\u064e\u0643\u064f\u0645\u0652 \u0645\u0650\u0651\u0646\u0652 \u0623\u064e\u0646\u0641\u064f\u0633\u0650\u0643\u064f\u0645\u0652 \u0623\u064e\u0632\u0652\u0648\u064e\u0627\u062c\u064b\u0627 \u0644\u0651\u0650\u062a\u064e\u0633\u0652\u0643\u064f\u0646\u064f\u0648\u0627 \u0625\u0650\u0644\u064e\u064a\u0652\u0647\u064e\u0627 \u0648\u064e\u062c\u064e\u0639\u064e\u0644\u064e \u0628\u064e\u064a\u0652\u0646\u064e\u0643\u064f\u0645\u0652 \u0645\u064e\u0648\u064e\u062f\u0651\u064e\u0629\u064b \u0648\u064e\u0631\u064e\u062d\u0652\u0645\u064e\u0629\u064b</p>
      <p class="verse-text">"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."</p>
      <div class="verse-source">\u2014 Q.S. Ar-Rum : 21 \u2014</div>
    </div>
  </div>
</section>

<!-- ============ 5. LOVE STORY (GANJIL - PARALLAX) ============ -->
<section class="base-section parallax-section reveal" id="story">
  <div class="parallax-bg" style="background-image: url('https://picsum.photos/seed/javanese-story-bg/1200/1600.jpg');" data-speed="0.15"></div>
  <div class="parallax-pattern pattern-tumpal" data-speed="0.05"></div>
  <div class="parallax-overlay"></div>
  <div class="ornate-frame-parallax" data-tilt="true"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M5 5 L35 5 L35 8 L8 8 L8 35 L5 35 Z" /><path d="M15 15 L25 15 L25 25 L15 25 Z" stroke-width="0.8" /><circle cx="20" cy="20" r="2" fill="currentColor" /><path d="M30 15 Q40 15 40 25" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M5 5 L35 5 L35 8 L8 8 L8 35 L5 35 Z" /><path d="M15 15 L25 15 L25 25 L15 25 Z" stroke-width="0.8" /><circle cx="20" cy="20" r="2" fill="currentColor" /><path d="M30 15 Q40 15 40 25" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M5 5 L35 5 L35 8 L8 8 L8 35 L5 35 Z" /><path d="M15 15 L25 15 L25 25 L15 25 Z" stroke-width="0.8" /><circle cx="20" cy="20" r="2" fill="currentColor" /><path d="M30 15 Q40 15 40 25" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M5 5 L35 5 L35 8 L8 8 L8 35 L5 35 Z" /><path d="M15 15 L25 15 L25 25 L15 25 Z" stroke-width="0.8" /><circle cx="20" cy="20" r="2" fill="currentColor" /><path d="M30 15 Q40 15 40 25" stroke-width="0.6" opacity="0.5" /></svg>

  <div class="parallax-content" data-tilt="true">
    <div class="section-title">Our Journey</div>
    <h2 class="section-heading">Cerita Cinta</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="timeline">
      <div class="timeline-item"><div class="timeline-date">2019</div><h3 class="timeline-title">Pertemuan Awal</h3><p class="timeline-desc">Bertemu pertama kali di sebuah acara budaya Jawa di Keraton Yogyakarta. Sebuah pertemuan yang mengawali kisah panjang kami.</p></div>
      <div class="timeline-item"><div class="timeline-date">2021</div><h3 class="timeline-title">Lamaran</h3><p class="timeline-desc">Dengan restu kedua keluarga, kami resmi bertunangan dalam acara tradisional sederhana namun penuh makna.</p></div>
      <div class="timeline-item"><div class="timeline-date">2025</div><h3 class="timeline-title">Hari Bahagia</h3><p class="timeline-desc">Memutuskan untuk melangkah ke jenjang pernikahan untuk membina rumah tangga yang sakinah, mawaddah, warahmah.</p></div>
    </div>
  </div>
</section>

<!-- ============ 6. EVENTS (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal" id="events">
  <div class="solid-pattern pattern-kawung"></div>
  <div class="ornate-frame-solid"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M10 10 L30 10 L30 30 L10 30 Z" stroke-width="0.6" opacity="0.5" /><path d="M15 15 L25 15 L25 25 L15 25 Z" stroke-width="0.6" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M10 10 L30 10 L30 30 L10 30 Z" stroke-width="0.6" opacity="0.5" /><path d="M15 15 L25 15 L25 25 L15 25 Z" stroke-width="0.6" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M10 10 L30 10 L30 30 L10 30 Z" stroke-width="0.6" opacity="0.5" /><path d="M15 15 L25 15 L25 25 L15 25 Z" stroke-width="0.6" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M10 10 L30 10 L30 30 L10 30 Z" stroke-width="0.6" opacity="0.5" /><path d="M15 15 L25 15 L25 25 L15 25 Z" stroke-width="0.6" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>

  <div class="solid-content">
    <div class="section-title">Save The Date</div>
    <h2 class="section-heading">Rangkaian Acara</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="events-grid">
      <div class="event-card"><div class="event-icon"><i class="fas fa-rings-wedding"></i></div><div class="event-type">Akad Nikah</div><h3 class="event-title">Resepsi Akad</h3><p class="event-detail"><i class="far fa-calendar"></i> <span id="e-akad-date">Sabtu, 20 Desember 2025</span></p><p class="event-detail"><i class="far fa-clock"></i> <span id="e-akad-time">08.00 - 10.00 WIB</span></p><p class="event-detail"><i class="fas fa-map-marker-alt"></i> <span id="e-akad-place">Pendopo Agung Keraton<br>Yogyakarta</span></p><a id="e-akad-maps" href="https://maps.google.com" target="_blank" class="event-btn">Lihat Lokasi</a></div>
      <div class="event-card"><div class="event-icon"><i class="fas fa-glass-cheers"></i></div><div class="event-type">Resepsi</div><h3 class="event-title">Walimatul Ursy</h3><p class="event-detail"><i class="far fa-calendar"></i> <span id="e-resepsi-date">Sabtu, 20 Desember 2025</span></p><p class="event-detail"><i class="far fa-clock"></i> <span id="e-resepsi-time">11.00 - 14.00 WIB</span></p><p class="event-detail"><i class="fas fa-map-marker-alt"></i> <span id="e-resepsi-place">Ballroom Hotel Phoenix<br>Yogyakarta</span></p><a id="e-resepsi-maps" href="https://maps.google.com" target="_blank" class="event-btn">Lihat Lokasi</a></div>
    </div>
  </div>
</section>

<!-- ============ 7. PHOTO GALLERY (GANJIL - PARALLAX) ============ -->
<section class="base-section parallax-section reveal" id="gallery">
  <div class="parallax-bg" style="background-image: url('https://picsum.photos/seed/javanese-gallery-bg/1200/1600.jpg');" data-speed="0.15"></div>
  <div class="parallax-pattern pattern-parang" data-speed="0.05"></div>
  <div class="parallax-overlay"></div>
  <div class="ornate-frame-parallax" data-tilt="true"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 Q20 10 20 20 Q20 10 30 10" stroke-width="0.8" /><path d="M10 10 L10 30" stroke-width="0.8" /><circle cx="10" cy="10" r="3" /></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 Q20 10 20 20 Q20 10 30 10" stroke-width="0.8" /><path d="M10 10 L10 30" stroke-width="0.8" /><circle cx="10" cy="10" r="3" /></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 Q20 10 20 20 Q20 10 30 10" stroke-width="0.8" /><path d="M10 10 L10 30" stroke-width="0.8" /><circle cx="10" cy="10" r="3" /></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 Q20 10 20 20 Q20 10 30 10" stroke-width="0.8" /><path d="M10 10 L10 30" stroke-width="0.8" /><circle cx="10" cy="10" r="3" /></svg>

  <div class="parallax-content" data-tilt="true">
    <div class="section-title">Our Moments</div>
    <h2 class="section-heading">Galeri Kenangan</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="gallery-grid">
      <div class="gallery-item"><img id="e-gallery-1" src="https://picsum.photos/seed/java-wed-1/600/800.jpg" alt="Gallery 1"></div>
      <div class="gallery-item"><img id="e-gallery-2" src="https://picsum.photos/seed/java-wed-2/600/800.jpg" alt="Gallery 2"></div>
      <div class="gallery-item"><img id="e-gallery-3" src="https://picsum.photos/seed/java-wed-3/600/800.jpg" alt="Gallery 3"></div>
      <div class="gallery-item"><img id="e-gallery-4" src="https://picsum.photos/seed/java-wed-4/600/800.jpg" alt="Gallery 4"></div>
      <div class="gallery-item"><img id="e-gallery-5" src="https://picsum.photos/seed/java-wed-5/600/800.jpg" alt="Gallery 5"></div>
      <div class="gallery-item"><img id="e-gallery-6" src="https://picsum.photos/seed/java-wed-6/600/800.jpg" alt="Gallery 6"></div>
    </div>
  </div>
</section>

<!-- ============ 8. RSVP (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal" id="rsvp">
  <div class="solid-pattern pattern-megamendung"></div>
  <div class="ornate-frame-solid"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M8 8 L32 8 M8 8 L8 32" stroke-width="0.8" /><circle cx="8" cy="8" r="3" /><path d="M15 15 Q25 15 25 25 Q25 15 35 15" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M8 8 L32 8 M8 8 L8 32" stroke-width="0.8" /><circle cx="8" cy="8" r="3" /><path d="M15 15 Q25 15 25 25 Q25 15 35 15" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M8 8 L32 8 M8 8 L8 32" stroke-width="0.8" /><circle cx="8" cy="8" r="3" /><path d="M15 15 Q25 15 25 25 Q25 15 35 15" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M8 8 L32 8 M8 8 L8 32" stroke-width="0.8" /><circle cx="8" cy="8" r="3" /><path d="M15 15 Q25 15 25 25 Q25 15 35 15" stroke-width="0.6" opacity="0.5" /></svg>

  <div class="solid-content">
    <div class="section-title">Konfirmasi Kehadiran</div>
    <h2 class="section-heading">RSVP</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="form-card">
      <form id="rsvpForm">
        <div class="form-group"><label>Nama Lengkap</label><input type="text" class="form-control" id="rsvpName" required></div>
        <div class="form-group"><label>Kehadiran</label><select class="form-control" id="rsvpAttendance" required><option value="">Pilih Kehadiran</option><option value="hadir">Insya Allah Hadir</option><option value="tidak">Mohon Maaf Berhalangan</option></select></div>
        <div class="form-group"><label>Jumlah Tamu</label><select class="form-control" id="rsvpGuests" required><option value="1">1 Orang</option><option value="2">2 Orang</option><option value="3">3 Orang</option></select></div>
        <button type="submit" class="btn-gold">Kirim Konfirmasi</button>
      </form>
    </div>
  </div>
</section>

<!-- ============ 9. WEDDING GIFTS (GANJIL - PARALLAX) ============ -->
<section class="base-section parallax-section reveal" id="gifts">
  <div class="parallax-bg" style="background-image: url('https://picsum.photos/seed/javanese-gift-bg/1200/1600.jpg');" data-speed="0.15"></div>
  <div class="parallax-pattern pattern-tumpal" data-speed="0.05"></div>
  <div class="parallax-overlay"></div>
  <div class="ornate-frame-parallax" data-tilt="true"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 L25 10 L25 25 L10 25 Z" stroke-width="0.8" /><circle cx="17" cy="17" r="3" /><path d="M30 10 Q40 10 40 20" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 L25 10 L25 25 L10 25 Z" stroke-width="0.8" /><circle cx="17" cy="17" r="3" /><path d="M30 10 Q40 10 40 20" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 L25 10 L25 25 L10 25 Z" stroke-width="0.8" /><circle cx="17" cy="17" r="3" /><path d="M30 10 Q40 10 40 20" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 L25 10 L25 25 L10 25 Z" stroke-width="0.8" /><circle cx="17" cy="17" r="3" /><path d="M30 10 Q40 10 40 20" stroke-width="0.6" opacity="0.5" /></svg>

  <div class="parallax-content" data-tilt="true">
    <div class="section-title">Wedding Gift</div>
    <h2 class="section-heading">Tanda Kasih</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <p class="text-center text-[#d4cab3] mb-8">Doa restu Anda adalah hadiah terindah. Namun, bagi yang ingin memberikan tanda kasih, dapat melalui:</p>
    <div class="info-card">
      <div class="bank-name" id="e-bank-name">Bank BCA</div>
      <div class="acc-num" id="e-bank-acc">1234 5678 9012</div>
      <div class="acc-name" id="e-bank-holder">a.n. Raden Ayu Sekarwangi</div>
      <button class="btn-gold" onclick="copyText(document.getElementById('e-bank-acc').textContent.replace(/\\s/g, ''), 'Nomor rekening berhasil disalin!')"><i class="fas fa-copy mr-2"></i>Salin Nomor</button>
    </div>
  </div>
</section>

<!-- ============ 10. LIVE STREAMING (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal" id="streaming">
  <div class="solid-pattern pattern-kawung"></div>
  <div class="ornate-frame-solid"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M12 12 L28 12 L28 28 L12 28 Z" stroke-width="0.6" opacity="0.5" /><path d="M16 16 L24 16 L24 24 L16 24 Z" stroke-width="0.8" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M12 12 L28 12 L28 28 L12 28 Z" stroke-width="0.6" opacity="0.5" /><path d="M16 16 L24 16 L24 24 L16 24 Z" stroke-width="0.8" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M12 12 L28 12 L28 28 L12 28 Z" stroke-width="0.6" opacity="0.5" /><path d="M16 16 L24 16 L24 24 L16 24 Z" stroke-width="0.8" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M12 12 L28 12 L28 28 L12 28 Z" stroke-width="0.6" opacity="0.5" /><path d="M16 16 L24 16 L24 24 L16 24 Z" stroke-width="0.8" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>

  <div class="solid-content">
    <div class="section-title">Live Streaming</div>
    <h2 class="section-heading">Saksikan Upacara</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="info-card">
      <i class="fas fa-video text-3xl text-[#c5a059] mb-4"></i>
      <p class="text-[#d4cab3] mb-6">Bagi tamu yang tidak dapat hadir langsung, kami menyediakan siaran langsung melalui Zoom.</p>
      <a href="https://zoom.us" target="_blank" class="event-btn"><i class="fas fa-video mr-2"></i> Tonton Siaran Langsung</a>
    </div>
  </div>
</section>

<!-- ============ 11. WISHES / GUEST MESSAGES (GANJIL - PARALLAX) ============ -->
<section class="base-section parallax-section reveal" id="wishes">
  <div class="parallax-bg" style="background-image: url('https://picsum.photos/seed/javanese-wishes-bg/1200/1600.jpg');" data-speed="0.15"></div>
  <div class="parallax-pattern pattern-parang" data-speed="0.05"></div>
  <div class="parallax-overlay"></div>
  <div class="ornate-frame-parallax" data-tilt="true"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 Q20 10 20 20 Q20 10 30 10" stroke-width="0.8" /><path d="M10 10 L10 30" stroke-width="0.8" /><circle cx="10" cy="10" r="3" /><path d="M15 15 Q25 15 25 25" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 Q20 10 20 20 Q20 10 30 10" stroke-width="0.8" /><path d="M10 10 L10 30" stroke-width="0.8" /><circle cx="10" cy="10" r="3" /><path d="M15 15 Q25 15 25 25" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 Q20 10 20 20 Q20 10 30 10" stroke-width="0.8" /><path d="M10 10 L10 30" stroke-width="0.8" /><circle cx="10" cy="10" r="3" /><path d="M15 15 Q25 15 25 25" stroke-width="0.6" opacity="0.5" /></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L35 0 L35 2 L2 2 L2 35 L0 35 Z" /><path d="M10 10 Q20 10 20 20 Q20 10 30 10" stroke-width="0.8" /><path d="M10 10 L10 30" stroke-width="0.8" /><circle cx="10" cy="10" r="3" /><path d="M15 15 Q25 15 25 25" stroke-width="0.6" opacity="0.5" /></svg>

  <div class="parallax-content" data-tilt="true">
    <div class="section-title">Ucapan & Doa</div>
    <h2 class="section-heading">Kirim Doa Restu</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="form-card">
      <form id="wishForm">
        <div class="form-group"><label>Nama</label><input type="text" class="form-control" id="wishName" required></div>
        <div class="form-group"><label>Ucapan</label><textarea class="form-control" id="wishText" required></textarea></div>
        <button type="submit" class="btn-gold">Kirim Ucapan</button>
      </form>
      <div class="wishes-list" id="wishesList">
        <div class="wish-item"><div class="wish-name">Pak Suryo Negoro</div><div class="wish-text">Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fi khair. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.</div></div>
        <div class="wish-item"><div class="wish-name">Rara Wijaya</div><div class="wish-text">Selamat menempuh hidup baru kak Baskoro dan mbak Sekar! Semoga langgeng sampai kakek nenek.</div></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ 12. CLOSING (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal footer" id="closing">
  <div class="solid-pattern pattern-megamendung"></div>
  <div class="ornate-frame-solid"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M10 10 L30 10 L30 30 L10 30 Z" stroke-width="0.6" opacity="0.5" /><circle cx="20" cy="20" r="5" stroke-width="0.6" opacity="0.5" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M10 10 L30 10 L30 30 L10 30 Z" stroke-width="0.6" opacity="0.5" /><circle cx="20" cy="20" r="5" stroke-width="0.6" opacity="0.5" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M10 10 L30 10 L30 30 L10 30 Z" stroke-width="0.6" opacity="0.5" /><circle cx="20" cy="20" r="5" stroke-width="0.6" opacity="0.5" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" /><path d="M10 10 L30 10 L30 30 L10 30 Z" stroke-width="0.6" opacity="0.5" /><circle cx="20" cy="20" r="5" stroke-width="0.6" opacity="0.5" /><circle cx="20" cy="20" r="2" fill="currentColor" /></svg>

  <div class="solid-content">
    <div class="footer-monogram">B &amp; S</div>
    <h2 class="footer-thanks" id="e-closing-thanks">Matur Nuwun</h2>
    <p class="footer-closing">Atas kehadiran dan doa restu yang diberikan, kami mengucapkan terima kasih. Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu kepada kedua mempelai.</p>
    <p class="text-[#f7eed8] mb-2 font-body text-sm">Kami yang berbahagia,</p>
    <p class="footer-families" id="e-closing-fam">Keluarga Besar Raden Mas Baskoro &amp; Raden Ayu Sekarwangi</p>
  </div>
</section>

<script>
  // ===== Reveal on Scroll =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ===== Parallax Logic (HANYA UNTUK SECTION GANJIL & HERO) =====
  const parallaxBgs = document.querySelectorAll('.parallax-bg[data-speed], .parallax-pattern[data-speed]');
  const heroBg = document.querySelector('.hero-bg');
  const heroPattern = document.querySelector('.hero-pattern');

  function updateScrollParallax() {
    const scrollY = window.pageYOffset;
    
    // Hero Parallax
    if (heroBg) heroBg.style.transform = \`translateY(\${scrollY * 0.4}px) scale(1.1)\`;
    if (heroPattern) heroPattern.style.transform = \`translateY(\${scrollY * 0.2}px)\`;

    // Section Ganjil Parallax
    parallaxBgs.forEach(el => {
      const section = el.closest('.parallax-section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const speed = parseFloat(el.dataset.speed);
        const offset = (rect.top - window.innerHeight / 2 + rect.height / 2) * speed;
        el.style.transform = \`translate3d(0, \${offset * -1}px, 0) scale(1.1)\`;
      }
    });
  }

  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      requestAnimationFrame(() => {
        updateScrollParallax();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
  updateScrollParallax();

  // ===== Mouse-Tracking 3D Tilt (HANYA UNTUK SECTION GANJIL & HERO) =====
  const tiltElements = document.querySelectorAll('[data-tilt="true"]');
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5);
    targetY = (e.clientY / window.innerHeight - 0.5);
  });

  function animateTilt() {
    mouseX += (targetX - mouseX) * 0.06;
    mouseY += (targetY - mouseY) * 0.06;

    tiltElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        if (el.classList.contains('ornate-frame-parallax')) {
          el.style.transform = \`translate3d(\${mouseX * 15}px, \${mouseY * 15}px, 0)\`;
        } else {
          el.style.transform = \`rotateY(\${mouseX * 4}deg) rotateX(\${-mouseY * 4}deg) translateZ(30px)\`;
        }
      }
    });
    requestAnimationFrame(animateTilt);
  }
  animateTilt();

  // ===== Floating Particles (ONLY IN HERO) =====
  function createHeroParticles() {
    const heroSection = document.getElementById('cover');
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 4 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animation = \`floatParticle \${Math.random() * 10 + 8}s ease-in-out infinite\`;
      particle.style.animationDelay = Math.random() * 5 + 's';
      heroSection.appendChild(particle);
    }
  }
  createHeroParticles();

  const particleStyle = document.createElement('style');
  particleStyle.textContent = \`
    @keyframes floatParticle {
      0%, 100% { opacity: 0; transform: translate(0, 0); }
      50% { opacity: 0.6; transform: translate(20px, -40px); }
    }
  \`;
  document.head.appendChild(particleStyle);

  // ===== Countdown Timer =====
  let weddingDate = new Date('2025-12-20T08:00:00+07:00').getTime();
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    if (distance < 0) return;
    document.getElementById('days').innerText = String(Math.floor(distance / 86400000)).padStart(2, '0');
    document.getElementById('hours').innerText = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('minutes').innerText = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('seconds').innerText = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
  }
  updateCountdown(); setInterval(updateCountdown, 1000);

  // ===== Background Music =====
  const musicToggle = document.getElementById('musicToggle');
  let audioCtx, isPlaying = false, masterGain;
  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioCtx.destination);
    [110, 220, 277.18, 329.63].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() * 10 - 5);
      gain.gain.value = 0.1 / (i + 1);
      osc.connect(gain); gain.connect(masterGain); osc.start();
    });
  }
  musicToggle.addEventListener('click', () => {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    isPlaying = !isPlaying;
    musicToggle.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-music"></i>';
    masterGain.gain.linearRampToValueAtTime(isPlaying ? 0.15 : 0, audioCtx.currentTime + 1.5);
  });

  // ===== Forms Logic =====
  document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault(); alert('Terima kasih, konfirmasi kehadiran Anda telah terkirim.'); this.reset();
  });
  document.getElementById('wishForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('wishName').value;
    const text = document.getElementById('wishText').value;
    const list = document.getElementById('wishesList');
    const newItem = document.createElement('div');
    newItem.className = 'wish-item';
    newItem.innerHTML = \`<div class="wish-name">\${name}</div><div class="wish-text">\${text}</div>\`;
    list.prepend(newItem); this.reset();
  });

  function copyText(text, message) {
    navigator.clipboard.writeText(text).then(() => alert(message)).catch(() => {
      const textarea = document.createElement('textarea'); textarea.value = text;
      document.body.appendChild(textarea); textarea.select(); document.execCommand('copy');
      document.body.removeChild(textarea); alert(message);
    });
  }

  // ===== Update Invitation (called by editor) =====
  window.updateInvitation = function(data) {
    if (data.brideName) { document.getElementById('e-bride-name').textContent = data.brideName; document.getElementById('e-bride-name2').textContent = data.brideName; }
    if (data.groomName) { document.getElementById('e-groom-name').textContent = data.groomName; document.getElementById('e-groom-name2').textContent = data.groomName; }
    if (data.heroDate) document.getElementById('e-hero-date').textContent = data.heroDate;
    if (data.coupleInfo) document.getElementById('e-couple-info').innerHTML = data.coupleInfo;
    if (data.brideFull) document.getElementById('e-bride-full').textContent = data.brideFull;
    if (data.groomFull) document.getElementById('e-groom-full').textContent = data.groomFull;
    if (data.brideParents) document.getElementById('e-bride-parents').innerHTML = data.brideParents;
    if (data.groomParents) document.getElementById('e-groom-parents').innerHTML = data.groomParents;
    if (data.bridePhoto) document.getElementById('e-bride-photo').src = data.bridePhoto;
    if (data.groomPhoto) document.getElementById('e-groom-photo').src = data.groomPhoto;
    if (data.akadDate) document.getElementById('e-akad-date').textContent = data.akadDate;
    if (data.akadTime) document.getElementById('e-akad-time').textContent = data.akadTime;
    if (data.akadPlace) document.getElementById('e-akad-place').innerHTML = data.akadPlace;
    if (data.akadMaps) document.getElementById('e-akad-maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(data.akadMaps);
    if (data.resepsiDate) document.getElementById('e-resepsi-date').textContent = data.resepsiDate;
    if (data.resepsiTime) document.getElementById('e-resepsi-time').textContent = data.resepsiTime;
    if (data.resepsiPlace) document.getElementById('e-resepsi-place').innerHTML = data.resepsiPlace;
    if (data.resepsiMaps) document.getElementById('e-resepsi-maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(data.resepsiMaps);
    if (data.countdownDate) { weddingDate = new Date(data.countdownDate).getTime(); updateCountdown(); }
    if (data.gallery1) document.getElementById('e-gallery-1').src = data.gallery1;
    if (data.gallery2) document.getElementById('e-gallery-2').src = data.gallery2;
    if (data.gallery3) document.getElementById('e-gallery-3').src = data.gallery3;
    if (data.gallery4) document.getElementById('e-gallery-4').src = data.gallery4;
    if (data.gallery5) document.getElementById('e-gallery-5').src = data.gallery5;
    if (data.gallery6) document.getElementById('e-gallery-6').src = data.gallery6;
    if (data.bankName) document.getElementById('e-bank-name').textContent = data.bankName;
    if (data.bankAcc) document.getElementById('e-bank-acc').textContent = data.bankAcc;
    if (data.bankHolder) document.getElementById('e-bank-holder').textContent = data.bankHolder;
    if (data.closingThanks) document.getElementById('e-closing-thanks').textContent = data.closingThanks;
    if (data.closingFam) document.getElementById('e-closing-fam').textContent = data.closingFam;
  };

  // Listen for postMessage from parent (for detail page preview and editor)
  window.addEventListener('message', function(e) {
    if (e.data.type === 'UPDATE') {
      if (window.updateInvitation) window.updateInvitation(e.data.payload);
    }
  });
</script>
</body>
</html> `;

// ==================== Forest Nature Template ====================
export const FOREST_NATURE_TEMPLATE = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Wedding of Arthur & Elena</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');

        :root {
            --forest-dark: #0a120c;
            --forest-base: #142419;
            --gold: #C9A96E;
            --cream: #F4F1EA;
            --overlay: rgba(10, 18, 12, 0.6);
            --overlay-dark: rgba(10, 18, 12, 0.85);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            background-color: var(--forest-dark);
            color: var(--cream);
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }

        h1, h2, h3, h4, .serif {
            font-family: 'Cormorant Garamond', serif;
            font-weight: 400;
        }

        /* --- PARALLAX & SECTION BASE --- */
        .parallax {
            background-attachment: fixed;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            position: relative;
        }

        section {
            padding: 6rem 2rem;
            position: relative;
            z-index: 2;
            background-color: var(--forest-base);
            text-align: center;
        }

        .section-title {
            font-size: 2.5rem;
            color: var(--gold);
            margin-bottom: 3rem;
            text-transform: capitalize;
        }

        /* --- FADE IN ANIMATION --- */
        .fade-in {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .fade-in.appear {
            opacity: 1;
            transform: translateY(0);
        }

        /* --- COVER --- */
        #cover {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-image: url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1920&auto=format&fit=crop');
            padding: 0 2rem;
        }
        #cover::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--overlay);
        }
        .cover-content {
            position: relative;
            z-index: 2;
            text-align: center;
        }
        .cover-subtitle {
            font-size: 1rem;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 1rem;
            color: var(--cream);
        }
        .cover-title {
            font-size: clamp(3rem, 8vw, 6rem);
            color: var(--gold);
            line-height: 1;
            margin-bottom: 1rem;
        }

        /* --- COUNTDOWN --- */
        #countdown-section {
            background-color: var(--forest-dark);
            padding: 3rem 1rem;
        }
        .countdown-container {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            flex-wrap: wrap;
        }
        .time-box {
            background: rgba(201, 169, 110, 0.1);
            border: 1px solid var(--gold);
            padding: 1.5rem 1rem;
            min-width: 90px;
            border-radius: 8px;
        }
        .time-box span {
            display: block;
            font-size: 2.5rem;
            font-family: 'Cormorant Garamond', serif;
            color: var(--gold);
        }
        .time-box small {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* --- HOLY VERSE --- */
        #holy-verse {
            background-image: url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop');
            padding: 8rem 2rem;
        }
        #holy-verse::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--overlay-dark);
        }
        .verse-content {
            position: relative;
            z-index: 2;
            max-width: 800px;
            margin: 0 auto;
        }
        .verse-text {
            font-size: 1.5rem;
            font-style: italic;
            line-height: 1.8;
            margin-bottom: 2rem;
        }
        .verse-source {
            font-size: 1rem;
            color: var(--gold);
            letter-spacing: 2px;
        }

        /* --- THE COUPLE --- */
        .couple-container {
            display: flex;
            flex-direction: column;
            gap: 4rem;
            max-width: 1000px;
            margin: 0 auto;
        }
        .person {
            display: flex;
            align-items: center;
            gap: 3rem;
            text-align: left;
        }
        .person.reverse {
            flex-direction: row-reverse;
            text-align: right;
        }
        .person-img {
            width: 300px;
            height: 400px;
            object-fit: cover;
            border-radius: 200px 200px 0 0;
            border: 2px solid var(--gold);
            padding: 10px;
        }
        .person-info h3 {
            font-size: 2.5rem;
            color: var(--gold);
            margin-bottom: 1rem;
        }
        .person-info p {
            line-height: 1.8;
            color: #b0b8b2;
        }

        /* --- LOVE STORY --- */
        #love-story {
            background-color: var(--forest-dark);
        }
        .timeline {
            max-width: 800px;
            margin: 0 auto;
            border-left: 2px solid var(--gold);
            padding-left: 2rem;
            text-align: left;
        }
        .story-item {
            margin-bottom: 3rem;
            position: relative;
        }
        .story-item::before {
            content: '';
            position: absolute;
            left: -39px;
            top: 0;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--gold);
            border: 4px solid var(--forest-dark);
        }
        .story-year {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.5rem;
            color: var(--gold);
            margin-bottom: 0.5rem;
        }
        .story-title {
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }

        /* --- EVENTS --- */
        #events {
            background-image: url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop');
        }
        #events::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--overlay-dark);
        }
        .events-grid {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }
        .event-card {
            background: rgba(20, 36, 25, 0.8);
            border: 1px solid var(--gold);
            padding: 3rem 2rem;
            backdrop-filter: blur(5px);
        }
        .event-title {
            font-size: 2rem;
            color: var(--gold);
            margin-bottom: 1rem;
        }
        .btn {
            display: inline-block;
            background: transparent;
            color: var(--gold);
            border: 1px solid var(--gold);
            padding: 0.8rem 2rem;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 0.8rem;
            margin-top: 1.5rem;
            transition: 0.3s;
            cursor: pointer;
        }
        .btn:hover {
            background: var(--gold);
            color: var(--forest-dark);
        }

        /* --- PHOTO GALLERY --- */
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .gallery-img {
            width: 100%;
            height: 350px;
            object-fit: cover;
            filter: grayscale(30%);
            transition: 0.5s;
        }
        .gallery-img:hover {
            filter: grayscale(0%);
            transform: scale(1.02);
        }

        /* --- RSVP & WISHES --- */
        #rsvp-wishes {
            background-color: var(--forest-dark);
        }
        .form-container {
            max-width: 600px;
            margin: 0 auto 4rem;
            text-align: left;
        }
        .input-group {
            margin-bottom: 1.5rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--gold);
            font-size: 0.9rem;
        }
        input, select, textarea {
            width: 100%;
            padding: 1rem;
            background: var(--forest-base);
            border: 1px solid rgba(201, 169, 110, 0.3);
            color: var(--cream);
            font-family: 'Montserrat', sans-serif;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--gold);
        }
        .wishes-board {
            max-width: 800px;
            margin: 0 auto;
            height: 300px;
            overflow-y: auto;
            background: var(--forest-base);
            padding: 2rem;
            border: 1px solid rgba(201, 169, 110, 0.2);
            text-align: left;
        }
        .wish-item {
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding-bottom: 1rem;
            margin-bottom: 1rem;
        }
        .wish-name {
            color: var(--gold);
            font-weight: 500;
            margin-bottom: 0.3rem;
        }

        /* --- GIFTS & LIVE STREAM --- */
        .gifts-stream-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 900px;
            margin: 0 auto;
        }
        .box-card {
            border: 1px dashed var(--gold);
            padding: 3rem 2rem;
        }

        /* --- CLOSING --- */
        #closing {
            height: 80vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1920&auto=format&fit=crop');
        }
        #closing::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--overlay);
        }
        
        /* --- BACKGROUND MUSIC BUTTON --- */
        #music-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--gold);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(201, 169, 110, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(201, 169, 110, 0); }
            100% { box-shadow: 0 0 0 0 rgba(201, 169, 110, 0); }
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 768px) {
            .person, .person.reverse {
                flex-direction: column;
                text-align: center;
            }
            .person-img { width: 100%; max-width: 300px; }
            .timeline { padding-left: 1.5rem; }
        }
    </style>
</head>
<body>

    <!-- AUDIO PLAYER -->
    <audio id="bg-music" loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
    </audio>
    <button id="music-btn" onclick="toggleMusic()"><i class="fas fa-music"></i></button>

    <!-- 1. COVER -->
    <section id="cover" class="parallax">
        <div class="cover-content fade-in">
            <p class="cover-subtitle" id="e-cover-subtitle">The Wedding Celebration Of</p>
            <h1 class="cover-title"><span id="e-groom-name">Arthur</span> & <span id="e-bride-name">Elena</span></h1>
            <p class="serif" style="font-size: 1.5rem; letter-spacing: 2px;">WE ARE GETTING MARRIED</p>
        </div>
    </section>

    <!-- 2. COUNTDOWN -->
    <section id="countdown-section">
        <div class="countdown-container fade-in">
            <div class="time-box"><span id="days">00</span><small>Hari</small></div>
            <div class="time-box"><span id="hours">00</span><small>Jam</small></div>
            <div class="time-box"><span id="minutes">00</span><small>Menit</small></div>
            <div class="time-box"><span id="seconds">00</span><small>Detik</small></div>
        </div>
    </section>

    <!-- 3. HOLY VERSE -->
    <section id="holy-verse" class="parallax">
        <div class="verse-content fade-in">
            <p class="verse-text serif" id="e-verse-text">"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."</p>
            <p class="verse-source" id="e-verse-source">Ar-Rum: 21</p>
        </div>
    </section>

    <!-- 4. THE COUPLE -->
    <section id="couple">
        <h2 class="section-title fade-in">The Bride & Groom</h2>
        <div class="couple-container">
            <div class="person fade-in">
                <img id="e-groom-photo" src="https://images.unsplash.com/photo-1595290263309-84d436ec0dd8?q=80&w=600&auto=format&fit=crop" alt="Arthur" class="person-img">
                <div class="person-info">
                    <h3 id="e-groom-name2">Arthur Pendragon</h3>
                    <p id="e-groom-info">Putra dari Bapak Uther & Ibu Igraine.<br>Seorang pria yang menemukan kedamaiannya dalam senyum Elena. Penikmat kopi dan penjelajah alam.</p>
                </div>
            </div>
            <div class="person reverse fade-in">
                <img id="e-bride-photo" src="https://images.unsplash.com/photo-1543130732-4b8da601004b?q=80&w=600&auto=format&fit=crop" alt="Elena" class="person-img">
                <div class="person-info">
                    <h3 id="e-bride-name2">Elena Gilbert</h3>
                    <p id="e-bride-info">Putri dari Bapak John & Ibu Isobel.<br>Wanita anggun yang mewarnai dunia Arthur. Pecinta seni dan keindahan alam semesta.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. LOVE STORY -->
    <section id="love-story">
        <h2 class="section-title fade-in">Our Story</h2>
        <div class="timeline fade-in">
            <div class="story-item">
                <div class="story-year">2018 - Pertemuan Pertama</div>
                <h4 class="story-title">Di Bawah Hujan Musim Gugur</h4>
                <p>Kami tidak sengaja bertemu di sebuah kafe kecil dekat hutan kota. Secangkir kopi hangat menjadi awal dari perbincangan panjang kami.</p>
            </div>
            <div class="story-item">
                <div class="story-year">2021 - Bertumbuh Bersama</div>
                <h4 class="story-title">Perjalanan ke Pegunungan</h4>
                <p>Melewati berbagai musim bersama, saling mendukung karir dan impian. Di puncak gunung, kami menyadari bahwa kami tidak ingin mendaki sendirian lagi.</p>
            </div>
            <div class="story-item">
                <div class="story-year">2023 - Lamaran</div>
                <h4 class="story-title">Janji di Tengah Hutan Pinus</h4>
                <p>Dikelilingi oleh alam yang tenang dan keluarga terdekat, Arthur berlutut dan meminta Elena untuk merajut masa depan bersama selamanya.</p>
            </div>
        </div>
    </section>

    <!-- 6. EVENTS -->
    <section id="events" class="parallax">
        <div class="events-grid fade-in">
            <div class="event-card">
                <h3 class="event-title">Akad Nikah</h3>
                <p style="margin-bottom: 1rem; color: #b0b8b2;"><span id="e-akad-date">Sabtu, 28 Oktober 2026</span><br><span id="e-akad-time">08:00 - 10:00 WIB</span></p>
                <p id="e-akad-place"><strong>Pine Forest Camp</strong><br>Lembang, Bandung, Jawa Barat</p>
                <a id="e-akad-maps" href="https://maps.google.com" class="btn">Google Maps</a>
            </div>
            <div class="event-card">
                <h3 class="event-title">Resepsi</h3>
                <p style="margin-bottom: 1rem; color: #b0b8b2;"><span id="e-resepsi-date">Sabtu, 28 Oktober 2026</span><br><span id="e-resepsi-time">11:00 - 14:00 WIB</span></p>
                <p id="e-resepsi-place"><strong>Pine Forest Camp</strong><br>Lembang, Bandung, Jawa Barat</p>
                <a id="e-resepsi-maps" href="https://maps.google.com" class="btn">Google Maps</a>
            </div>
        </div>
    </section>

    <!-- 7. PHOTO GALLERY -->
    <section id="gallery">
        <h2 class="section-title fade-in">Moments of Us</h2>
        <div class="gallery-grid fade-in">
            <img id="e-gallery-1" src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop" class="gallery-img">
            <img id="e-gallery-2" src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop" class="gallery-img">
            <img id="e-gallery-3" src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop" class="gallery-img">
            <img id="e-gallery-4" src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop" class="gallery-img">
        </div>
    </section>

    <!-- 8. GIFTS & LIVE STREAM -->
    <section id="gifts-stream">
        <h2 class="section-title fade-in">Gifts & Virtual Attend</h2>
        <div class="gifts-stream-grid fade-in">
            <div class="box-card">
                <h3 class="serif" style="font-size: 2rem; color: var(--gold); margin-bottom: 1rem;">Wedding Gift</h3>
                <p style="margin-bottom: 1rem; font-size: 0.9rem; line-height: 1.6;">Doa restu Anda merupakan karunia yang sangat berarti. Namun jika Anda ingin memberikan tanda kasih, dapat melalui:</p>
                <p style="font-family: monospace; font-size: 1.2rem; margin: 1rem 0;"><span id="e-bank-name">BCA</span> <span id="e-bank-acc">1234567890</span></p>
                <p style="color: var(--gold);" id="e-bank-holder">a.n Arthur Pendragon</p>
                <button class="btn" onclick="alert('Nomor rekening disalin!')">Salin Rekening</button>
            </div>
            <div class="box-card">
                <h3 class="serif" style="font-size: 2rem; color: var(--gold); margin-bottom: 1rem;">Live Streaming</h3>
                <p style="margin-bottom: 1rem; font-size: 0.9rem; line-height: 1.6;">Bagi keluarga & sahabat yang tidak dapat hadir secara langsung, kami mengundang Anda untuk bergabung secara virtual.</p>
                <a href="#" class="btn" style="margin-top: 2.3rem;">Join Zoom / YouTube</a>
            </div>
        </div>
    </section>

    <!-- 9. RSVP & WISHES -->
    <section id="rsvp-wishes">
        <h2 class="section-title fade-in">RSVP & Wishes</h2>
        
        <div class="form-container fade-in">
            <form onsubmit="event.preventDefault(); alert('Terima kasih, konfirmasi Anda telah terkirim!');">
                <div class="input-group">
                    <label>Nama Lengkap</label>
                    <input type="text" required placeholder="Masukkan nama Anda">
                </div>
                <div class="input-group">
                    <label>Konfirmasi Kehadiran</label>
                    <select required>
                        <option value="">Pilih status kehadiran</option>
                        <option value="Hadir">Ya, Saya akan hadir</option>
                        <option value="Tidak">Maaf, Saya tidak bisa hadir</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Jumlah Tamu</label>
                    <select required>
                        <option value="1">1 Orang</option>
                        <option value="2">2 Orang</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Pesan & Doa</label>
                    <textarea rows="4" required placeholder="Tulis doa untuk kedua mempelai"></textarea>
                </div>
                <button type="submit" class="btn" style="width: 100%;">Kirim RSVP & Doa</button>
            </form>
        </div>

        <div class="wishes-board fade-in">
            <h3 class="serif" style="color: var(--gold); margin-bottom: 1.5rem; font-size: 1.5rem;">Guest Messages</h3>
            <div class="wish-item">
                <div class="wish-name">Sarah & John</div>
                <div style="font-size: 0.9rem; color: #b0b8b2;">Selamat menempuh hidup baru Arthur & Elena. Semoga bahagia selalu dan dilancarkan semuanya!</div>
            </div>
            <div class="wish-item">
                <div class="wish-name">Michael (Teman Kantor)</div>
                <div style="font-size: 0.9rem; color: #b0b8b2;">Happy Wedding bro! Finally! Maaf belum bisa hadir, doa terbaik untuk kalian berdua.</div>
            </div>
        </div>
    </section>

    <!-- 10. CLOSING -->
    <section id="closing" class="parallax">
        <div class="cover-content fade-in">
            <p class="serif" style="font-size: 1.5rem; margin-bottom: 1rem;" id="e-closing-thanks">Terima Kasih</p>
            <h1 class="cover-title" id="e-closing-names">Arthur & Elena</h1>
            <p style="margin-top: 1rem; color: var(--gold); letter-spacing: 2px;">#ArlenEverAfter</p>
        </div>
    </section>

    <script>
        // --- COUNTDOWN LOGIC ---
        let weddingDate = new Date(2026, 9, 28, 8, 0, 0).getTime(); // 28 Oktober 2026

        const timer = setInterval(function() {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                clearInterval(timer);
                document.getElementById("days").innerText = "00";
                document.getElementById("hours").innerText = "00";
                document.getElementById("minutes").innerText = "00";
                document.getElementById("seconds").innerText = "00";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerText = days.toString().padStart(2, '0');
            document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
            document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
            document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
        }, 1000);

        // --- FADE IN ANIMATION PADA SAAT SCROLL ---
        const faders = document.querySelectorAll('.fade-in');
        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add('appear');
                    observer.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });

        // --- BACKGROUND MUSIC TOGGLE ---
        const audio = document.getElementById("bg-music");
        const musicBtn = document.getElementById("music-btn");
        let isPlaying = false;

        function toggleMusic() {
            if (isPlaying) {
                audio.pause();
                musicBtn.innerHTML = '<i class="fas fa-music"></i>';
            } else {
                audio.play().catch(error => {
                    console.log("Audio play failed:", error);
                });
                musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        }

        // ===== Update Invitation (called by editor) =====
        window.updateInvitation = function(data) {
            if (data.brideName) { document.getElementById('e-bride-name').textContent = data.brideName; document.getElementById('e-bride-name2').textContent = data.brideName; }
            if (data.groomName) { document.getElementById('e-groom-name').textContent = data.groomName; document.getElementById('e-groom-name2').textContent = data.groomName; }
            if (data.coverSubtitle) document.getElementById('e-cover-subtitle').textContent = data.coverSubtitle;
            if (data.bridePhoto) document.getElementById('e-bride-photo').src = data.bridePhoto;
            if (data.groomPhoto) document.getElementById('e-groom-photo').src = data.groomPhoto;
            if (data.brideInfo) document.getElementById('e-bride-info').innerHTML = data.brideInfo;
            if (data.groomInfo) document.getElementById('e-groom-info').innerHTML = data.groomInfo;
            if (data.verseText) document.getElementById('e-verse-text').textContent = data.verseText;
            if (data.verseSource) document.getElementById('e-verse-source').textContent = data.verseSource;
            if (data.akadDate) document.getElementById('e-akad-date').textContent = data.akadDate;
            if (data.akadTime) document.getElementById('e-akad-time').textContent = data.akadTime;
            if (data.akadPlace) document.getElementById('e-akad-place').innerHTML = data.akadPlace;
            if (data.akadMaps) document.getElementById('e-akad-maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(data.akadMaps);
            if (data.resepsiDate) document.getElementById('e-resepsi-date').textContent = data.resepsiDate;
            if (data.resepsiTime) document.getElementById('e-resepsi-time').textContent = data.resepsiTime;
            if (data.resepsiPlace) document.getElementById('e-resepsi-place').innerHTML = data.resepsiPlace;
            if (data.resepsiMaps) document.getElementById('e-resepsi-maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(data.resepsiMaps);
            if (data.countdownDate) { weddingDate = new Date(data.countdownDate).getTime(); }
            if (data.gallery1) document.getElementById('e-gallery-1').src = data.gallery1;
            if (data.gallery2) document.getElementById('e-gallery-2').src = data.gallery2;
            if (data.gallery3) document.getElementById('e-gallery-3').src = data.gallery3;
            if (data.gallery4) document.getElementById('e-gallery-4').src = data.gallery4;
            if (data.bankName) document.getElementById('e-bank-name').textContent = data.bankName;
            if (data.bankAcc) document.getElementById('e-bank-acc').textContent = data.bankAcc;
            if (data.bankHolder) document.getElementById('e-bank-holder').textContent = data.bankHolder;
            if (data.closingThanks) document.getElementById('e-closing-thanks').textContent = data.closingThanks;
            if (data.closingNames) document.getElementById('e-closing-names').textContent = data.closingNames;
        };

        // Listen for postMessage from parent (for detail page preview and editor)
        window.addEventListener('message', function(e) {
            if (e.data.type === 'UPDATE') {
                if (window.updateInvitation) window.updateInvitation(e.data.payload);
            }
        });
    </script>
</body>
</html> `;

export const WEST_SUMATRA_TEMPLATE = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Undangan Pernikahan - Raka & Sri</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Italiana&family=Marcellus&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  :root {
    --bg: #060b14;          /* Biru Malam Sangat Gelap */
    --bg-2: #0a1424;        /* Biru Gelap */
    --bg-3: #0f1d33;        /* Biru Tua */
    --cream: #fdf6e3;       /* Krem Songket */
    --cream-dim: #e8dfc8;
    --gold: #d4af37;        /* Emas Songket */
    --gold-bright: #f1c40f;
    --gold-deep: #aa8c2c;
    --muted: rgba(253, 246, 227, 0.6);
    --line: rgba(212, 175, 55, 0.3);
  }

  * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    color: var(--cream);
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    margin: 0;
    overflow-x: hidden;
    line-height: 1.6;
  }

  /* Global Text Shadow for Readability */
  h1, h2, h3, p, span, div { text-shadow: 0 2px 15px rgba(0, 0, 0, 0.8); }

  .font-display { font-family: 'Marcellus', serif; }
  .font-italiana { font-family: 'Italiana', serif; }
  .font-cinzel { font-family: 'Cinzel', serif; }
  .font-body { font-family: 'Jost', sans-serif; }

  /* ============ FRAMEWORK SECTION ============ */
  .base-section {
    position: relative;
    overflow: hidden;
    padding: 8rem 1.5rem;
    z-index: 1;
  }

  /* ============ SECTION GANJIL (1, 3, 5, 7, 9, 11) - PARALLAX AKTIF ============ */
  .parallax-section {
    perspective: 1000px;
  }
  .parallax-bg {
    position: absolute;
    inset: -15%;
    z-index: 0;
    background-size: cover;
    background-position: center;
    /* Filter diubah agar condong ke biru */
    filter: brightness(0.35) contrast(1.2) saturate(0.8) hue-rotate(190deg);
    will-change: transform;
  }
  .parallax-pattern {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.1;
    background-size: 80px 80px;
    will-change: transform;
  }
  .parallax-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: linear-gradient(180deg, var(--bg) 0%, transparent 20%, transparent 80%, var(--bg) 100%);
  }
  .parallax-content {
    position: relative;
    z-index: 10;
    max-width: 900px;
    margin: 0 auto;
    transform-style: preserve-3d;
    transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
    will-change: transform;
  }
  .ornate-frame-parallax {
    position: absolute;
    top: 30px; left: 30px; right: 30px; bottom: 30px;
    z-index: 3;
    pointer-events: none;
    border: 1px solid var(--gold);
    opacity: 0.4;
    will-change: transform;
  }
  .ornate-frame-parallax::before {
    content: '';
    position: absolute;
    top: 6px; left: 6px; right: 6px; bottom: 6px;
    border: 1px solid var(--gold);
    opacity: 0.5;
  }

  /* ============ SECTION GENAP (2, 4, 6, 8, 10, 12) - FLAT / SOLID ============ */
  .solid-section {
    /* Background solid biru gelap */
    background: linear-gradient(180deg, #04070d 0%, #060b14 50%, #04070d 100%);
  }
  .solid-pattern {
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.04;
    background-size: 80px 80px;
    pointer-events: none;
  }
  .solid-content {
    position: relative;
    z-index: 10;
    max-width: 900px;
    margin: 0 auto;
  }
  .ornate-frame-solid {
    position: absolute;
    top: 30px; left: 30px; right: 30px; bottom: 30px;
    z-index: 2;
    pointer-events: none;
    border: 1px solid var(--gold);
    opacity: 0.2;
  }
  .ornate-frame-solid::before {
    content: '';
    position: absolute;
    top: 6px; left: 6px; right: 6px; bottom: 6px;
    border: 1px solid var(--gold);
    opacity: 0.3;
  }

  /* ============ MINANGKABAU ORNAMENT CORNERS ============ */
  .corner-ornament {
    position: absolute;
    width: 80px;
    height: 80px;
    color: var(--gold);
    z-index: 4;
  }
  .corner-ornament.tl { top: 10px; left: 10px; }
  .corner-ornament.tr { top: 10px; right: 10px; transform: scaleX(-1); }
  .corner-ornament.bl { bottom: 10px; left: 10px; transform: scaleY(-1); }
  .corner-ornament.br { bottom: 10px; right: 10px; transform: scale(-1, -1); }

  /* ============ SONGKET PATTERNS ============ */
  .pattern-songket-1 { background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d4af37' stroke-width='1'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z'/%3E%3Cpath d='M40 20 L60 40 L40 60 L20 40 Z'/%3E%3Cpath d='M0 0 L10 0 L0 10 Z' fill='%23d4af37'/%3E%3Cpath d='M80 0 L70 0 L80 10 Z' fill='%23d4af37'/%3E%3Cpath d='M0 80 L10 80 L0 70 Z' fill='%23d4af37'/%3E%3Cpath d='M80 80 L70 80 L80 70 Z' fill='%23d4af37'/%3E%3C/g%3E%3C/svg%3E"); background-size: 80px 80px; }
  .pattern-songket-2 { background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d4af37' stroke-width='1'%3E%3Cpath d='M0 20 L20 0 L40 20 L20 40 Z'/%3E%3Cpath d='M10 10 L30 10 L30 30 L10 30 Z'/%3E%3C/g%3E%3C/svg%3E"); background-size: 40px 40px; }

  /* ============ HERO / COVER (Section 1) ============ */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    background-color: var(--bg);
    perspective: 1000px;
  }
  .hero-bg {
    position: absolute;
    inset: -10%;
    background: url('https://picsum.photos/seed/ocean-night-blue/1200/1600.jpg') no-repeat center center / cover;
    /* Filter biru untuk hero */
    filter: brightness(0.35) contrast(1.2) saturate(0.8) hue-rotate(190deg);
    z-index: 0;
    will-change: transform;
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 0%, var(--bg) 90%);
    z-index: 1;
  }
  .hero-pattern {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d4af37' stroke-width='1'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z'/%3E%3Cpath d='M40 20 L60 40 L40 60 L20 40 Z'/%3E%3Cpath d='M0 0 L10 0 L0 10 Z' fill='%23d4af37'/%3E%3Cpath d='M80 0 L70 0 L80 10 Z' fill='%23d4af37'/%3E%3C/g%3E%3C/svg%3E");
    background-size: 80px 80px;
    will-change: transform;
  }
  .hero-content {
    position: relative;
    z-index: 2;
    padding: 3rem 2rem;
    border: 1px solid var(--gold);
    background: rgba(6, 11, 20, 0.85);
    backdrop-filter: blur(8px);
    max-width: 90%;
    animation: fadeInUp 2s ease-out;
    transform-style: preserve-3d;
    will-change: transform;
    transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .hero-content::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(212, 175, 55, 0.3);
    pointer-events: none;
  }
  .gate-frame {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 80px;
    color: var(--gold);
  }
  .hero-eyebrow { font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.4em; color: var(--gold); text-transform: uppercase; margin-top: 1.5rem; margin-bottom: 1.5rem; }
  .hero-names { font-family: 'Marcellus', serif; font-size: clamp(2.5rem, 8vw, 4.5rem); color: var(--cream); line-height: 1.1; text-shadow: 0 4px 20px rgba(0,0,0,0.9); margin: 0; }
  .hero-amp { display: block; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 0.5em; color: var(--gold); margin: 0.5rem 0; }
  .hero-date { font-family: 'Cinzel', serif; font-size: 0.85rem; letter-spacing: 0.3em; color: var(--cream-dim); margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--line); display: inline-block; }
  .hero-couple-info { font-size: 0.8rem; color: var(--muted); margin-top: 1rem; font-family: 'Cormorant Garamond', serif; font-style: italic; }

  /* ============ SECTION TITLES ============ */
  .section-title { font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.4em; color: var(--gold); text-transform: uppercase; text-align: center; margin-bottom: 0.5rem; }
  .section-heading { font-family: 'Marcellus', serif; font-size: clamp(2rem, 5vw, 3rem); color: var(--cream); text-align: center; margin-bottom: 1rem; }
  .ornament-divider { display: flex; align-items: center; justify-content: center; gap: 1rem; margin: 1.5rem 0 3rem; color: var(--gold); }
  .ornament-divider .line { height: 1px; width: 80px; background: linear-gradient(90deg, transparent, var(--gold)); }
  .ornament-divider .line.right { background: linear-gradient(90deg, var(--gold), transparent); }

  /* ============ COUNTDOWN ============ */
  .countdown-container { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
  .cd-box { background: rgba(10, 20, 36, 0.8); border: 1px solid var(--line); padding: 1.5rem 1rem; min-width: 90px; text-align: center; position: relative; backdrop-filter: blur(5px); }
  .cd-box::before, .cd-box::after { content: ''; position: absolute; width: 10px; height: 10px; border: 1px solid var(--gold); }
  .cd-box::before { top: 4px; left: 4px; border-right: none; border-bottom: none; }
  .cd-box::after { bottom: 4px; right: 4px; border-left: none; border-top: none; }
  .cd-num { font-family: 'Marcellus', serif; font-size: 2rem; color: var(--gold-bright); display: block; }
  .cd-label { font-family: 'Jost', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; color: var(--muted); text-transform: uppercase; margin-top: 0.5rem; display: block; }

  /* ============ THE COUPLE ============ */
  .couple-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: center; }
  @media (min-width: 768px) { .couple-grid { grid-template-columns: 1fr auto 1fr; gap: 2rem; } }
  .couple-card { text-align: center; position: relative; }
  .couple-photo-wrap { width: 240px; height: 320px; margin: 0 auto 2rem; position: relative; padding: 10px; border: 1px solid var(--gold); }
  .couple-photo-wrap::before { content: ''; position: absolute; inset: 5px; border: 1px solid rgba(212, 175, 55, 0.3); z-index: 2; pointer-events: none; }
  .couple-photo { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.9) contrast(1.1) saturate(0.8) hue-rotate(190deg); }
  .couple-role { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.3em; color: var(--gold); text-transform: uppercase; margin-bottom: 0.5rem; }
  .couple-name { font-family: 'Marcellus', serif; font-size: 2rem; color: var(--cream); margin-bottom: 0.5rem; }
  .couple-fullname { font-size: 0.9rem; color: var(--cream-dim); margin-bottom: 1.5rem; font-style: italic; }
  .couple-parents { font-size: 0.85rem; color: var(--muted); line-height: 1.8; }
  .couple-parents span { display: block; font-family: 'Cinzel', serif; font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold); text-transform: uppercase; margin-bottom: 0.5rem; }
  .couple-amp { font-family: 'Marcellus', serif; font-size: 3rem; color: var(--gold); text-align: center; }

  /* ============ HOLY VERSE ============ */
  .verse-container { text-align: center; max-width: 700px; margin: 0 auto; padding: 3rem 2rem; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); position: relative; background: rgba(4, 7, 13, 0.6); backdrop-filter: blur(5px); }
  .verse-container::before, .verse-container::after { content: '❖'; position: absolute; color: var(--gold); font-size: 1.5rem; background: var(--bg); padding: 0 1rem; }
  .verse-container::before { top: -12px; left: 50%; transform: translateX(-50%); }
  .verse-container::after { bottom: -12px; left: 50%; transform: translateX(-50%); }
  .verse-arabic { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: var(--gold-bright); margin-bottom: 2rem; direction: rtl; }
  .verse-text { font-style: italic; font-size: 1.1rem; color: var(--cream-dim); margin-bottom: 1.5rem; }
  .verse-source { font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.2em; color: var(--gold); }

  /* ============ LOVE STORY ============ */
  .timeline { position: relative; max-width: 600px; margin: 0 auto; padding-left: 30px; }
  .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: var(--line); }
  .timeline-item { position: relative; margin-bottom: 3rem; padding-left: 30px; }
  .timeline-item::before { content: ''; position: absolute; left: -5px; top: 5px; width: 11px; height: 11px; background: var(--bg); border: 1px solid var(--gold); transform: rotate(45deg); }
  .timeline-date { font-family: 'Cinzel', serif; font-size: 0.7rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.5rem; }
  .timeline-title { font-family: 'Marcellus', serif; font-size: 1.4rem; color: var(--cream); margin-bottom: 0.5rem; }
  .timeline-desc { font-size: 0.95rem; color: var(--muted); }

  /* ============ EVENTS ============ */
  .events-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
  @media (min-width: 768px) { .events-grid { grid-template-columns: 1fr 1fr; } }
  .event-card { background: linear-gradient(180deg, rgba(10, 20, 36, 0.8), rgba(4, 7, 13, 0.8)); border: 1px solid var(--line); padding: 3rem 2rem; text-align: center; position: relative; backdrop-filter: blur(5px); }
  .event-card::before { content: ''; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 1px solid rgba(212, 175, 55, 0.1); pointer-events: none; }
  .event-icon { font-size: 2rem; color: var(--gold); margin-bottom: 1.5rem; }
  .event-type { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.3em; color: var(--gold); text-transform: uppercase; margin-bottom: 1rem; }
  .event-title { font-family: 'Marcellus', serif; font-size: 1.8rem; color: var(--cream); margin-bottom: 1.5rem; }
  .event-detail { margin-bottom: 1rem; color: var(--cream-dim); }
  .event-detail i { color: var(--gold); margin-right: 0.5rem; }
  .event-btn { display: inline-block; margin-top: 1.5rem; padding: 0.8rem 2rem; border: 1px solid var(--gold); color: var(--gold); font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; }
  .event-btn:hover { background: var(--gold); color: var(--bg); }

  /* ============ GALLERY ============ */
  .gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  @media (min-width: 768px) { .gallery-grid { grid-template-columns: repeat(3, 1fr); } }
  .gallery-item { aspect-ratio: 3/4; overflow: hidden; cursor: pointer; border: 1px solid var(--line); position: relative; }
  .gallery-item img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.9) contrast(1.1) saturate(0.8) hue-rotate(190deg); transition: transform 0.5s ease; }
  .gallery-item:hover img { transform: scale(1.1); }

  /* ============ FORM SECTIONS ============ */
  .form-card { background: rgba(10, 20, 36, 0.8); border: 1px solid var(--line); padding: 3rem 2rem; max-width: 600px; margin: 0 auto; position: relative; backdrop-filter: blur(5px); }
  .form-card::before { content: ''; position: absolute; inset: 8px; border: 1px solid rgba(212, 175, 55, 0.1); pointer-events: none; }
  .form-group { margin-bottom: 1.5rem; text-align: left; }
  .form-group label { display: block; font-family: 'Jost', sans-serif; font-size: 0.8rem; color: var(--cream-dim); margin-bottom: 0.5rem; }
  .form-control { width: 100%; background: rgba(4, 7, 13, 0.8); border: 1px solid var(--line); color: var(--cream); padding: 0.8rem 1rem; font-family: 'Jost', sans-serif; font-size: 0.9rem; outline: none; transition: border-color 0.3s; }
  .form-control:focus { border-color: var(--gold); }
  textarea.form-control { resize: vertical; min-height: 100px; }
  .btn-gold { background: transparent; border: 1px solid var(--gold); color: var(--gold); padding: 1rem 2rem; font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; width: 100%; }
  .btn-gold:hover { background: var(--gold); color: var(--bg); }
  .wishes-list { max-height: 300px; overflow-y: auto; margin-top: 2rem; padding-right: 10px; }
  .wishes-list::-webkit-scrollbar { width: 4px; }
  .wishes-list::-webkit-scrollbar-thumb { background: var(--gold-deep); }
  .wish-item { background: rgba(4, 7, 13, 0.8); border-left: 2px solid var(--gold); padding: 1rem; margin-bottom: 1rem; }
  .wish-name { font-family: 'Cinzel', serif; font-size: 0.8rem; color: var(--gold); margin-bottom: 0.3rem; }
  .wish-text { font-size: 0.9rem; color: var(--cream-dim); }

  /* ============ INFO CARDS ============ */
  .info-card { background: rgba(10, 20, 36, 0.8); border: 1px solid var(--line); padding: 2rem; text-align: center; margin-bottom: 1.5rem; position: relative; max-width: 500px; margin-left: auto; margin-right: auto; backdrop-filter: blur(5px); }
  .info-card::before { content: ''; position: absolute; inset: 8px; border: 1px solid rgba(212, 175, 55, 0.1); pointer-events: none; }
  .info-card .bank-name { font-family: 'Marcellus', serif; font-size: 1.5rem; color: var(--cream); margin-bottom: 0.5rem; }
  .info-card .acc-num { font-size: 1.2rem; color: var(--gold); letter-spacing: 0.1em; margin: 1rem 0; font-family: 'Cinzel', serif; }
  .info-card .acc-name { font-size: 0.9rem; color: var(--cream-dim); margin-bottom: 1.5rem; }

  /* ============ MUSIC TOGGLE ============ */
  .music-toggle { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; background: var(--bg-2); border: 1px solid var(--gold); border-radius: 50%; color: var(--gold); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 99; box-shadow: 0 0 20px rgba(0,0,0,0.5); transition: all 0.3s; }
  .music-toggle:hover { transform: scale(1.1); background: var(--gold); color: var(--bg); }

  /* ============ FOOTER ============ */
  .footer { text-align: center; padding: 6rem 1.5rem 3rem; position: relative; overflow: hidden; }
  .footer-monogram { font-family: 'Marcellus', serif; font-size: 3rem; color: var(--gold); margin-bottom: 2rem; }
  .footer-thanks { font-family: 'Marcellus', serif; font-size: 2rem; color: var(--cream); margin-bottom: 1.5rem; }
  .footer-closing { font-size: 0.9rem; color: var(--muted); max-width: 400px; margin: 0 auto 3rem; font-style: italic; }
  .footer-families { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.2em; color: var(--gold); text-transform: uppercase; }

  /* Reveal Animation */
  .reveal { opacity: 1; transform: translateY(0); transition: opacity 1s ease, transform 1s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

  /* Floating particles ONLY IN HERO */
  .particle { position: absolute; background: var(--gold-bright); border-radius: 50%; pointer-events: none; box-shadow: 0 0 6px var(--gold); opacity: 0; z-index: 1; }
</style>
</head>
<body>

<button class="music-toggle" id="musicToggle" aria-label="Toggle Music"><i class="fas fa-music"></i></button>

<!-- ============ 1. COVER (GANJIL - PARALLAX) ============ -->
<section class="hero" id="cover">
  <div class="hero-bg" data-speed="0.4"></div>
  <div class="hero-pattern" data-speed="0.2"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content" data-tilt="true">
    <svg class="gate-frame" viewBox="0 0 200 80" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M20 80 C 30 20, 50 20, 60 80" />
      <path d="M60 80 C 70 10, 90 10, 100 80" />
      <path d="M100 80 C 110 10, 130 10, 140 80" />
      <path d="M140 80 C 150 20, 170 20, 180 80" />
      <circle cx="100" cy="30" r="3" fill="currentColor" />
    </svg>
    
    <div class="hero-eyebrow">The Wedding of</div>
    <h1 class="hero-names">Raka<span class="hero-amp">&amp;</span>Sri</h1>
    <div class="hero-couple-info">Putra dari Bapak H. Bukhari &amp; Ibu Hj. Fatimah<br>Putri dari Bapak H. Zainul &amp; Ibu Hj. Khadijah</div>
    <div class="hero-date">Sabtu, 20 Desember 2025</div>
  </div>
</section>

<!-- ============ 2. COUNTDOWN (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal" id="countdown-sec">
  <div class="solid-pattern pattern-songket-1"></div>
  <div class="ornate-frame-solid"></div>
  
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  
  <div class="solid-content">
    <div class="section-title">Save The Date</div>
    <h2 class="section-heading">Hitung Mundur</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="countdown-container" id="countdown">
      <div class="cd-box"><span class="cd-num" id="days">00</span><span class="cd-label">Hari</span></div>
      <div class="cd-box"><span class="cd-num" id="hours">00</span><span class="cd-label">Jam</span></div>
      <div class="cd-box"><span class="cd-num" id="minutes">00</span><span class="cd-label">Mnt</span></div>
      <div class="cd-box"><span class="cd-num" id="seconds">00</span><span class="cd-label">Dtk</span></div>
    </div>
  </div>
</section>

<!-- ============ 3. THE COUPLE (GANJIL - PARALLAX) ============ -->
<section class="base-section parallax-section reveal" id="couple">
  <div class="parallax-bg" style="background-image: url('https://picsum.photos/seed/elegant-blue-bg/1200/1600.jpg');" data-speed="0.15"></div>
  <div class="parallax-pattern pattern-songket-2" data-speed="0.05"></div>
  <div class="parallax-overlay"></div>
  <div class="ornate-frame-parallax" data-tilt="true"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>

  <div class="parallax-content" data-tilt="true">
    <div class="section-title">Bismillahirrahmanirrahim</div>
    <h2 class="section-heading">Mempelai</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="couple-grid">
      <div class="couple-card">
        <div class="couple-photo-wrap"><img src="https://picsum.photos/seed/blue-groom/600/800.jpg" alt="Groom" class="couple-photo"></div>
        <div class="couple-role">The Groom</div>
        <div class="couple-name">Raka</div>
        <div class="couple-fullname">Raka Pratama Bukhari, S.E.</div>
        <div class="couple-parents"><span>Putra Pertama Dari</span>Bapak H. Bukhari Zulkifli<br>& Ibu Hj. Fatimah Azzahra</div>
      </div>
      <div class="couple-amp">&amp;</div>
      <div class="couple-card">
        <div class="couple-photo-wrap"><img src="https://picsum.photos/seed/blue-bride/600/800.jpg" alt="Bride" class="couple-photo"></div>
        <div class="couple-role">The Bride</div>
        <div class="couple-name">Sri</div>
        <div class="couple-fullname">Sri Wahyuni Zainul, S.K.M.</div>
        <div class="couple-parents"><span>Putri Kedua Dari</span>Bapak H. Zainul Abidin<br>& Ibu Hj. Khadijah Rahman</div>
      </div>
    </div>
  </div>
</section>

<!-- ============ 4. HOLY VERSE (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal" id="verse">
  <div class="solid-pattern pattern-songket-1"></div>
  <div class="ornate-frame-solid"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>

  <div class="solid-content">
    <div class="verse-container">
      <p class="verse-arabic">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً</p>
      <p class="verse-text">"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."</p>
      <div class="verse-source">— Q.S. Ar-Rum : 21 —</div>
    </div>
  </div>
</section>

<!-- ============ 5. LOVE STORY (GANJIL - PARALLAX) ============ -->
<section class="base-section parallax-section reveal" id="story">
  <div class="parallax-bg" style="background-image: url('https://picsum.photos/seed/blue-night-scenery/1200/1600.jpg');" data-speed="0.15"></div>
  <div class="parallax-pattern pattern-songket-2" data-speed="0.05"></div>
  <div class="parallax-overlay"></div>
  <div class="ornate-frame-parallax" data-tilt="true"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>

  <div class="parallax-content" data-tilt="true">
    <div class="section-title">Our Journey</div>
    <h2 class="section-heading">Cerita Cinta</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="timeline">
      <div class="timeline-item"><div class="timeline-date">2019</div><h3 class="timeline-title">Pertemuan di Rantau</h3><p class="timeline-desc">Bertemu pertama kali saat samasama merantau di Jakarta. Dari saling membantu, tumbuh rasa saling memahami.</p></div>
      <div class="timeline-item"><div class="timeline-date">2021</div><h3 class="timeline-title">Lamaran (Maresek)</h3><p class="timeline-desc">Dengan restu kedua keluarga, prosesi maresek dilakukan secara adat Minangkabau secara virtual.</p></div>
      <div class="timeline-item"><div class="timeline-date">2025</div><h3 class="timeline-title">Hari Bahagia</h3><p class="timeline-desc">Kembali ke kampung halaman di Padang untuk melaksanakan prosesi pernikahan adat Minangkabau yang penuh makna.</p></div>
    </div>
  </div>
</section>

<!-- ============ 6. EVENTS (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal" id="events">
  <div class="solid-pattern pattern-songket-1"></div>
  <div class="ornate-frame-solid"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>

  <div class="solid-content">
    <div class="section-title">Save The Date</div>
    <h2 class="section-heading">Rangkaian Acara</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="events-grid">
      <div class="event-card"><div class="event-icon"><i class="fas fa-rings-wedding"></i></div><div class="event-type">Akad Nikah</div><h3 class="event-title">Resepsi Akad</h3><p class="event-detail"><i class="far fa-calendar"></i> Sabtu, 20 Desember 2025</p><p class="event-detail"><i class="far fa-clock"></i> 08.00 - 10.00 WIB</p><p class="event-detail"><i class="fas fa-map-marker-alt"></i> Rumah Gadang Keluarga<br>Bukittinggi, Sumatra Barat</p><a href="https://maps.google.com" target="_blank" class="event-btn">Lihat Lokasi</a></div>
      <div class="event-card"><div class="event-icon"><i class="fas fa-glass-cheers"></i></div><div class="event-type">Resepsi</div><h3 class="event-title">Walimatul Ursy</h3><p class="event-detail"><i class="far fa-calendar"></i> Sabtu, 20 Desember 2025</p><p class="event-detail"><i class="far fa-clock"></i> 11.00 - 14.00 WIB</p><p class="event-detail"><i class="fas fa-map-marker-alt"></i> Ballroom Hotel Pusako<br>Bukittinggi, Sumatra Barat</p><a href="https://maps.google.com" target="_blank" class="event-btn">Lihat Lokasi</a></div>
    </div>
  </div>
</section>

<!-- ============ 7. PHOTO GALLERY (GANJIL - PARALLAX) ============ -->
<section class="base-section parallax-section reveal" id="gallery">
  <div class="parallax-bg" style="background-image: url('https://picsum.photos/seed/royal-blue-abstract/1200/1600.jpg');" data-speed="0.15"></div>
  <div class="parallax-pattern pattern-songket-2" data-speed="0.05"></div>
  <div class="parallax-overlay"></div>
  <div class="ornate-frame-parallax" data-tilt="true"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>

  <div class="parallax-content" data-tilt="true">
    <div class="section-title">Our Moments</div>
    <h2 class="section-heading">Galeri Kenangan</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="gallery-grid">
      <div class="gallery-item"><img src="https://picsum.photos/seed/blue-wed-1/600/800.jpg" alt="Gallery 1"></div>
      <div class="gallery-item"><img src="https://picsum.photos/seed/blue-wed-2/600/800.jpg" alt="Gallery 2"></div>
      <div class="gallery-item"><img src="https://picsum.photos/seed/blue-wed-3/600/800.jpg" alt="Gallery 3"></div>
      <div class="gallery-item"><img src="https://picsum.photos/seed/blue-wed-4/600/800.jpg" alt="Gallery 4"></div>
      <div class="gallery-item"><img src="https://picsum.photos/seed/blue-wed-5/600/800.jpg" alt="Gallery 5"></div>
      <div class="gallery-item"><img src="https://picsum.photos/seed/blue-wed-6/600/800.jpg" alt="Gallery 6"></div>
    </div>
  </div>
</section>

<!-- ============ 8. RSVP (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal" id="rsvp">
  <div class="solid-pattern pattern-songket-1"></div>
  <div class="ornate-frame-solid"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>

  <div class="solid-content">
    <div class="section-title">Konfirmasi Kehadiran</div>
    <h2 class="section-heading">RSVP</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="form-card">
      <form id="rsvpForm">
        <div class="form-group"><label>Nama Lengkap</label><input type="text" class="form-control" id="rsvpName" required></div>
        <div class="form-group"><label>Kehadiran</label><select class="form-control" id="rsvpAttendance" required><option value="">Pilih Kehadiran</option><option value="hadir">Insya Allah Hadir</option><option value="tidak">Mohon Maaf Berhalangan</option></select></div>
        <div class="form-group"><label>Jumlah Tamu</label><select class="form-control" id="rsvpGuests" required><option value="1">1 Orang</option><option value="2">2 Orang</option><option value="3">3 Orang</option></select></div>
        <button type="submit" class="btn-gold">Kirim Konfirmasi</button>
      </form>
    </div>
  </div>
</section>

<!-- ============ 9. WEDDING GIFTS (GANJIL - PARALLAX) ============ -->
<section class="base-section parallax-section reveal" id="gifts">
  <div class="parallax-bg" style="background-image: url('https://picsum.photos/seed/navy-blue-luxury/1200/1600.jpg');" data-speed="0.15"></div>
  <div class="parallax-pattern pattern-songket-2" data-speed="0.05"></div>
  <div class="parallax-overlay"></div>
  <div class="ornate-frame-parallax" data-tilt="true"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>

  <div class="parallax-content" data-tilt="true">
    <div class="section-title">Wedding Gift</div>
    <h2 class="section-heading">Tanda Kasih</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <p class="text-center text-[#e8dfc8] mb-8">Doa restu Anda adalah hadiah terindah. Namun, bagi yang ingin memberikan tanda kasih, dapat melalui:</p>
    <div class="info-card">
      <div class="bank-name">Bank Mandiri</div>
      <div class="acc-num">1234 5678 9012</div>
      <div class="acc-name">a.n. Sri Wahyuni Zainul</div>
      <button class="btn-gold" onclick="copyText('123456789012', 'Nomor rekening berhasil disalin!')"><i class="fas fa-copy mr-2"></i>Salin Nomor</button>
    </div>
  </div>
</section>

<!-- ============ 10. LIVE STREAMING (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal" id="streaming">
  <div class="solid-pattern pattern-songket-1"></div>
  <div class="ornate-frame-solid"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>

  <div class="solid-content">
    <div class="section-title">Live Streaming</div>
    <h2 class="section-heading">Saksikan Upacara</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="info-card">
      <i class="fas fa-video text-3xl text-[#d4af37] mb-4"></i>
      <p class="text-[#e8dfc8] mb-6">Bagi tamu yang tidak dapat hadir langsung, kami menyediakan siaran langsung melalui Zoom.</p>
      <a href="https://zoom.us" target="_blank" class="event-btn"><i class="fas fa-video mr-2"></i> Tonton Siaran Langsung</a>
    </div>
  </div>
</section>

<!-- ============ 11. WISHES / GUEST MESSAGES (GANJIL - PARALLAX) ============ -->
<section class="base-section parallax-section reveal" id="wishes">
  <div class="parallax-bg" style="background-image: url('https://picsum.photos/seed/starry-blue-night/1200/1600.jpg');" data-speed="0.15"></div>
  <div class="parallax-pattern pattern-songket-2" data-speed="0.05"></div>
  <div class="parallax-overlay"></div>
  <div class="ornate-frame-parallax" data-tilt="true"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>

  <div class="parallax-content" data-tilt="true">
    <div class="section-title">Ucapan & Doa</div>
    <h2 class="section-heading">Kirim Doa Restu</h2>
    <div class="ornament-divider"><div class="line"></div><i class="fas fa-leaf"></i><div class="line right"></div></div>
    <div class="form-card">
      <form id="wishForm">
        <div class="form-group"><label>Nama</label><input type="text" class="form-control" id="wishName" required></div>
        <div class="form-group"><label>Ucapan</label><textarea class="form-control" id="wishText" required></textarea></div>
        <button type="submit" class="btn-gold">Kirim Ucapan</button>
      </form>
      <div class="wishes-list" id="wishesList">
        <div class="wish-item"><div class="wish-name">Pak H. Bukhari</div><div class="wish-text">Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fi khair. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.</div></div>
        <div class="wish-item"><div class="wish-name">Rara Wijaya</div><div class="wish-text">Selamat menempuh hidup baru kak Raka dan mbak Sri! Semoga langgeng sampai kakek nenek.</div></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ 12. CLOSING (GENAP - SOLID) ============ -->
<section class="base-section solid-section reveal footer" id="closing">
  <div class="solid-pattern pattern-songket-1"></div>
  <div class="ornate-frame-solid"></div>
  <svg class="corner-ornament tl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament tr" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament bl" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>
  <svg class="corner-ornament br" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill="none"/><path d="M10 0 C 15 15, 5 20, 15 35" /><path d="M25 0 C 30 10, 22 15, 30 25" /><circle cx="15" cy="35" r="2" fill="currentColor"/></svg>

  <div class="solid-content">
    <div class="footer-monogram">R &amp; S</div>
    <h2 class="footer-thanks">Terima Kasih</h2>
    <p class="footer-closing">Atas kehadiran dan doa restu yang diberikan, kami mengucapkan terima kasih. Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu kepada kedua mempelai.</p>
    <p class="text-[#fdf6e3] mb-2 font-body text-sm">Kami yang berbahagia,</p>
    <p class="footer-families">Keluarga Besar Bukhari &amp; Zainul</p>
  </div>
</section>

<script>
  // ===== Reveal on Scroll =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ===== Parallax Logic (HANYA UNTUK SECTION GANJIL & HERO) =====
  const parallaxBgs = document.querySelectorAll('.parallax-bg[data-speed], .parallax-pattern[data-speed]');
  const heroBg = document.querySelector('.hero-bg');
  const heroPattern = document.querySelector('.hero-pattern');

  function updateScrollParallax() {
    const scrollY = window.pageYOffset;
    
    // Hero Parallax
    if (heroBg) heroBg.style.transform = 'translateY(' + (scrollY * 0.4) + 'px) scale(1.1)';
    if (heroPattern) heroPattern.style.transform = 'translateY(' + (scrollY * 0.2) + 'px)';

    // Section Ganjil Parallax
    parallaxBgs.forEach(el => {
      const section = el.closest('.parallax-section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const speed = parseFloat(el.dataset.speed);
        const offset = (rect.top - window.innerHeight / 2 + rect.height / 2) * speed;
        el.style.transform = 'translate3d(0, ' + (offset * -1) + 'px, 0) scale(1.1)';
      }
    });
  }

  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      requestAnimationFrame(() => {
        updateScrollParallax();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
  updateScrollParallax();

  // ===== Mouse-Tracking 3D Tilt (HANYA UNTUK SECTION GANJIL & HERO) =====
  const tiltElements = document.querySelectorAll('[data-tilt="true"]');
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5);
    targetY = (e.clientY / window.innerHeight - 0.5);
  });

  function animateTilt() {
    mouseX += (targetX - mouseX) * 0.06;
    mouseY += (targetY - mouseY) * 0.06;

    tiltElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        if (el.classList.contains('ornate-frame-parallax')) {
          el.style.transform = 'translate3d(' + (mouseX * 15) + 'px, ' + (mouseY * 15) + 'px, 0)';
        } else {
          el.style.transform = 'rotateY(' + (mouseX * 4) + 'deg) rotateX(' + (-mouseY * 4) + 'deg) translateZ(30px)';
        }
      }
    });
    requestAnimationFrame(animateTilt);
  }
  animateTilt();

  // ===== Floating Particles (ONLY IN HERO) =====
  function createHeroParticles() {
    const heroSection = document.getElementById('cover');
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 4 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animation = 'floatParticle ' + (Math.random() * 10 + 8) + 's ease-in-out infinite';
      particle.style.animationDelay = Math.random() * 5 + 's';
      heroSection.appendChild(particle);
    }
  }
  createHeroParticles();

  const particleStyle = document.createElement('style');
  particleStyle.textContent = '
    @keyframes floatParticle {
      0%, 100% { opacity: 0; transform: translate(0, 0); }
      50% { opacity: 0.6; transform: translate(20px, -40px); }
    }
  ';
  document.head.appendChild(particleStyle);

  // ===== Countdown Timer =====
  const weddingDate = new Date('2025-12-20T08:00:00+07:00').getTime();
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    if (distance < 0) return;
    document.getElementById('days').innerText = String(Math.floor(distance / 86400000)).padStart(2, '0');
    document.getElementById('hours').innerText = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('minutes').innerText = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('seconds').innerText = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
  }
  updateCountdown(); setInterval(updateCountdown, 1000);

  // ===== Background Music (Saluang/Flute Ambience simulation) =====
  const musicToggle = document.getElementById('musicToggle');
  let audioCtx, isPlaying = false, masterGain;
  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioCtx.destination);
    // Using notes that resemble a traditional bamboo flute (Saluang) scale
    [146.83, 220, 293.66, 369.99].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine'; // smoother sine wave for flute feel
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() * 8 - 4);
      gain.gain.value = 0.1 / (i + 1);
      osc.connect(gain); gain.connect(masterGain); osc.start();
    });
  }
  musicToggle.addEventListener('click', () => {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    isPlaying = !isPlaying;
    musicToggle.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-music"></i>';
    masterGain.gain.linearRampToValueAtTime(isPlaying ? 0.15 : 0, audioCtx.currentTime + 1.5);
  });

  // ===== Forms Logic =====
  document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault(); alert('Terima kasih, konfirmasi kehadiran Anda telah terkirim.'); this.reset();
  });
  document.getElementById('wishForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('wishName').value;
    const text = document.getElementById('wishText').value;
    const list = document.getElementById('wishesList');
    const newItem = document.createElement('div');
    newItem.className = 'wish-item';
    newItem.innerHTML = '<div class="wish-name">' + (name) + '</div><div class="wish-text">' + (text) + '</div>';
    list.prepend(newItem); this.reset();
  });

  function copyText(text, message) {
    navigator.clipboard.writeText(text).then(() => alert(message)).catch(() => {
      const textarea = document.createElement('textarea'); textarea.value = text;
      document.body.appendChild(textarea); textarea.select(); document.execCommand('copy');
      document.body.removeChild(textarea); alert(message);
    });
  }
</script>

  // ===== updateInvitation for editor system =====
  window.updateInvitation = function(data) {
    if (data.countdownDate) {
      window.weddingDate = new Date(data.countdownDate).getTime();
      if (typeof updateCountdown === "function") updateCountdown();
    }
  };
  // ===== postMessage listener =====
  window.addEventListener("message", function(e) {
    if (e.data.type === "UPDATE") {
      if (window.updateInvitation) window.updateInvitation(e.data.payload);
    }
  });
</body>
</html>`;

// ==================== Demo Data ====================
export const DEMO_DATA_ELITE: Record<string, string> = {
  'bride-nick': 'Sophia',
  'groom-nick': 'Alexander',
  'date-text': 'Saturday, October 24th, 2026',
  'countdown-master': '2026-10-24T10:00',
  'couple-title': 'Two Souls, One Heart',
  'couple-sub': 'We invite you to share in our joy as we exchange our vows.',
  'groom-full': 'Alexander Pierce',
  'groom-role': 'The Groom',
  'groom-photo': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  'groom-dad': 'Mr. Robert Pierce',
  'groom-mom': 'Mrs. Elena Pierce',
  'bride-full': 'Sophia Laurent',
  'bride-role': 'The Bride',
  'bride-photo': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'bride-dad': 'Mr. Arthur Laurent',
  'bride-mom': 'Mrs. Clara Laurent',
  'verse-text': '"And above all these put on love, which binds everything together in perfect harmony."',
  'verse-source': 'Colossians 3:14',
  'story-date-1': 'June 2018',
  'story-title-1': 'First Meeting',
  'story-desc-1': 'We met at a small coffee shop in the city.',
  'story-date-2': 'Dec 2024',
  'story-title-2': 'The Proposal',
  'story-desc-2': 'Under the stars, a promise was made to last forever.',
  'akad-date': 'Saturday, October 24, 2026',
  'akad-time': '08:00 AM - 10:00 AM',
  'akad-place': 'Grand Heritage Mosque',
  'resepsi-date': 'Saturday, October 24, 2026',
  'resepsi-time': '07:00 PM - End',
  'resepsi-place': 'The Ritz-Carlton Ballroom',
  'gal-1': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80',
  'gal-2': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80',
  'gal-3': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&q=80',
  'gal-4': 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80',
  'gal-5': 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80',
  'gal-6': 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=400&q=80',
  'rsvp-title': 'Will You Join Us?',
  'rsvp-desc': 'Please kindly confirm your attendance by October 1st, 2026.',
  'bank-name': 'BCA',
  'bank-acc': '1234567890',
  'bank-holder': 'Alexander Pierce',
  'stream-title': 'Virtual Wedding',
  'stream-desc': 'For friends and family who cannot attend physically.',
  'wishes-title': 'Guest Book',
  'wishes-desc': 'Leave your warmest wishes and blessings for our marriage.',
  'closing-thanks': 'Terima Kasih',
  'closing-fam': 'The Pierce & Laurent Families',
};

export const DEMO_DATA_HONEY: Record<string, string> = {
  brideName: 'Sienna',
  groomName: 'Arka',
  heroDate: '20 . 12 . 2025',
  brideFull: 'Sienna Pradipta Reswari',
  groomFull: 'Arka Mahesa Wijaya',
  brideParents: 'Bapak Surya Pratama, S.E.<br>& Ibu Lestari Wulandari, S.KM.',
  groomParents: 'Bapak Dr. Wijaya Kusuma, M.Sc.<br>& Ibu Maharani Anggraini, S.Pd.',
  bridePhoto: 'https://picsum.photos/seed/bride-sienna-wedding/600/800.jpg',
  groomPhoto: 'https://picsum.photos/seed/groom-arka-wedding/600/800.jpg',
  akadDate: 'Sabtu, 20 Desember 2025',
  akadTime: '08.00 — 10.00 WIB',
  akadPlace: 'Masjid Agung Al-Azhar<br>Jakarta Selatan',
  akadMaps: 'Masjid Agung Al-Azhar Jakarta',
  resepsiDate: 'Sabtu, 20 Desember 2025',
  resepsiTime: '11.00 — 14.00 WIB',
  resepsiPlace: 'The Ritz-Carlton Ballroom<br>Jakarta Selatan',
  resepsiMaps: 'The Ritz-Carlton Jakarta',
  countdownDate: '2025-12-20T08:00:00+07:00',
  gallery1: 'https://picsum.photos/seed/wedding-gallery-1/600/800.jpg',
  gallery2: 'https://picsum.photos/seed/wedding-gallery-2/600/800.jpg',
  gallery3: 'https://picsum.photos/seed/wedding-gallery-3/600/800.jpg',
  gallery4: 'https://picsum.photos/seed/wedding-gallery-4/600/800.jpg',
  gallery5: 'https://picsum.photos/seed/wedding-gallery-5/600/800.jpg',
  gallery6: 'https://picsum.photos/seed/wedding-gallery-6/600/800.jpg',
};

export const DEMO_DATA_FOREST_NATURE: Record<string, string> = {
  brideName: 'Elena',
  groomName: 'Arthur',
  coverSubtitle: 'The Wedding Celebration Of',
  bridePhoto: 'https://images.unsplash.com/photo-1543130732-4b8da601004b?q=80&w=600&auto=format&fit=crop',
  groomPhoto: 'https://images.unsplash.com/photo-1595290263309-84d436ec0dd8?q=80&w=600&auto=format&fit=crop',
  brideInfo: 'Putri dari Bapak John & Ibu Isobel.<br>Wanita anggun yang mewarnai dunia Arthur. Pecinta seni dan keindahan alam semesta.',
  groomInfo: 'Putra dari Bapak Uther & Ibu Igraine.<br>Seorang pria yang menemukan kedamaiannya dalam senyum Elena. Penikmat kopi dan penjelajah alam.',
  verseText: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."',
  verseSource: 'Ar-Rum: 21',
  akadDate: 'Sabtu, 28 Oktober 2026',
  akadTime: '08:00 - 10:00 WIB',
  akadPlace: '<strong>Pine Forest Camp</strong><br>Lembang, Bandung, Jawa Barat',
  akadMaps: 'Pine Forest Camp Lembang Bandung',
  resepsiDate: 'Sabtu, 28 Oktober 2026',
  resepsiTime: '11:00 - 14:00 WIB',
  resepsiPlace: '<strong>Pine Forest Camp</strong><br>Lembang, Bandung, Jawa Barat',
  resepsiMaps: 'Pine Forest Camp Lembang Bandung',
  countdownDate: '2026-10-28T08:00:00+07:00',
  gallery1: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop',
  gallery2: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
  gallery3: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop',
  gallery4: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop',
  bankName: 'BCA',
  bankAcc: '1234567890',
  bankHolder: 'a.n Arthur Pendragon',
  closingThanks: 'Terima Kasih',
  closingNames: 'Arthur & Elena',
};

export const DEMO_DATA_JAVA_BATIK: Record<string, string> = {
  brideName: 'Sekarwangi',
  groomName: 'Baskoro',
  heroDate: 'Sabtu, 20 Desember 2025',
  coupleInfo: 'Putra dari Bapak Suryo &amp; Ibu Dewi<br>Putri dari Bapak Ronggowarsito &amp; Ibu Retno',
  brideFull: 'Raden Ayu Sekarwangi Putri, S.Ked.',
  groomFull: 'Raden Mas Baskoro Wicaksono, S.T.',
  brideParents: 'Bapak R. Ronggowarsito, M.M.<br>& Ibu R. Ayu Maharani Dewi',
  groomParents: 'Bapak R. Suryo Negoro, S.H.<br>& Ibu R. Ayu Retno Wulandari',
  bridePhoto: 'https://picsum.photos/seed/javanese-bride/600/800.jpg',
  groomPhoto: 'https://picsum.photos/seed/javanese-groom/600/800.jpg',
  akadDate: 'Sabtu, 20 Desember 2025',
  akadTime: '08.00 — 10.00 WIB',
  akadPlace: 'Pendopo Agung Keraton<br>Yogyakarta',
  akadMaps: 'Pendopo Agung Keraton Yogyakarta',
  resepsiDate: 'Sabtu, 20 Desember 2025',
  resepsiTime: '11.00 — 14.00 WIB',
  resepsiPlace: 'Ballroom Hotel Phoenix<br>Yogyakarta',
  resepsiMaps: 'Hotel Phoenix Yogyakarta',
  countdownDate: '2025-12-20T08:00:00+07:00',
  gallery1: 'https://picsum.photos/seed/java-wed-1/600/800.jpg',
  gallery2: 'https://picsum.photos/seed/java-wed-2/600/800.jpg',
  gallery3: 'https://picsum.photos/seed/java-wed-3/600/800.jpg',
  gallery4: 'https://picsum.photos/seed/java-wed-4/600/800.jpg',
  gallery5: 'https://picsum.photos/seed/java-wed-5/600/800.jpg',
  gallery6: 'https://picsum.photos/seed/java-wed-6/600/800.jpg',
  bankName: 'Bank BCA',
  bankAcc: '1234 5678 9012',
  bankHolder: 'Raden Ayu Sekarwangi',
  closingThanks: 'Matur Nuwun',
  closingFam: 'Keluarga Besar Raden Mas Baskoro & Raden Ayu Sekarwangi',
};

export const DEMO_DATA_WEST_SUMATRA: Record<string, string> = {
  'bride-nick': 'Sri',
  'groom-nick': 'Raka',
  'bride-full': 'Sri Wahyuni Zainul',
  'groom-full': 'Raka Pratama Bukhari',
  'countdown-master': '2025-12-20T08:00:00+07:00',
  'hero-date': '20 . 12 . 2025',
};


// ==================== Template Config ====================
export interface TemplateConfig {
  html: string;
  demoData: Record<string, string>;
  // Maps editor field IDs (kebab-case) → iframe message keys
  // Elite Wedding: no keyMap needed (uses kebab-case directly via e- prefix)
  // Honey Wedding: maps kebab-case to camelCase for updateInvitation()
  keyMap?: Record<string, string>;
}

export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  'Elite Wedding': { html: ELITE_WEDDING_TEMPLATE, demoData: DEMO_DATA_ELITE },
  'Honey Wedding': {
    html: HONEY_WEDDING_TEMPLATE,
    demoData: DEMO_DATA_HONEY,
    keyMap: {
      'bride-nick': 'brideName',
      'groom-nick': 'groomName',
      'date-text': 'heroDate',
      'countdown-master': 'countdownDate',
      'bride-full': 'brideFull',
      'groom-full': 'groomFull',
      'bride-photo': 'bridePhoto',
      'groom-photo': 'groomPhoto',
      'akad-date': 'akadDate',
      'akad-time': 'akadTime',
      'akad-place': 'akadPlace',
      'resepsi-date': 'resepsiDate',
      'resepsi-time': 'resepsiTime',
      'resepsi-place': 'resepsiPlace',
      'gal-1': 'gallery1',
      'gal-2': 'gallery2',
      'gal-3': 'gallery3',
      'gal-4': 'gallery4',
      'gal-5': 'gallery5',
      'gal-6': 'gallery6',
    },
  },
  'Forest Nature': {
    html: FOREST_NATURE_TEMPLATE,
    demoData: DEMO_DATA_FOREST_NATURE,
    keyMap: {
      'bride-nick': 'brideName',
      'groom-nick': 'groomName',
      'countdown-master': 'countdownDate',
      'bride-photo': 'bridePhoto',
      'groom-photo': 'groomPhoto',
      'verse-text': 'verseText',
      'verse-source': 'verseSource',
      'akad-date': 'akadDate',
      'akad-time': 'akadTime',
      'akad-place': 'akadPlace',
      'resepsi-date': 'resepsiDate',
      'resepsi-time': 'resepsiTime',
      'resepsi-place': 'resepsiPlace',
      'gal-1': 'gallery1',
      'gal-2': 'gallery2',
      'gal-3': 'gallery3',
      'gal-4': 'gallery4',
      'bank-name': 'bankName',
      'bank-acc': 'bankAcc',
      'bank-holder': 'bankHolder',
      'closing-thanks': 'closingThanks',
    },
  },
  'Java Batik': {
    html: JAVA_BATIK_TEMPLATE,
    demoData: DEMO_DATA_JAVA_BATIK,
    keyMap: {
      'bride-nick': 'brideName',
      'groom-nick': 'groomName',
      'date-text': 'heroDate',
      'countdown-master': 'countdownDate',
      'bride-full': 'brideFull',
      'groom-full': 'groomFull',
      'bride-photo': 'bridePhoto',
      'groom-photo': 'groomPhoto',
      'akad-date': 'akadDate',
      'akad-time': 'akadTime',
      'akad-place': 'akadPlace',
      'resepsi-date': 'resepsiDate',
      'resepsi-time': 'resepsiTime',
      'resepsi-place': 'resepsiPlace',
      'gal-1': 'gallery1',
      'gal-2': 'gallery2',
      'gal-3': 'gallery3',
      'gal-4': 'gallery4',
      'gal-5': 'gallery5',
      'gal-6': 'gallery6',
      'bank-name': 'bankName',
      'bank-acc': 'bankAcc',
      'bank-holder': 'bankHolder',
      'closing-thanks': 'closingThanks',
      'closing-fam': 'closingFam',
    },
  },
  'West Sumatra': {
    html: WEST_SUMATRA_TEMPLATE,
    demoData: DEMO_DATA_WEST_SUMATRA,
  },
};

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  html: ELITE_WEDDING_TEMPLATE,
  demoData: DEMO_DATA_ELITE,
};
