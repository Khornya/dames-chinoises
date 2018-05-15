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
(0, 'Pierre', 19, 'Jules', NULL, NULL, NULL, NULL, '2018-04-13'),
(1, 'Jean-Paul', 24, 'Sophie', NULL, NULL, NULL, NULL, '2018-04-08'),
(2, 'Anne', 32, 'Florian', 'Pierre', NULL, NULL, NULL, '2018-05-22'),
(3, 'Loulou2345', 33, 'Dédé', NULL, NULL, NULL, NULL, '2018-05-10'),
(4, 'Mateo', 39, 'Justine', NULL, NULL, NULL, NULL, '2018-04-06'),
(5, 'Justine', 40, 'Mateo', 'Anne', 'Pierre', NULL, NULL, '2018-05-10'),
(6, 'Dédé', 46, 'Loulou2345', NULL, NULL, NULL, NULL, '2018-05-23'),
(7, 'Florian', 48, 'Anne', NULL, NULL, NULL, NULL, '2018-04-15'),
(8, 'Sophie', 50, 'Jean-Paul', 'Pierre', 'Anne', NULL, NULL, '2018-04-30'),
(9, 'Jules', 51, 'Pierre', NULL, NULL, NULL, NULL, '2018-05-01');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
