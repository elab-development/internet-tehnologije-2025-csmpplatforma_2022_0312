-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jan 14, 2026 at 06:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `csmp_baza`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrator`
--

CREATE TABLE `administrator` (
  `adminID` int(11) NOT NULL,
  `ime` varchar(100) NOT NULL,
  `kod` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `administrator`
--

INSERT INTO `administrator` (`adminID`, `ime`, `kod`) VALUES
(1, 'pera', 'pera123'),
(2, 'kiza', 'kiza123');

-- --------------------------------------------------------

--
-- Table structure for table `grupa`
--

CREATE TABLE `grupa` (
  `grupaID` int(11) NOT NULL,
  `naziv` varchar(100) NOT NULL,
  `godina` int(11) NOT NULL,
  `nastavnikID` int(11) NOT NULL,
  `sadrzajID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nastavnik`
--

CREATE TABLE `nastavnik` (
  `nastavnikID` int(11) NOT NULL,
  `ime` varchar(100) NOT NULL,
  `prezime` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(15) NOT NULL,
  `adminID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nastavnik`
--

INSERT INTO `nastavnik` (`nastavnikID`, `ime`, `prezime`, `username`, `password`, `adminID`) VALUES
(1, 'Marko', 'Marković', 'marko_profa', '$2b$10$5yAtROq4', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ocena`
--

CREATE TABLE `ocena` (
  `ocenaID` int(11) NOT NULL,
  `vrednost` int(11) NOT NULL,
  `komentar` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ocena`
--

INSERT INTO `ocena` (`ocenaID`, `vrednost`, `komentar`) VALUES
(1, 10, 'Odlično odrađen projekat, sve radi.');

-- --------------------------------------------------------

--
-- Table structure for table `predaja`
--

CREATE TABLE `predaja` (
  `predajaID` int(11) NOT NULL,
  `studentID` int(11) NOT NULL,
  `sadrzajID` int(11) NOT NULL,
  `datumPredaje` date NOT NULL,
  `ocenaID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projekat`
--

CREATE TABLE `projekat` (
  `projekatID` int(11) NOT NULL,
  `naziv` varchar(100) NOT NULL,
  `opis` text NOT NULL,
  `studentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sadrzaj`
--

CREATE TABLE `sadrzaj` (
  `sadrzajID` int(11) NOT NULL,
  `naziv` int(100) NOT NULL,
  `tip` varchar(100) NOT NULL,
  `maxPoena` int(11) NOT NULL,
  `rok` date NOT NULL,
  `nastavnikID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `studentID` int(11) NOT NULL,
  `ime` varchar(100) NOT NULL,
  `prezime` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(15) NOT NULL,
  `adminID` int(11) NOT NULL,
  `grupaID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administrator`
--
ALTER TABLE `administrator`
  ADD PRIMARY KEY (`adminID`);

--
-- Indexes for table `grupa`
--
ALTER TABLE `grupa`
  ADD PRIMARY KEY (`grupaID`),
  ADD KEY `nastavnikID` (`nastavnikID`),
  ADD KEY `sadrzajID` (`sadrzajID`);

--
-- Indexes for table `nastavnik`
--
ALTER TABLE `nastavnik`
  ADD PRIMARY KEY (`nastavnikID`),
  ADD KEY `adminID` (`adminID`);

--
-- Indexes for table `ocena`
--
ALTER TABLE `ocena`
  ADD PRIMARY KEY (`ocenaID`);

--
-- Indexes for table `predaja`
--
ALTER TABLE `predaja`
  ADD PRIMARY KEY (`predajaID`,`studentID`,`sadrzajID`),
  ADD KEY `ocenaID` (`ocenaID`),
  ADD KEY `sadrzajID` (`sadrzajID`),
  ADD KEY `studentID` (`studentID`);

--
-- Indexes for table `projekat`
--
ALTER TABLE `projekat`
  ADD PRIMARY KEY (`projekatID`),
  ADD KEY `studentID` (`studentID`);

--
-- Indexes for table `sadrzaj`
--
ALTER TABLE `sadrzaj`
  ADD PRIMARY KEY (`sadrzajID`),
  ADD KEY `nastavnikID` (`nastavnikID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`studentID`),
  ADD KEY `adminID` (`adminID`),
  ADD KEY `grupaID` (`grupaID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `administrator`
--
ALTER TABLE `administrator`
  MODIFY `adminID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `grupa`
--
ALTER TABLE `grupa`
  MODIFY `grupaID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nastavnik`
--
ALTER TABLE `nastavnik`
  MODIFY `nastavnikID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ocena`
--
ALTER TABLE `ocena`
  MODIFY `ocenaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `predaja`
--
ALTER TABLE `predaja`
  MODIFY `predajaID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projekat`
--
ALTER TABLE `projekat`
  MODIFY `projekatID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sadrzaj`
--
ALTER TABLE `sadrzaj`
  MODIFY `sadrzajID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `studentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `grupa`
--
ALTER TABLE `grupa`
  ADD CONSTRAINT `grupa_ibfk_1` FOREIGN KEY (`nastavnikID`) REFERENCES `nastavnik` (`nastavnikID`),
  ADD CONSTRAINT `grupa_ibfk_2` FOREIGN KEY (`sadrzajID`) REFERENCES `sadrzaj` (`sadrzajID`);

--
-- Constraints for table `nastavnik`
--
ALTER TABLE `nastavnik`
  ADD CONSTRAINT `nastavnik_ibfk_1` FOREIGN KEY (`adminID`) REFERENCES `administrator` (`adminID`);

--
-- Constraints for table `predaja`
--
ALTER TABLE `predaja`
  ADD CONSTRAINT `predaja_ibfk_1` FOREIGN KEY (`ocenaID`) REFERENCES `ocena` (`ocenaID`),
  ADD CONSTRAINT `predaja_ibfk_2` FOREIGN KEY (`sadrzajID`) REFERENCES `sadrzaj` (`sadrzajID`),
  ADD CONSTRAINT `predaja_ibfk_3` FOREIGN KEY (`studentID`) REFERENCES `student` (`studentID`);

--
-- Constraints for table `projekat`
--
ALTER TABLE `projekat`
  ADD CONSTRAINT `projekat_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `student` (`studentID`);

--
-- Constraints for table `sadrzaj`
--
ALTER TABLE `sadrzaj`
  ADD CONSTRAINT `sadrzaj_ibfk_1` FOREIGN KEY (`nastavnikID`) REFERENCES `nastavnik` (`nastavnikID`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`adminID`) REFERENCES `administrator` (`adminID`),
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`grupaID`) REFERENCES `grupa` (`grupaID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
