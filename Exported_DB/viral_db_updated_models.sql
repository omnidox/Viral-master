-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2023 at 01:15 AM
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
-- Table structure for table `bookmarks`
--

CREATE TABLE `bookmarks` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `PostId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookmarks`
--

INSERT INTO `bookmarks` (`id`, `createdAt`, `updatedAt`, `UserId`, `PostId`) VALUES
(1, '2023-05-06 20:57:17', '2023-05-06 20:57:17', 2, 1),
(2, '2023-05-06 22:55:32', '2023-05-06 22:55:32', 1, 2),
(4, '2023-05-06 22:55:54', '2023-05-06 22:55:54', 2, 1),
(5, '2023-05-06 22:56:08', '2023-05-06 22:56:08', 3, 1),
(6, '2023-05-06 22:56:20', '2023-05-06 22:56:20', 3, 5);

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
(1, 'Great post! I found the information on upcoming trends in web development to be insightful.', '2023-05-06 21:10:42', '2023-05-06 21:10:42', NULL, 1, 2),
(2, 'Great post! I found the information about new technologies very insightful.', '2023-05-06 21:48:36', '2023-05-06 21:48:36', NULL, 2, 1),
(3, 'Thank you for sharing your writing journey. It\'s always interesting to hear about other writers\' experiences.', '2023-05-06 21:48:36', '2023-05-06 21:48:36', NULL, 1, 2),
(4, 'I\'ve been to a couple of the destinations you mentioned, and I completely agree with your choices!', '2023-05-06 21:48:36', '2023-05-06 21:48:36', NULL, 4, 3),
(5, 'Nice review! I also enjoyed reading \'The Great Gatsby\' and appreciated your perspective on it.', '2023-05-06 21:48:36', '2023-05-06 21:48:36', NULL, 3, 4),
(6, 'Your tips for achieving fitness goals are really helpful. I\'ll definitely be trying some of them out!', '2023-05-06 21:48:36', '2023-05-06 21:48:36', NULL, 5, 5),
(7, 'I agree! The new technologies mentioned in the post are truly fascinating.', '2023-05-06 22:15:25', '2023-05-06 22:02:05', 2, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `type` enum('post_vote','comment_vote','post_reply','comment_reply') NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `CommentId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `PostId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `read`, `createdAt`, `updatedAt`, `CommentId`, `UserId`, `PostId`) VALUES
(1, 'post_vote', 0, '2023-05-06 20:58:21', '2023-05-06 22:49:05', NULL, 2, 1),
(2, 'post_vote', 0, '2023-05-06 22:42:57', '2023-05-06 22:42:57', NULL, 1, 2),
(4, 'post_reply', 0, '2023-05-06 22:43:22', '2023-05-06 22:43:22', NULL, 3, 1),
(5, 'comment_reply', 0, '2023-05-06 22:43:34', '2023-05-06 22:43:34', 2, 4, NULL),
(6, 'post_vote', 0, '2023-05-06 22:43:51', '2023-05-06 22:43:51', NULL, 5, 3);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `content`, `createdAt`, `updatedAt`, `UserId`) VALUES
(1, 'The Importance of Clean Code', 'Clean code is essential for efficient software development...', '2023-05-06 20:49:35', '2023-05-06 20:49:35', 1),
(2, 'The Future of Web Development', 'In this post, we\'ll discuss the upcoming trends in web development...', '2023-05-06 20:56:42', '2023-05-06 20:56:42', 2),
(3, 'My Writing Journey', 'In this post, I will be sharing my experiences and lessons learned from my writing journey.', '2023-05-06 21:36:02', '2023-05-06 21:36:02', 1),
(4, 'Exploring New Technologies', 'In this post, I will discuss some of the latest technologies I\'ve been exploring and their potential applications.', '2023-05-06 21:36:02', '2023-05-06 21:36:02', 2),
(5, 'Book Review: The Great Gatsby', 'In this post, I will share my thoughts and opinions on the classic novel, \'The Great Gatsby\' by F. Scott Fitzgerald.', '2023-05-06 21:36:02', '2023-05-06 21:36:02', 3),
(6, 'Top 5 Travel Destinations', 'In this post, I will be sharing my top 5 favorite travel destinations and why I think everyone should visit them at least once.', '2023-05-06 21:36:02', '2023-05-06 21:36:02', 4),
(7, 'Achieving Your Fitness Goals', 'In this post, I will discuss how to set realistic fitness goals and the best strategies to achieve them.', '2023-05-06 21:36:02', '2023-05-06 21:36:02', 5);

-- --------------------------------------------------------

--
-- Table structure for table `posttags`
--

