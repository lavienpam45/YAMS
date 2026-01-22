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
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'info',
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `action_data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_index` (`user_id`),
  KEY `notifications_is_read_index` (`is_read`),
  KEY `notifications_created_at_index` (`created_at`),
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (60,1,'Pembaruan Nilai Aset Tahunan','Nilai aset \'Aset Test Lama - Input Baru\' per 07 Jan 2026 adalah 8.100.000','info',1,'{\"asset_id\": 29, \"asset_code\": \"TEST-OLD-20260107071435\", \"calculated_on\": \"2026-01-07\", \"current_value\": 8100000, \"previous_value\": 10000000}','2026-01-07 00:14:56','2026-01-07 00:24:06'),(61,1,'Pembaruan Nilai Aset Tahunan','Nilai aset \'Aset Test Lama - Input Baru\' per 07 Jan 2026 adalah 8.100.000','info',1,'{\"asset_id\": 29, \"asset_code\": \"TEST-OLD-20260107071435\", \"calculated_on\": \"2026-01-07\", \"current_value\": 8100000, \"previous_value\": 10000000}','2026-01-07 00:14:56','2026-01-07 00:24:06'),(62,1,'Pembaruan Nilai Aset Tahunan','Nilai aset \'Aset Simulasi - Input 7 Jan 2026\' per 07 Jan 2026 adalah 6.200.000','info',1,'{\"asset_id\": 30, \"asset_code\": \"SIM-20260107071543\", \"calculated_on\": \"2026-01-07\", \"current_value\": 6200000, \"previous_value\": 8100000}','2026-01-07 00:15:56','2026-01-07 00:24:06'),(63,1,'Aset Diperbarui','Aset \'Tanah Strategis Pusat Kota\' dengan kode LAND-001-20260107075137 telah diperbarui.','info',1,'{\"asset_id\": 34, \"asset_code\": \"LAND-001-20260107075137\"}','2026-01-07 00:59:30','2026-01-07 01:11:24'),(64,1,'Aset Diperbarui','Aset \'Komputer Desktop Premium\' dengan kode COMP-001-20260107075137 telah diperbarui.','info',1,'{\"asset_id\": 33, \"asset_code\": \"COMP-001-20260107075137\"}','2026-01-07 01:00:22','2026-01-07 01:11:24'),(65,1,'Aset Dihapus','Aset \'Tanah Strategis Pusat Kota\' dengan kode LAND-001-20260107075137 telah dihapus dari sistem.','warning',1,'{\"asset_code\": \"LAND-001-20260107075137\"}','2026-01-07 01:10:41','2026-01-07 01:11:24'),(66,1,'Aset Dihapus','Aset \'Komputer Desktop Premium\' dengan kode COMP-001-20260107075137 telah dihapus dari sistem.','warning',1,'{\"asset_code\": \"COMP-001-20260107075137\"}','2026-01-07 01:10:45','2026-01-07 01:11:24'),(67,1,'Aset Dihapus','Aset \'Komputer Desktop Premium\' dengan kode COMP-001-20260107075133 telah dihapus dari sistem.','warning',1,'{\"asset_code\": \"COMP-001-20260107075133\"}','2026-01-07 01:10:53','2026-01-07 01:11:24'),(68,1,'Aset Dihapus','Aset \'Tanah Strategis Pusat Kota\' dengan kode LAND-001-20260107075133 telah dihapus dari sistem.','warning',1,'{\"asset_code\": \"LAND-001-20260107075133\"}','2026-01-07 01:10:55','2026-01-07 01:11:24'),(69,1,'Aset Dihapus','Aset \'Aset Simulasi - Input 7 Jan 2026\' dengan kode SIM-20260107071543 telah dihapus dari sistem.','warning',1,'{\"asset_code\": \"SIM-20260107071543\"}','2026-01-07 01:10:57','2026-01-07 01:11:24'),(70,1,'Aset Dihapus','Aset \'Aset Test Lama - Input Baru\' dengan kode TEST-OLD-20260107071435 telah dihapus dari sistem.','warning',1,'{\"asset_code\": \"TEST-OLD-20260107071435\"}','2026-01-07 01:11:04','2026-01-07 01:11:24'),(71,1,'Aset Dihapus','Aset \'Test Auto Depreciation - 2026-01-06 20:19:23\' dengan kode TEST-20260106201923 telah dihapus dari sistem.','warning',1,'{\"asset_code\": \"TEST-20260106201923\"}','2026-01-07 01:11:07','2026-01-07 01:11:24'),(72,1,'Aset Dihapus','Aset \'Test Auto Depreciation - 2026-01-06 20:18:21\' dengan kode TEST-20260106201821 telah dihapus dari sistem.','warning',1,'{\"asset_code\": \"TEST-20260106201821\"}','2026-01-07 01:11:08','2026-01-07 01:11:24'),(73,1,'Aset Dihapus','Aset \'test\' dengan kode 26 telah dihapus dari sistem.','warning',1,'{\"asset_code\": \"26\"}','2026-01-07 06:56:41','2026-01-07 07:14:26'),(74,1,'Aset Baru Ditambahkan dengan Perhitungan Depresiasi','Nilai aset \'test123\' telah dihitung berdasarkan umur 0.99657768651608 tahun. Nilai saat ini: 102.491.444','info',1,'{\"asset_id\": 35, \"asset_code\": \"26\", \"calculated_value\": 102491444.22}','2026-01-07 06:57:43','2026-01-07 07:14:26'),(75,1,'Aset Baru Ditambahkan dengan Perhitungan Depresiasi','Nilai aset \'test1234\' telah dihitung berdasarkan umur 0.99657768651608 tahun. Nilai saat ini: 48.000.000','info',1,'{\"asset_id\": 36, \"asset_code\": \"27\", \"calculated_value\": 48000000}','2026-01-07 07:07:50','2026-01-07 07:14:26'),(76,1,'Aset Dihapus','Aset \'test1234\' dengan kode 27 telah dihapus dari sistem.','warning',1,'{\"asset_code\": \"27\"}','2026-01-07 07:14:19','2026-01-07 07:14:26'),(88,7,'Aset Baru Ditambahkan dengan Perhitungan Depresiasi','Nilai aset \'Marina\' telah dihitung berdasarkan umur 2.05 tahun. Nilai saat ini: 655.411.057.875','info',0,'{\"asset_id\": 40, \"asset_code\": \"AKT-035\", \"calculated_value\": 655411057875.06}','2026-01-19 12:21:35','2026-01-19 12:21:35'),(90,7,'Nilai Aset Dihitung Ulang','Nilai aset \'Master Grade Gelgoog\' (kode: AKT-035) telah dihitung ulang karena: tanggal terima berubah, harga beli berubah. Nilai saat ini: 128.000.000','info',0,'{\"reasons\": [\"tanggal terima berubah\", \"harga beli berubah\"], \"asset_id\": 40, \"asset_code\": \"AKT-035\", \"recalculated_value\": 128000000}','2026-01-19 12:24:30','2026-01-19 12:24:30'),(92,7,'Aset Diperbarui','Aset \'Master Grade Gelgoog\' dengan kode AKT-035 telah diperbarui.','info',0,'{\"asset_id\": 40, \"asset_code\": \"AKT-035\"}','2026-01-19 12:24:30','2026-01-19 12:24:30'),(94,7,'Nilai Aset Dihitung Ulang','Nilai aset \'Master Grade Gelgoog\' (kode: AKT-035) telah dihitung ulang karena: tanggal terima berubah. Nilai saat ini: 128.000.000','info',0,'{\"reasons\": [\"tanggal terima berubah\"], \"asset_id\": 40, \"asset_code\": \"AKT-035\", \"recalculated_value\": 128000000}','2026-01-19 12:25:01','2026-01-19 12:25:01'),(96,7,'Aset Diperbarui','Aset \'Master Grade Gelgoog\' dengan kode AKT-035 telah diperbarui.','info',0,'{\"asset_id\": 40, \"asset_code\": \"AKT-035\"}','2026-01-19 12:25:01','2026-01-19 12:25:01'),(98,7,'Nilai Aset Dihitung Ulang','Nilai aset \'Master Grade Gelgoog\' (kode: AKT-035) telah dihitung ulang karena: tanggal terima berubah. Nilai saat ini: 128.000.000','info',0,'{\"reasons\": [\"tanggal terima berubah\"], \"asset_id\": 40, \"asset_code\": \"AKT-035\", \"recalculated_value\": 128000000}','2026-01-19 12:40:33','2026-01-19 12:40:33'),(100,7,'Aset Diperbarui','Aset \'Master Grade Gelgoog\' dengan kode AKT-035 telah diperbarui.','info',0,'{\"asset_id\": 40, \"asset_code\": \"AKT-035\"}','2026-01-19 12:40:33','2026-01-19 12:40:33'),(102,7,'Aset Dihapus','Aset \'Master Grade Gelgoog\' dengan kode AKT-035 telah dihapus dari sistem.','warning',0,'{\"asset_code\": \"AKT-035\"}','2026-01-19 12:40:54','2026-01-19 12:40:54'),(104,7,'Aset Baru Ditambahkan dengan Perhitungan Depresiasi','Nilai aset \'komputer\' telah dihitung berdasarkan umur 2.05 tahun. Nilai saat ini: 943.792','info',0,'{\"asset_id\": 41, \"asset_code\": \"AKT-035\", \"calculated_value\": 943791.92}','2026-01-19 12:56:58','2026-01-19 12:56:58'),(106,7,'Aset Dihapus','Aset \'komputer\' dengan kode AKT-035 telah dihapus dari sistem.','warning',0,'{\"asset_code\": \"AKT-035\"}','2026-01-19 13:01:46','2026-01-19 13:01:46');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
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
