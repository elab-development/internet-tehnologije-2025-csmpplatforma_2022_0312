-- Tip: Postavljanje dodatnih ograničenja (UNIQUE)
ALTER TABLE student ADD CONSTRAINT unique_student_username UNIQUE (username);
ALTER TABLE nastavnik ADD CONSTRAINT unique_nastavnik_username UNIQUE (username);

-- Tip: Izmena postojeće kolone (MODIFY)
ALTER TABLE student MODIFY COLUMN password VARCHAR(255) NOT NULL;
ALTER TABLE nastavnik MODIFY COLUMN password VARCHAR(255) NOT NULL;

-- Tip: Dodavanje kolone (ADD COLUMN)
ALTER TABLE administrator ADD COLUMN poslednjiLogin TIMESTAMP;

-- Tip: Brisanje kolone (DROP COLUMN)
ALTER TABLE administrator DROP COLUMN poslednjiLogin;