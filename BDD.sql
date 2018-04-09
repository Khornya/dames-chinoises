-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:8889
-- Généré le :  Lun 09 Avril 2018 à 18:44
-- Version du serveur :  5.6.35
-- Version de PHP :  7.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `dames_chinoises`
--

-- --------------------------------------------------------

--
-- Structure de la table `parties`
--

CREATE TABLE `parties` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `score` int(11) NOT NULL,
  `adversaire1` varchar(50) NOT NULL,
  `adversaire2` varchar(50) DEFAULT NULL,
  `adversaire3` varchar(50) DEFAULT NULL,
  `adversaire4` varchar(50) DEFAULT NULL,
  `adversaire5` varchar(50) DEFAULT NULL,
  `dategame` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `parties`
--

INSERT INTO `parties` (`id`, `nom`, `score`, `adversaire1`, `adversaire2`, `adversaire3`, `adversaire4`, `adversaire5`, `dategame`) VALUES
(48, 'A', 0, '', NULL, NULL, NULL, NULL, '2018-04-08'),
(49, 'B', 0, '', NULL, NULL, NULL, NULL, '2018-04-08'),
(50, 'PLAYER 2', 0, '', NULL, NULL, NULL, NULL, '2018-04-08'),
(51, 'C', 0, '', NULL, NULL, NULL, NULL, '2018-04-08'),
(52, 'D', 0, '', NULL, NULL, NULL, NULL, '2018-04-08'),
(53, 'E', 0, '', NULL, NULL, NULL, NULL, '2018-04-08'),
(54, 'F', 0, '', NULL, NULL, NULL, NULL, '2018-04-08'),
(55, 'G', 0, '', NULL, NULL, NULL, NULL, '2018-04-08');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `parties`
--
ALTER TABLE `parties`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `parties`
--
ALTER TABLE `parties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
