-- Administrator veze
ALTER TABLE nastavnik ADD CONSTRAINT fk_nastavnik_admin FOREIGN KEY (adminID) REFERENCES administrator(adminID);
ALTER TABLE student ADD CONSTRAINT fk_student_admin FOREIGN KEY (adminID) REFERENCES administrator(adminID);

-- Nastavnik veze
ALTER TABLE sadrzaj ADD CONSTRAINT fk_sadrzaj_nastavnik FOREIGN KEY (nastavnikID) REFERENCES nastavnik(nastavnikID);
ALTER TABLE grupa ADD CONSTRAINT fk_grupa_nastavnik FOREIGN KEY (nastavnikID) REFERENCES nastavnik(nastavnikID);

-- Sadrzaj veze
ALTER TABLE grupa ADD CONSTRAINT fk_grupa_sadrzaj FOREIGN KEY (sadrzajID) REFERENCES sadrzaj(sadrzajID);

-- Student i Grupa veze
ALTER TABLE student ADD CONSTRAINT fk_student_grupa FOREIGN KEY (grupaID) REFERENCES grupa(grupaID);
ALTER TABLE projekat ADD CONSTRAINT fk_projekat_student FOREIGN KEY (studentID) REFERENCES student(studentID) ON DELETE CASCADE;

-- ASOCIJATIVNE VEZE ZA TABELU PREDAJA
ALTER TABLE predaja ADD CONSTRAINT fk_predaja_student FOREIGN KEY (studentID) REFERENCES student(studentID) ON DELETE CASCADE;
ALTER TABLE predaja ADD CONSTRAINT fk_predaja_sadrzaj FOREIGN KEY (sadrzajID) REFERENCES sadrzaj(sadrzajID) ON DELETE CASCADE;
ALTER TABLE predaja ADD CONSTRAINT fk_predaja_ocena FOREIGN KEY (ocenaID) REFERENCES ocena(ocenaID) ON DELETE SET NULL;