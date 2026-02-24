                                                CSMP Platforma
Autori: Zoran Stojanovic 2022/0094; Luka Djokic 2022/0312

Glavni fokus aplikacije je pametno upravljanje akademskim sadržajem, projektima i ocenjivanjem, sve na jednom mestu.
Sistem je podeljen na tri nivoa pristupa:
      1. Studenti: Pregledaju materijale, rade na projektima i predaju svoje radove kroz sistem.
      2. Nastavnici: Kreiraju sav nastavni sadržaj (zadatke, testove), upravljaju grupama studenata i ocenjuju radove.
      3. Administratori: Zaduženi su za održavanje, tehničku podršku i kompletno upravljanje korisničkim nalozima. Oni registruju nove studente i nastavnike.
Takođe, dodali smo dodatne provere za pristup platformi uz pomoc jwt (jsonweb tocken), dodatne sigurnosti za zaštitu od raznih napada, swagger alat koji prikazuje na jednoj stranici sve dodate rute, 2 tipa eskternih API-ja za potvrdu regstracije putem email-a i mogućnosti da se projekti downloaduju kao pdf fajlovi, imamo dodatu i statistiku za prikaz prosečne ocene studenta na platformi...

Pokretanje aplikacije
    - Pokretanje aplikacije je uz pomoć Docker-a. U terminalu našeg projekta, podižemo docker kontjnere (3 tipa: clinet, api i database kontejner) uz pomoć komande docker-compose up --build i tako startujemo našu aplikaciju
    - Da bismo mogli da manipulišemo aplkacijom pokrećemo seeder (komanda docker exec -it <naziv kontejnera gde nam je backend> npx knex seed:run --env production) kako bismo u tabeli administrator dodali admina koji će da upravlja sistemom. Sve ostale korisnike platforme i rađenje bilo čega radimo unutar aplikacije
    - Nakon toga pristupamo login stranici na linku: http://localhost:5173/login
    - Swagger alatu pristupamo na linku: http://localhost:5000/api-docs/
    - Mailtrap sajtu (našem profilu) pristupamo na linku: https://mailtrap.io/home
    - Pdf shift sajtu (našem profilu) pristupamo na linku: https://app.pdfshift.io/env/
    - Online verzija aplikacije (Live demo) nalazi se na linku: https://frontend-csmp.onrender.com

Tehnologije
   - Frontend: React (Vite), Axios, Google Charts
   - Backend: Node.js, Express, Knex.js, swagger
   - Baza: MySQL
   - DevOps: Docker, Docker Compose





