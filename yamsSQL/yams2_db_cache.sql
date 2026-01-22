-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: yams2_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-0f8b0b966dd7c1b30ac7e2ef7c2aaf7d','i:1;',1769099439),('laravel-cache-0f8b0b966dd7c1b30ac7e2ef7c2aaf7d:timer','i:1769099439;',1769099439),('laravel-cache-6a49bb01e691c2fd366115604a2868b2','i:2;',1767957658),('laravel-cache-6a49bb01e691c2fd366115604a2868b2:timer','i:1767957658;',1767957658),('laravel-cache-7b83213baa18585566e8504ea072ffad','i:1;',1766374858),('laravel-cache-7b83213baa18585566e8504ea072ffad:timer','i:1766374858;',1766374858),('laravel-cache-8303011a312d1195bf193fa74615dc68','i:1;',1769097560),('laravel-cache-8303011a312d1195bf193fa74615dc68:timer','i:1769097560;',1769097560),('laravel-cache-83697276c1d2a25ebad03237cf04b2c4','i:2;',1769099852),('laravel-cache-83697276c1d2a25ebad03237cf04b2c4:timer','i:1769099852;',1769099852),('laravel-cache-ba33c56bfb21ad12842204ee41483ef6','i:3;',1766093915),('laravel-cache-ba33c56bfb21ad12842204ee41483ef6:timer','i:1766093915;',1766093915),('laravel-cache-depreciation_last_run_2026-01-08','O:25:\"Illuminate\\Support\\Carbon\":3:{s:4:\"date\";s:26:\"2026-01-08 21:24:10.064059\";s:13:\"timezone_type\";i:3;s:8:\"timezone\";s:3:\"UTC\";}',1767916800),('laravel-cache-depreciation_last_run_2026-01-09','O:25:\"Illuminate\\Support\\Carbon\":3:{s:4:\"date\";s:26:\"2026-01-09 03:59:36.407264\";s:13:\"timezone_type\";i:3;s:8:\"timezone\";s:3:\"UTC\";}',1768003200),('laravel-cache-eb41b5a004c61ce2997242ffb94a0568','i:2;',1769099899),('laravel-cache-eb41b5a004c61ce2997242ffb94a0568:timer','i:1769099899;',1769099899),('laravel-cache-f0a30366d7c244bfe7675354b8a16d54','i:1;',1767584635),('laravel-cache-f0a30366d7c244bfe7675354b8a16d54:timer','i:1767584635;',1767584635),('laravel-cache-superadmin123@yams.test|127.0.0.1','i:2;',1767957659),('laravel-cache-superadmin123@yams.test|127.0.0.1:timer','i:1767957659;',1767957659),('laravel-cache-superadminyams@gmail.com|127.0.0.1','i:3;',1766093915),('laravel-cache-superadminyams@gmail.com|127.0.0.1:timer','i:1766093915;',1766093915),('laravel-cache-test1234@gmail.com|127.0.0.1','i:1;',1766374859),('laravel-cache-test1234@gmail.com|127.0.0.1:timer','i:1766374859;',1766374859),('yams-cache-0f8b0b966dd7c1b30ac7e2ef7c2aaf7d','i:1;',1769095508),('yams-cache-0f8b0b966dd7c1b30ac7e2ef7c2aaf7d:timer','i:1769095508;',1769095508),('yams-cache-6a49bb01e691c2fd366115604a2868b2','i:1;',1768801398),('yams-cache-6a49bb01e691c2fd366115604a2868b2:timer','i:1768801398;',1768801398),('yams-cache-83697276c1d2a25ebad03237cf04b2c4','i:1;',1768842839),('yams-cache-83697276c1d2a25ebad03237cf04b2c4:timer','i:1768842839;',1768842839),('yams-cache-depreciation_last_run_2026-01-09','O:25:\"Illuminate\\Support\\Carbon\":3:{s:4:\"date\";s:26:\"2026-01-09 11:43:19.461048\";s:13:\"timezone_type\";i:3;s:8:\"timezone\";s:3:\"UTC\";}',1768003200),('yams-cache-depreciation_last_run_2026-01-19','O:25:\"Illuminate\\Support\\Carbon\":3:{s:4:\"date\";s:26:\"2026-01-19 05:31:12.089530\";s:13:\"timezone_type\";i:3;s:8:\"timezone\";s:3:\"UTC\";}',1768867200),('yams-cache-depreciation_last_run_2026-01-20','O:25:\"Illuminate\\Support\\Carbon\":3:{s:4:\"date\";s:26:\"2026-01-20 00:00:54.307982\";s:13:\"timezone_type\";i:3;s:8:\"timezone\";s:12:\"Asia/Jakarta\";}',1768928400),('yams-cache-depreciation_last_run_2026-01-21','O:25:\"Illuminate\\Support\\Carbon\":3:{s:4:\"date\";s:26:\"2026-01-21 14:18:00.868680\";s:13:\"timezone_type\";i:3;s:8:\"timezone\";s:12:\"Asia/Jakarta\";}',1769014800),('yams-cache-depreciation_last_run_2026-01-22','O:25:\"Illuminate\\Support\\Carbon\":3:{s:4:\"date\";s:26:\"2026-01-22 10:41:30.159052\";s:13:\"timezone_type\";i:3;s:8:\"timezone\";s:12:\"Asia/Jakarta\";}',1769101200),('yams-cache-eb41b5a004c61ce2997242ffb94a0568','i:1;',1768841807),('yams-cache-eb41b5a004c61ce2997242ffb94a0568:timer','i:1768841807;',1768841807),('yams-cache-superadmin123@yams.test|127.0.0.1','i:1;',1768801398),('yams-cache-superadmin123@yams.test|127.0.0.1:timer','i:1768801398;',1768801398);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-23  0:27:44
