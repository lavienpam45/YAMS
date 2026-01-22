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
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `asset_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `received_date` date DEFAULT NULL,
  `purchase_price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `current_book_value` decimal(15,2) DEFAULT NULL,
  `last_depreciation_date` date DEFAULT NULL,
  `useful_life` int NOT NULL DEFAULT '5',
  `salvage_value` decimal(15,2) NOT NULL DEFAULT '0.00',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `depreciation_type` enum('depreciation','appreciation') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'depreciation',
  `custom_depreciation_rate` decimal(5,2) DEFAULT NULL,
  `brand` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serial_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `user_assigned` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inventory_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `assets_asset_code_unique` (`asset_code`),
  KEY `assets_asset_code_index` (`asset_code`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (1,'vel quae aut','Ruang Server',NULL,NULL,'AKT-001','SAT-001','2025-01-07',145566896.00,116453516.80,'2026-01-07',5,0.00,'Lainnya','depreciation',NULL,'HP','SN-97912651',1,'Rusak Ringan',NULL,'Security','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 23:40:05'),(2,'nisi et quia','Ruang Tunggu PMB',NULL,NULL,'AKT-002','SAT-002','2025-01-07',76699222.00,51132814.67,'2026-01-07',3,0.00,'Elektronik','depreciation',NULL,'HP','SN-21539053',3,'Rusak Berat',NULL,'Staff 6','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 23:40:05'),(3,'animi nisi totam','Lobi Utama',NULL,NULL,'AKT-003','SAT-003','2024-11-08',90286220.00,81257598.00,'2026-01-06',10,0.00,'Lainnya','depreciation',NULL,'Panasonic','SN-56249248',5,'Rusak Berat',NULL,'Security','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(4,'nam repellat autem','Ruang Server',NULL,NULL,'AKT-004','SAT-004','2025-01-28',43950828.00,43950828.00,'2025-01-28',3,0.00,'Elektronik','depreciation',NULL,'HP','SN-49308358',1,'Rusak Ringan',NULL,'Security','Tercatat',NULL,'2025-12-29 00:20:04','2025-12-29 00:20:04'),(5,'libero saepe modi','Ruang FOTO',NULL,NULL,'AKT-005','SAT-005','2024-09-09',140203751.00,126183375.90,'2026-01-06',10,0.00,'Furniture','depreciation',NULL,'Sony','SN-65381625',3,'Baik',NULL,'Staff 6','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(6,'sequi voluptatum quo','Lobi Utama',NULL,NULL,'AKT-006','SAT-006','2025-03-14',114996774.00,114996774.00,'2025-03-14',10,0.00,'Kendaraan','depreciation',NULL,'HP','SN-00717519',5,'Baik','Perlu maintenance rutin','Staff 3','Tercatat',NULL,'2025-12-29 00:20:04','2025-12-29 00:20:04'),(7,'nemo error tempore','Lobi Utama',NULL,NULL,'AKT-007','SAT-007','2024-08-29',114424136.00,91539308.80,'2026-01-06',5,0.00,'Furniture','depreciation',NULL,'LG','SN-04116981',5,'Rusak Berat',NULL,'Umum','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(8,'quos non voluptatem','Ruang Server',NULL,NULL,'AKT-008','SAT-008','2024-02-13',103911774.00,83129419.20,'2026-01-06',5,0.00,'Furniture','depreciation',NULL,'HP','SN-47299191',1,'Rusak Berat',NULL,'Staff 6','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(9,'maiores ab minima','Lobi Utama',NULL,NULL,'AKT-009','SAT-009','2024-10-05',24922819.00,21807466.63,'2026-01-06',8,0.00,'Lainnya','depreciation',NULL,'HP','SN-55096720',3,'Baik',NULL,'Umum','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(10,'numquam qui commodi','Gudang',NULL,NULL,'AKT-010','SAT-010','2024-06-08',85163183.00,76646864.70,'2026-01-06',10,0.00,'Furniture','depreciation',NULL,'Dell','SN-23798663',1,'Baik',NULL,'Staff 6','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(11,'rerum velit vel','Ruang Server',NULL,NULL,'AKT-011','SAT-011','2024-05-02',144452635.00,130007371.50,'2026-01-06',10,0.00,'Kendaraan','depreciation',NULL,'Panasonic','SN-21206887',1,'Baik','Perlu maintenance rutin','Security','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(12,'illum consequatur accusantium','Ruang FOTO',NULL,NULL,'AKT-012','SAT-012','2024-06-27',101230764.00,91107687.60,'2026-01-06',10,0.00,'Kendaraan','depreciation',NULL,'Epson','SN-59586319',4,'Baik',NULL,'Umum','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(13,'dicta et autem','Ruang Server',NULL,NULL,'AKT-013','SAT-013','2025-04-01',147457233.00,147457233.00,'2025-04-01',10,0.00,'Tanah','depreciation',NULL,'Honda','SN-77616340',4,'Baik',NULL,'Security','Tercatat',NULL,'2025-12-29 00:20:04','2025-12-29 00:20:04'),(14,'velit est sequi','Ruang Server',NULL,NULL,'AKT-014','SAT-014','2024-02-16',108887875.00,228052975.46,'2026-01-06',8,0.00,'Tanah','depreciation',NULL,'Honda','SN-94922523',4,'Rusak Ringan',NULL,'Staff 3','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(15,'rerum et velit','Ruang Server',NULL,NULL,'AKT-015','SAT-015','2025-01-21',56910869.00,56910869.00,'2025-01-21',3,0.00,'Tanah','depreciation',NULL,'Honda','SN-75218485',3,'Baik',NULL,'Security','Tercatat',NULL,'2025-12-29 00:20:04','2025-12-29 00:20:04'),(16,'perspiciatis vero officiis','Ruang FOTO',NULL,NULL,'AKT-016','SAT-016','2024-03-17',51966954.00,108632290.14,'2026-01-06',10,0.00,'Bangunan','depreciation',NULL,'Epson','SN-41396186',4,'Rusak Ringan','Perlu maintenance rutin','Umum','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(17,'sit sint nihil','Gudang',NULL,NULL,'AKT-017','SAT-017','2024-11-13',50332704.00,103554367.31,'2026-01-06',5,0.00,'Bangunan','depreciation',NULL,'Dell','SN-39655080',5,'Baik',NULL,'Staff 6','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(18,'et dolorem et','Lobi Utama',NULL,NULL,'AKT-018','SAT-018','2025-01-12',19481431.00,39954934.87,'2026-01-12',8,0.00,'Bangunan','depreciation',NULL,'LG','SN-51441623',5,'Rusak Ringan',NULL,'Staff 6','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-18 22:31:11'),(19,'sed a aut','Lobi Utama',NULL,NULL,'AKT-019','SAT-019','2024-11-20',127136795.00,261448981.72,'2026-01-06',10,0.00,'Tanah','depreciation',NULL,'LG','SN-82122935',1,'Rusak Ringan',NULL,'Staff 3','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(20,'pariatur assumenda repellendus','Lobi Utama',NULL,NULL,'AKT-020','SAT-020','2025-06-26',20323982.00,20323982.00,'2025-06-26',3,0.00,'Bangunan','depreciation',NULL,'HP','SN-70331332',3,'Rusak Ringan','Perlu maintenance rutin','Umum','Tercatat',NULL,'2025-12-29 00:20:04','2025-12-29 00:20:04'),(21,'non est quas','Ruang Tunggu PMB',NULL,NULL,'AKT-021','SAT-021','2025-07-22',37225314.00,37225314.00,'2025-07-22',5,0.00,'Bangunan','depreciation',NULL,'Epson','SN-02911670',1,'Rusak Ringan',NULL,'Staff 3','Tercatat',NULL,'2025-12-29 00:20:04','2025-12-29 00:20:04'),(22,'aut consequatur vel','Ruang Tunggu PMB',NULL,NULL,'AKT-022','SAT-022','2025-01-13',78676690.00,161349143.45,'2026-01-13',5,0.00,'Tanah','depreciation',NULL,'LG','SN-54255630',4,'Baik',NULL,'Security','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-18 22:31:12'),(23,'rem reprehenderit iure','Ruang Server',NULL,NULL,'AKT-023','SAT-023','2024-04-11',9217953.00,19237741.64,'2026-01-06',3,0.00,'Bangunan','depreciation',NULL,'LG','SN-95980249',1,'Baik','Perlu maintenance rutin','Staff 3','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(24,'deserunt numquam minima','Lobi Utama',NULL,NULL,'AKT-024','SAT-024','2024-05-28',30798216.00,64077165.01,'2026-01-06',8,0.00,'Tanah','depreciation',NULL,'Honda','SN-36048588',1,'Baik',NULL,'Umum','Tercatat',NULL,'2025-12-29 00:20:04','2026-01-06 13:18:00'),(25,'rem accusamus minus','Ruang Tunggu PMB',NULL,NULL,'AKT-025','SAT-025','2025-12-10',136216226.00,136216226.00,'2025-12-10',3,0.00,'Bangunan','depreciation',NULL,'Dell','SN-43601530',4,'Rusak Berat',NULL,'Umum','Tercatat',NULL,'2025-12-29 00:20:04','2025-12-29 00:20:04'),(37,'test123','Ruang Icikiwir',NULL,NULL,'AKT-026','SAT-026','2025-01-08',50000000.00,154989733.06,'2026-01-08',5,40000000.00,'Bangunan','depreciation',NULL,'Honda','SN-00000026',1,'Baik',NULL,'Staff 3','Tercatat',NULL,'2026-01-07 07:15:11','2026-01-08 14:24:10'),(38,'test1234','Ruang Icikiwir',NULL,NULL,'AKT-027','SAT-027','2025-01-08',50000000.00,44000000.00,'2026-01-08',5,40000000.00,'Elektronik','depreciation',NULL,'Honda','SN-00000027',1,'Baik',NULL,'Staff 3','Tercatat',NULL,'2026-01-07 07:15:44','2026-01-09 04:43:19'),(39,'Bagus','Ruang IT',NULL,NULL,'AKT-0034','SAT-0034','2023-01-15',15000000.00,15000000.00,'2023-01-15',5,2000000.00,'Elektronik','depreciation',NULL,'Dell','DL2023001',1,'Baik','Laptop untuk staff IT','Ahmad Hidayat',NULL,NULL,'2026-01-19 12:02:03','2026-01-19 12:02:03');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
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