CREATE TABLE `posttags` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PostId` int(11) NOT NULL,
  `TagId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posttags`
--

INSERT INTO `posttags` (`createdAt`, `updatedAt`, `PostId`, `TagId`) VALUES
('2023-05-06 21:18:16', '2023-05-06 21:18:16', 1, 1),
('2023-05-06 22:05:58', '2023-05-06 22:05:58', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'programming', '2023-05-06 21:14:19', '2023-05-06 21:14:19'),
(2, 'Travel', '2023-05-06 22:06:57', '2023-05-06 22:11:06');

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
(1, 'John', 'Doe', 'johndoe', 'john.doe@example.com', '$2a$10$v53vP7TN.P20jMNj6miOo.wmVZ2eLVlybKE6gV/559.Mh/L8zG/XS', 'https://example.com/profile_picture.jpg', 'A software engineer who loves coding.', '1990-01-01', '2023-05-06 20:44:55', '2023-05-06 20:44:55'),
(2, 'Jane', 'Smith', 'janesmith', 'jane.smith@example.com', '$2a$10$2zsmQqDbeJCYMW.jx598QulCKVqC1vwXJ7leaLr0eB8vXXQ71zNWy', 'https://example.com/jane_profile_picture.jpg', 'A full-stack developer who enjoys learning new technologies.', '1992-02-02', '2023-05-06 20:56:05', '2023-05-06 20:56:05'),
(3, 'Emily', 'Johnson', 'emilyjohnson', 'emilyjohnson@example.com', '$2a$10$xzph7QdBpvNNmjs9R9YFUuuwsM6l58akF3IO8PsdjjU9fNSM4D.gy', NULL, 'I love writing and sharing my thoughts.', '1995-06-15', '2023-05-06 21:30:00', '2023-05-06 21:30:00'),
(4, 'Michael', 'Smith', 'michaelsmith', 'michaelsmith@example.com', '$2a$10$VVY5hj3dxRpyrr0Gha4ZqeUEHNaAicCHzFID9EDTz.BwCr3NaZO4m', NULL, 'Technology enthusiast and software developer.', '1989-11-23', '2023-05-06 21:30:00', '2023-05-06 21:30:00'),
(5, 'Sophia', 'Brown', 'sophiabrown', 'sophiabrown@example.com', '$2a$10$l9cn75OT8XKpofw81CzlF.Gik4145q6P86HvhXnDLFEL2ShsMRwkq', NULL, 'Avid reader and aspiring writer.', '1998-04-30', '2023-05-06 21:30:00', '2023-05-06 21:30:00'),
(6, 'William', 'Williams', 'williamwilliams', 'williamwilliams@example.com', '$2a$10$5fLo2bojTNG8mo/KFlH6u.6y/NBHONfAhSeuTmZnX71KF3DH1JZEi', NULL, 'Traveler, foodie, and amateur photographer.', '1993-02-10', '2023-05-06 21:30:00', '2023-05-06 21:30:00'),
(7, 'Isabella', 'Jones', 'isabellajones', 'isabellajones@example.com', '$2a$10$Ht2rkqUFuGUaDFRTX/4XXeO9qZmlgF9YBSTSx/lVhrNG3JqTiPaM2', NULL, 'Fitness and wellness coach.', '1990-08-08', '2023-05-06 21:30:00', '2023-05-06 21:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `type` enum('upvote','downvote') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `CommentId` int(11) DEFAULT NULL,
  `PostId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `type`, `createdAt`, `updatedAt`, `CommentId`, `PostId`, `UserId`) VALUES
(4, 'downvote', '2023-05-06 22:27:36', '2023-05-06 22:27:36', 1, NULL, 2),
(5, 'upvote', '2023-05-06 22:28:56', '2023-05-06 22:28:56', NULL, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `PostId` (`PostId`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CommentId` (`CommentId`),
  ADD KEY `PostId` (`PostId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CommentId` (`CommentId`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `PostId` (`PostId`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `posttags`
--
ALTER TABLE `posttags`
  ADD PRIMARY KEY (`PostId`,`TagId`),
  ADD KEY `TagId` (`TagId`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CommentId` (`CommentId`),
  ADD KEY `PostId` (`PostId`),
  ADD KEY `UserId` (`UserId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD CONSTRAINT `bookmarks_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bookmarks_ibfk_2` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`CommentId`) REFERENCES `comments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`CommentId`) REFERENCES `comments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `posttags`
--
ALTER TABLE `posttags`
  ADD CONSTRAINT `posttags_ibfk_1` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `posttags_ibfk_2` FOREIGN KEY (`TagId`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`CommentId`) REFERENCES `comments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `votes_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
