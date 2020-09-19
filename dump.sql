-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.21 - MySQL Community Server - GPL
-- Server OS:                    Linux
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------
-- Dumping database structure for sol_db
CREATE DATABASE IF NOT EXISTS `sol_db`
/*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */
/*!80016 DEFAULT ENCRYPTION='N' */
;
USE `sol_db`;
-- Dumping structure for table sol_db.measurements
CREATE TABLE IF NOT EXISTS `measurements` (
	`id` bigint unsigned NOT NULL AUTO_INCREMENT,
	`sensor_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`value` FLOAT(12) DEFAULT NULL,
	`ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `timers` (
	`id` bigint unsigned NOT NULL AUTO_INCREMENT,
	`sensor_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`value` FLOAT(12) DEFAULT NULL,
	`ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Dumping structure for table sol_db.sensors
CREATE TABLE IF NOT EXISTS `sensors` (
	`id` varchar(255) NOT NULL,
	`device_id` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL,
	`meta` json NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;