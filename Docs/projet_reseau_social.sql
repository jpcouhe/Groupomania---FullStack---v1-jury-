-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 22 juin 2022 à 15:43
-- Version du serveur : 8.0.29
-- Version de PHP : 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `projet_reseau_social`
--

-- --------------------------------------------------------

--
-- Structure de la table `contentcategorie`
--

DROP TABLE IF EXISTS `contentcategorie`;
CREATE TABLE IF NOT EXISTS `contentcategorie` (
  `categories_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  PRIMARY KEY (`categories_id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `name_2` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `contentcategorie`
--

INSERT INTO `contentcategorie` (`categories_id`, `name`, `slug`) VALUES
(1, 'Musique', 'music'),
(2, 'Cinema', 'movie'),
(3, 'Divertissement', 'funny'),
(4, 'Mode de vie ', 'lifestyle'),
(5, 'Sport', 'sport'),
(6, 'Technologies', 'technology'),
(7, 'Voyage', 'travel'),
(8, 'Jeux', 'games'),
(9, 'Animaux', 'animals');

-- --------------------------------------------------------

--
-- Structure de la table `contents`
--

DROP TABLE IF EXISTS `contents`;
CREATE TABLE IF NOT EXISTS `contents` (
  `contents_id` int NOT NULL AUTO_INCREMENT,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` text NOT NULL,
  `users_id` int NOT NULL,
  `threads_id` int NOT NULL,
  `postTypes_id` int NOT NULL,
  PRIMARY KEY (`contents_id`),
  KEY `users_id` (`users_id`),
  KEY `postTypes_id` (`postTypes_id`),
  KEY `threads_id` (`threads_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1340 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `contenttypes`
--

DROP TABLE IF EXISTS `contenttypes`;
CREATE TABLE IF NOT EXISTS `contenttypes` (
  `posttypes_id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`posttypes_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `contenttypes`
--

INSERT INTO `contenttypes` (`posttypes_id`, `Name`) VALUES
(1, 'Image'),
(2, 'Texte');

-- --------------------------------------------------------

--
-- Structure de la table `keyv`
--

DROP TABLE IF EXISTS `keyv`;
CREATE TABLE IF NOT EXISTS `keyv` (
  `id` varchar(255) NOT NULL,
  `value` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `like_user_id` int NOT NULL,
  `like_content_id` int NOT NULL,
  KEY `posts_id` (`like_content_id`),
  KEY `users_id` (`like_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `rolename` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`role_id`, `rolename`) VALUES
(1, 'admin'),
(2, 'moderator'),
(3, 'user');

-- --------------------------------------------------------

--
-- Structure de la table `thread`
--

DROP TABLE IF EXISTS `thread`;
CREATE TABLE IF NOT EXISTS `thread` (
  `threads_id` int NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `categories_id` int NOT NULL,
  PRIMARY KEY (`threads_id`),
  KEY `categorie` (`categories_id`)
) ENGINE=InnoDB AUTO_INCREMENT=602 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `users_id` int NOT NULL AUTO_INCREMENT,
  `lastname` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'http://localhost:3003/images/default_picture/nobodyface.png',
  `role_id` int NOT NULL DEFAULT '3',
  PRIMARY KEY (`users_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=354 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`users_id`, `lastname`, `firstname`, `email`, `password`, `profile_picture_location`, `role_id`) VALUES
(310, 'ADMIN', 'admin', 'admin@admin.fr', '$2b$12$P9p0Lil5IDdu9RR7/yqO1uPBcQx3kd1wVHIXfe4D0z9JFALZWH7aC', 'http://localhost:3003/images/default_picture/admin.jpg', 1);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `contents`
--
ALTER TABLE `contents`
  ADD CONSTRAINT `contents_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contents_ibfk_2` FOREIGN KEY (`postTypes_id`) REFERENCES `contenttypes` (`posttypes_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contents_ibfk_3` FOREIGN KEY (`threads_id`) REFERENCES `thread` (`threads_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`like_content_id`) REFERENCES `contents` (`contents_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`like_user_id`) REFERENCES `users` (`users_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `thread`
--
ALTER TABLE `thread`
  ADD CONSTRAINT `categorie` FOREIGN KEY (`categories_id`) REFERENCES `contentcategorie` (`categories_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `role` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
