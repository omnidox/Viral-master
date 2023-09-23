-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2023 at 05:01 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `viral_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `CommentId` int(11) DEFAULT NULL,
  `PostId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `content`, `createdAt`, `updatedAt`, `CommentId`, `PostId`, `UserId`) VALUES
(1, 'This is a great post!', '2023-05-06 03:00:20', '2023-05-06 03:00:20', NULL, NULL, NULL),
(2, 'I agree with you.', '2023-05-06 03:00:20', '2023-05-06 03:00:20', NULL, NULL, NULL),
(3, 'Thanks for sharing.', '2023-05-06 03:00:20', '2023-05-06 03:00:20', NULL, NULL, NULL),
(4, 'Interesting perspective.', '2023-05-06 03:00:20', '2023-05-06 03:00:20', NULL, NULL, NULL),
(5, 'I learned something new.', '2023-05-06 03:00:20', '2023-05-06 03:00:20', NULL, NULL, NULL),
(6, 'Can you provide a source?', '2023-05-06 03:00:20', '2023-05-06 03:00:20', NULL, NULL, NULL),
(7, 'Reply to comment 1.', '2023-05-06 03:00:20', '2023-05-06 03:00:20', 1, NULL, NULL),
(8, 'Reply to comment 2.', '2023-05-06 03:00:20', '2023-05-06 03:00:20', 2, NULL, NULL),
(9, 'Reply to comment 7.', '2023-05-06 03:00:20', '2023-05-06 03:00:20', 7, NULL, NULL),
(10, 'Great point, I agree.', '2023-05-06 03:00:20', '2023-05-06 03:00:20', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `content`, `createdAt`, `updatedAt`, `UserId`) VALUES
(1, 'Post 1', 'This is the content of post 1.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(2, 'Post 2', 'This is the content of post 2.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(3, 'Post 3', 'This is the content of post 3.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(4, 'Post 4', 'This is the content of post 4.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(5, 'Post 5', 'This is the content of post 5.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(6, 'Post 6', 'This is the content of post 6.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(7, 'Post 7', 'This is the content of post 7.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(8, 'Post 8', 'This is the content of post 8.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(9, 'Post 9', 'This is the content of post 9.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(10, 'Post 10', 'This is the content of post 10.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(11, 'Post 11', 'This is the content of post 11.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(12, 'Post 12', 'This is the content of post 12.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(13, 'Post 13', 'This is the content of post 13.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(14, 'Post 14', 'This is the content of post 14.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(15, 'Post 15', 'This is the content of post 15.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(16, 'Post 16', 'This is the content of post 16.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(17, 'Post 17', 'This is the content of post 17.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(18, 'Post 18', 'This is the content of post 18.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(19, 'Post 19', 'This is the content of post 19.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(20, 'Post 20', 'This is the content of post 20.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL),
(21, 'Post 21', 'This is the content of post 21.', '2023-05-06 03:00:05', '2023-05-06 03:00:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `username`, `email`, `password`, `profilePicture`, `bio`, `dateOfBirth`, `createdAt`, `updatedAt`) VALUES
(1, 'John', 'Doe', 'john_doe', 'john.doe@example.com', '$2a$10$rKSx6xJbR.9RPXpExmpFye.Ll17GEQLMduMnLBHEpmzGKiUL3CGlO', 'https://example.com/john_doe.jpg', 'Software developer and tech enthusiast', '1990-01-01', '2023-05-06 02:48:36', '2023-05-06 02:48:36'),
(2, 'Jane', 'Smith', 'jane_smith', 'jane.smith@example.com', '$2a$10$iCcOiejuNlHDmgEK612T9OPRUfl4vHbRCDW8nXo64Iu4/Sd.whBHu', 'https://example.com/jane_smith.jpg', 'Digital artist and designer', '1992-05-15', '2023-05-06 02:48:36', '2023-05-06 02:48:36'),
(3, 'Alice', 'Johnson', 'alice_johnson', 'alice.johnson@example.com', '$2a$10$Eu1w01VPw2OpuiACk9XfmO9g5D.qqtjkp6oyX.Q8jbaFEt6gpyBWm', 'https://example.com/alice_johnson.jpg', 'Freelance writer and blogger', '1988-03-21', '2023-05-06 02:48:36', '2023-05-06 02:48:36'),
(4, 'Robert', 'UpdatedBrown', 'bob_brown', 'bob.brown@example.com', '$2a$10$OGaNFKmxz3ld1Kf9PVBjIuc1E5t1MovQ6HKiSC1K5BBc0pUkuJFgW', 'https://example.com/bob_brown.jpg', 'Full-stack developer and open source enthusiast', '1994-11-12', '2023-05-06 02:48:36', '2023-05-06 02:52:21'),
(5, 'Charlie', 'Wilson', 'charlie_wilson', 'charlie.wilson@example.com', '$2a$10$sBZ/dNZFTYYRcW9UDgsxYe20NFibKB/L3c2pLjlwLyjZgY1tzQqQq', 'https://example.com/charlie_wilson.jpg', 'Data scientist and AI researcher', '1995-08-30', '2023-05-06 02:48:36', '2023-05-06 02:48:36'),
(6, 'Diana', 'Garcia', 'diana_garcia', 'diana.garcia@example.com', '$2a$10$leYpMuOOwwMNESryRGhl0ektaColCo2zaDKLZp9BZxOzTxarZ3576', 'https://example.com/diana_garcia.jpg', 'UX/UI designer and creative director', '1993-10-25', '2023-05-06 02:48:36', '2023-05-06 02:48:36'),
(8, 'Fiona', 'Taylor', 'fiona_taylor', 'fiona.taylor@example.com', '$2a$10$Pd0GW3Kytvmnyx3h1wPRxuZgrkbbl0WdCV10VinnOroNO6rvSdPw.', 'https://example.com/fiona_taylor.jpg', 'Social media marketer and content strategist', '1991-02-14', '2023-05-06 02:48:36', '2023-05-06 02:48:36'),
(9, 'George', 'Hernandez', 'george_hernandez', 'george.hernandez@example.com', '$2a$10$On1njXpXkT8gjy7j7z7Ame1BiitfKz79CxZnk2Ct4RM8zNfA.rWw.', 'https://example.com/george_hernandez.jpg', 'Cybersecurity expert and ethical hacker', '1989-12-05', '2023-05-06 02:48:36', '2023-05-06 02:48:36'),
(10, 'Hannah', 'Moore', 'hannah_moore', 'hannah.moore@example.com', '$2a$10$3v/sT4aYPo8qA4gyCmQ8BuASm5cQhuQ6Kb/8Dz.wtRzGiu2j1Sqjq', 'https://example.com/hannah_moore.jpg', 'Environmental activist and sustainability consultant', '1997-04-18', '2023-05-06 02:48:36', '2023-05-06 02:48:36'),
(11, 'Miguel', 'Garcia', 'miguel_garcia', 'miguel.garcia@example.com', '$2a$10$oWzMJIfHe7NROyA/Bt5BQ.kGemT8Q9SWMUEyl55RlIcgIxMkqlUb2', 'https://example.com/miguel_garcia.jpg', 'Freelance graphic designer and digital artist', '1992-08-30', '2023-05-06 02:49:45', '2023-05-06 02:49:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CommentId` (`CommentId`),
  ADD KEY `PostId` (`PostId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`CommentId`) REFERENCES `comments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
