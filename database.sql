-- CREATE USER 'hophophop'@'localhost' IDENTIFIED WITH mysql_native_password BY 'hophophop';

-- CREATE DATABASE dames_chinoises CHARACTER SET utf8;

-- GRANT ALL ON dames_chinoises.* TO 'hophophop'@'localhost';

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
)

ALTER TABLE `parties`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `parties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

INSERT INTO `parties` (`nom`, `score`, `adversaire1`, `adversaire2`, `adversaire3`, `adversaire4`, `adversaire5`, `dategame`) VALUES
('A', 52, '', NULL, NULL, NULL, NULL, '2018-04-08'),
('B', 53, '', NULL, NULL, NULL, NULL, '2018-04-08'),
('C', 54, '', NULL, NULL, NULL, NULL, '2018-04-08'),
('D', 55, '', NULL, NULL, NULL, NULL, '2018-04-08'),
('E', 56, '', NULL, NULL, NULL, NULL, '2018-04-08'),
('F', 57, '', NULL, NULL, NULL, NULL, '2018-04-08'),
('G', 58, '', NULL, NULL, NULL, NULL, '2018-04-08');
