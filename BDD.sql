-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:8889
-- Généré le :  Mar 03 Avril 2018 à 10:30
-- Version du serveur :  5.6.35
-- Version de PHP :  7.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `dames_chinoises`
--

-- --------------------------------------------------------

--
-- Structure de la table `scores`
--

CREATE TABLE `scores` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `score` int(11) NOT NULL,
  `adversaire` varchar(50) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `scores`
--

INSERT INTO `scores` (`id`, `nom`, `score`, `adversaire`, `date`) VALUES
(1, 'JOUEUR 1', 15, 'JOUEUR 2', '2018-04-03'),
(2, 'JOUEUR 3', 14, 'JOUEUR 4', '2018-04-03'),
(3, 'JOUEUR 5', 13, 'JOUEUR 7', '2018-04-03'),
(4, 'JOUEUR 3', 11, 'JOUEUR 4', '2018-04-03'),
(5, 'JOUEUR 9', 18, 'JOUEUR 4', '2018-04-03');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
