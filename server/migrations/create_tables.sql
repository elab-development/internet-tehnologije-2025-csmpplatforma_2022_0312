CREATE TABLE administrator (
    adminID INT PRIMARY KEY AUTO_INCREMENT,
    ime VARCHAR(50) NOT NULL,
    kod VARCHAR(20) NOT NULL
);

CREATE TABLE ocena (
    ocenaID INT PRIMARY KEY AUTO_INCREMENT,
    vrednost INT NOT NULL,
    komentar TEXT
);

CREATE TABLE nastavnik (
    nastavnikID INT PRIMARY KEY AUTO_INCREMENT,
    ime VARCHAR(50) NOT NULL,
    prezime VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    adminID INT
);

CREATE TABLE sadrzaj (
    sadrzajID INT PRIMARY KEY AUTO_INCREMENT,
    naziv VARCHAR(100) NOT NULL,
    tip VARCHAR(50),
    maxPoena INT,
    rok DATE,
    nastavnikID INT
);

CREATE TABLE grupa (
    grupaID INT PRIMARY KEY AUTO_INCREMENT,
    naziv VARCHAR(50) NOT NULL,
    godina INT,
    nastavnikID INT,
    sadrzajID INT
);

CREATE TABLE student (
    studentID INT PRIMARY KEY AUTO_INCREMENT,
    ime VARCHAR(50) NOT NULL,
    prezime VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    adminID INT,
    grupaID INT
);

CREATE TABLE projekat (
    projekatID INT PRIMARY KEY AUTO_INCREMENT,
    naziv VARCHAR(100) NOT NULL,
    opis TEXT,
    studentID INT
);

CREATE TABLE predaja (
    predajaID INT AUTO_INCREMENT,
    studentID INT NOT NULL,
    sadrzajID INT NOT NULL,
    datumPredaje DATE,
    ocenaID INT,
    PRIMARY KEY (predajaID, studentID, sadrzajID) 
);