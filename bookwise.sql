-- MySQL dump 10.13  Distrib 8.0.45, for Linux (aarch64)
--
-- Host: localhost    Database: bookwise
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('549ec1b7-58e1-4860-80b0-0de3fab93025','e370fd990deb0b384508881309b8d7ae1fefd08a7fb75b690f49969fd803d0e7','2026-04-21 09:07:33.575','20260421090733_schema_update',NULL,NULL,'2026-04-21 09:07:33.186',1),('f4c59e8a-89fd-486a-937c-64ab7120f412','415b593479c28bb963c974a777a15e546e9972beabcbdac1c38cb39911bac372','2026-04-21 09:31:03.032','20260421093103_add_system_setting',NULL,NULL,'2026-04-21 09:31:03.017',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_activity_logs`
--

DROP TABLE IF EXISTS `admin_activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `admin_activity_logs_admin_id_idx` (`admin_id`),
  CONSTRAINT `admin_activity_logs_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_activity_logs`
--

LOCK TABLES `admin_activity_logs` WRITE;
/*!40000 ALTER TABLE `admin_activity_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_chapters`
--

DROP TABLE IF EXISTS `book_chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_chapters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `chapter_number` int NOT NULL,
  `chapter_title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapter_summary` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `audio_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `audio_duration` int NOT NULL DEFAULT '0',
  `display_order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `book_chapters_book_id_idx` (`book_id`),
  CONSTRAINT `book_chapters_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_chapters`
--

LOCK TABLES `book_chapters` WRITE;
/*!40000 ALTER TABLE `book_chapters` DISABLE KEYS */;
INSERT INTO `book_chapters` VALUES (1,9,1,'The Descent','In this chapter, the author introduces the protagonist\'s descent into a state of despair. Through vivid imagery and emotional language, readers are taken on a journey that reflects the chaos of modern life. The protagonist grapples with feelings of isolation and hopelessness, setting the stage for the exploration of deeper themes throughout the book. This chapter serves as a crucial foundation for understanding the struggles that will unfold in subsequent sections.',NULL,0,1,'2026-04-27 11:54:09.255','2026-04-27 11:54:09.255'),(2,9,2,'The Search for Light','As the narrative progresses, the protagonist embarks on a quest for hope and meaning. This chapter delves into the various ways individuals search for light in their lives, whether through relationships, art, or self-discovery. The author emphasizes the importance of resilience and the human spirit\'s capacity to rise above adversity. Through poignant anecdotes and reflections, readers are encouraged to consider their own paths toward finding hope in challenging times.',NULL,0,2,'2026-04-27 11:54:09.255','2026-04-27 11:54:09.255'),(3,9,3,'Confronting the Inner Demon','In this pivotal chapter, the protagonist confronts their inner demons, representing the fears and insecurities that have held them back. The author uses powerful metaphors to illustrate the struggle between self-acceptance and self-doubt. This confrontation is not only a personal battle but also a universal theme that resonates with readers. The chapter emphasizes the necessity of acknowledging one\'s flaws as a step toward personal growth and healing.',NULL,0,3,'2026-04-27 11:54:09.255','2026-04-27 11:54:09.255'),(4,9,4,'The Role of Connection','This chapter highlights the importance of human connection in navigating life\'s challenges. The author discusses how relationships can serve as a source of strength and support. Through various narratives, readers witness the transformative power of love, friendship, and community. The chapter underscores that while individual journeys are crucial, the bonds we form with others can significantly impact our ability to overcome despair and find meaning.',NULL,0,4,'2026-04-27 11:54:09.255','2026-04-27 11:54:09.255'),(5,9,5,'Finding Purpose','In this chapter, the protagonist begins to uncover their purpose in life. The author explores different avenues through which individuals can find meaning, including passion projects, career aspirations, and personal values. This exploration is framed as a journey rather than a destination, emphasizing that the search for purpose is ongoing. Readers are encouraged to reflect on their own lives and consider what brings them fulfillment and joy.',NULL,0,5,'2026-04-27 11:54:09.255','2026-04-27 11:54:09.255'),(6,9,6,'Embracing Change','As the narrative unfolds, the protagonist learns to embrace change as an inevitable part of life. This chapter discusses the challenges and opportunities that come with change, encouraging readers to adopt a flexible mindset. The author illustrates how acceptance can lead to personal growth and new beginnings. Through relatable examples, readers are inspired to view change not as a threat, but as a chance to evolve and discover new aspects of themselves.',NULL,0,6,'2026-04-27 11:54:09.255','2026-04-27 11:54:09.255'),(7,9,7,'The Journey to Redemption','In this chapter, the focus shifts to the concept of redemption. The protagonist reflects on past mistakes and the process of seeking forgiveness from themselves and others. The author emphasizes that redemption is not merely about absolution but also about personal transformation. Through poignant storytelling, readers are invited to consider their own journeys toward healing and the importance of letting go of guilt and shame.',NULL,0,7,'2026-04-27 11:54:09.255','2026-04-27 11:54:09.255'),(8,9,8,'A New Dawn','The final chapter serves as a culmination of the protagonist\'s journey, where they emerge from their struggles with a renewed sense of hope and purpose. The author reflects on the lessons learned throughout the narrative, emphasizing the resilience of the human spirit. This chapter encourages readers to embrace their own journeys, acknowledging that while challenges may persist, there is always the potential for new beginnings and brighter days ahead.',NULL,0,8,'2026-04-27 11:54:09.255','2026-04-27 11:54:09.255');
/*!40000 ALTER TABLE `book_chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_reviews`
--

DROP TABLE IF EXISTS `book_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `review_title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `review_text` text COLLATE utf8mb4_unicode_ci,
  `isVerifiedPurchase` tinyint(1) NOT NULL DEFAULT '0',
  `isApproved` tinyint(1) NOT NULL DEFAULT '1',
  `helpfulCount` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `book_reviews_book_id_user_id_key` (`book_id`,`user_id`),
  KEY `book_reviews_book_id_idx` (`book_id`),
  KEY `book_reviews_user_id_idx` (`user_id`),
  CONSTRAINT `book_reviews_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `book_reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_reviews`
--

LOCK TABLES `book_reviews` WRITE;
/*!40000 ALTER TABLE `book_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `book_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_summaries`
--

DROP TABLE IF EXISTS `book_summaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_summaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `main_summary` text COLLATE utf8mb4_unicode_ci,
  `key_takeaways` json DEFAULT NULL,
  `full_summary` longtext COLLATE utf8mb4_unicode_ci,
  `table_of_contents` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `book_summaries_book_id_key` (`book_id`),
  CONSTRAINT `book_summaries_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_summaries`
--

LOCK TABLES `book_summaries` WRITE;
/*!40000 ALTER TABLE `book_summaries` DISABLE KEYS */;
INSERT INTO `book_summaries` VALUES (1,9,'Inferno by sGRG explores the complexities of human emotions and the struggles faced in the modern world. Through a blend of narrative and philosophical reflections, the author delves into themes of despair, hope, and the search for meaning. The book serves as a mirror to society, reflecting the chaos and confusion that often accompany personal and collective crises. Each chapter presents a unique perspective on the challenges of existence, encouraging readers to confront their own inner demons while seeking redemption and understanding. Ultimately, Inferno is a thought-provoking journey that invites readers to engage with their own experiences and emotions, fostering a deeper connection to themselves and the world around them.','[\"Explores the duality of despair and hope.\", \"Encourages self-reflection and personal growth.\", \"Addresses the chaos of modern existence.\", \"Highlights the importance of understanding emotions.\", \"Promotes the search for meaning in life.\", \"Invites readers to confront their inner demons.\"]','Inferno by sGRG explores the complexities of human emotions and the struggles faced in the modern world. Through a blend of narrative and philosophical reflections, the author delves into themes of despair, hope, and the search for meaning. The book serves as a mirror to society, reflecting the chaos and confusion that often accompany personal and collective crises. Each chapter presents a unique perspective on the challenges of existence, encouraging readers to confront their own inner demons while seeking redemption and understanding. Ultimately, Inferno is a thought-provoking journey that invites readers to engage with their own experiences and emotions, fostering a deeper connection to themselves and the world around them.\n\nTarget audience: Readers interested in philosophical literature, self-help, and emotional exploration.\n\nMain themes:\n- Despair vs. Hope\n- Search for Meaning\n- Emotional Complexity\n- Redemption\n- Societal Chaos','[{\"title\": \"The Descent\", \"description\": \"An exploration of the initial feelings of despair and confusion.\", \"chapterNumber\": 1}, {\"title\": \"The Search for Light\", \"description\": \"The protagonist begins to seek hope amidst darkness.\", \"chapterNumber\": 2}, {\"title\": \"Confronting the Inner Demon\", \"description\": \"Facing personal fears and insecurities.\", \"chapterNumber\": 3}, {\"title\": \"The Role of Connection\", \"description\": \"Exploring the significance of relationships in overcoming challenges.\", \"chapterNumber\": 4}, {\"title\": \"Finding Purpose\", \"description\": \"The journey towards discovering personal meaning.\", \"chapterNumber\": 5}, {\"title\": \"Embracing Change\", \"description\": \"Learning to accept and adapt to life\'s uncertainties.\", \"chapterNumber\": 6}, {\"title\": \"The Journey to Redemption\", \"description\": \"Exploring the path towards forgiveness and healing.\", \"chapterNumber\": 7}, {\"title\": \"A New Dawn\", \"description\": \"The culmination of the protagonist\'s journey towards hope.\", \"chapterNumber\": 8}]','2026-04-27 11:54:09.245','2026-04-27 11:54:09.245');
/*!40000 ALTER TABLE `book_summaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int NOT NULL,
  `created_by` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `cover_image_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `original_pdf_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `original_pdf_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publication_year` int DEFAULT NULL,
  `isbn` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reading_time_minutes` int NOT NULL DEFAULT '15',
  `total_audio_duration` int NOT NULL DEFAULT '0',
  `average_rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `total_reviews` int NOT NULL DEFAULT '0',
  `view_count` int NOT NULL DEFAULT '0',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `summary_generated` tinyint(1) NOT NULL DEFAULT '0',
  `audio_generated` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `books_slug_key` (`slug`),
  KEY `books_category_id_idx` (`category_id`),
  KEY `books_created_by_idx` (`created_by`),
  KEY `books_slug_idx` (`slug`),
  CONSTRAINT `books_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `books_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'ttq','ttq','ec',12,'8b542fa4-764f-4a88-9bc7-d51bfef9d7f8','wFWQE','/uploads/covers/1777039368132-download.jpeg-download.jpeg','/uploads/pdfs/1777039368148-inferno.pdf-inferno.pdf',NULL,2013,'9822-22-22-22',15,0,0.00,0,0,1,1,0,0,'2026-04-24 14:02:48.532','2026-04-24 14:02:48.532'),(7,'Inferno','inferno','Dan Brown',4,'8b542fa4-764f-4a88-9bc7-d51bfef9d7f8','Inferno by Dan Brown is a fast-paced thriller following Harvard symbologist Robert Langdon, who wakes with amnesia in Florence, Italy, pursued by killers. Aided by Dr. Sienna Brooks, Langdon deciphers clues hidden in Dante Alighieri\'s Divine Comedy and Renaissance art to locate a deadly, overpopulation-reducing virus created by a transhumanist scientist.','/uploads/covers/1777283731759-download.jpeg-download.jpeg','/uploads/pdfs/1777283731773-Inferno (1).pdf-Inferno--1-.pdf','/Users/olgarubalska/Desktop/NextJS_test_project/BookWise/public/uploads/pdfs/1777283731773-Inferno (1).pdf-Inferno--1-.pdf',2013,'978-1-84356-102-7',15,0,0.00,0,0,1,1,0,0,'2026-04-27 09:55:32.138','2026-04-27 09:55:32.138'),(8,'rssrth','rssrth','rshtstrh',6,'8b542fa4-764f-4a88-9bc7-d51bfef9d7f8','shrh','/uploads/covers/1777284683662-download.jpeg-download.jpeg','/uploads/pdfs/1777284683679-inferno.pdf-inferno.pdf','/Users/olgarubalska/Desktop/NextJS_test_project/BookWise/public/uploads/pdfs/1777284683679-inferno.pdf-inferno.pdf',2025,'978-99-03999393',15,0,0.00,0,0,1,1,0,0,'2026-04-27 10:11:23.968','2026-04-27 10:11:23.968'),(9,'bjkjk','bjkjk','sGRG',3,'8b542fa4-764f-4a88-9bc7-d51bfef9d7f8','REGAEW','/uploads/covers/1777290827430-download.jpeg-download.jpeg','/uploads/pdfs/1777290827453-inferno.pdf-inferno.pdf','/Users/olgarubalska/Desktop/NextJS_test_project/BookWise/public/uploads/pdfs/1777290827453-inferno.pdf-inferno.pdf',2024,'958585-55-55',15,0,0.00,0,0,1,1,1,0,'2026-04-27 11:53:47.867','2026-04-27 11:54:09.264');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_key` (`name`),
  UNIQUE KEY `categories_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Business & Finance','business-finance','Books about business, entrepreneurship, and finance','💼',1,1,'2026-04-23 13:49:25.880','2026-04-23 13:49:25.880'),(2,'Self-Help & Personal Development','self-help','Books about personal growth and self-improvement','🌟',2,1,'2026-04-23 13:49:25.892','2026-04-23 13:49:25.892'),(3,'Psychology & Mental Health','psychology','Books about psychology, mental health, and well-being','🧠',3,1,'2026-04-23 13:49:25.899','2026-04-23 13:49:25.899'),(4,'Science & Technology','science-technology','Books about science, technology, and innovation','🔬',4,1,'2026-04-23 13:49:25.903','2026-04-23 13:49:25.903'),(5,'History & Biography','history-biography','Books about historical events and notable people','📜',5,1,'2026-04-23 13:49:25.908','2026-04-23 13:49:25.908'),(6,'Health & Fitness','health-fitness','Books about health, fitness, and nutrition','💪',6,1,'2026-04-23 13:49:25.912','2026-04-23 13:49:25.912'),(7,'Philosophy & Religion','philosophy-religion','Books about philosophy, spirituality, and religion','🕉️',7,1,'2026-04-23 13:49:25.917','2026-04-23 13:49:25.917'),(8,'Productivity & Time Management','productivity','Books about productivity, efficiency, and time management','⏰',8,1,'2026-04-23 13:49:25.921','2026-04-23 13:49:25.921'),(9,'Leadership & Management','leadership','Books about leadership, management, and team building','👔',9,1,'2026-04-23 13:49:25.924','2026-04-23 13:49:25.924'),(10,'Marketing & Sales','marketing-sales','Books about marketing, sales, and customer relations','📈',10,1,'2026-04-23 13:49:25.928','2026-04-23 13:49:25.928'),(11,'Communication & Social Skills','communication','Books about communication and interpersonal skills','💬',11,1,'2026-04-23 13:49:25.932','2026-04-23 13:49:25.932'),(12,'Creativity & Innovation','creativity','Books about creativity, innovation, and design thinking','🎨',12,1,'2026-04-23 13:49:25.935','2026-04-23 13:49:25.935');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_transactions`
--

DROP TABLE IF EXISTS `payment_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stripe_payment_intent_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `payment_status` enum('PENDING','SUCCEEDED','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_type` enum('MONTHLY','YEARLY','LIFETIME') COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_transactions_user_id_idx` (`user_id`),
  CONSTRAINT `payment_transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transactions`
--

LOCK TABLES `payment_transactions` WRITE;
/*!40000 ALTER TABLE `payment_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_orders`
--

DROP TABLE IF EXISTS `subscription_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_type` enum('MONTHLY','YEARLY','LIFETIME') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `payment_method` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BANK_TRANSFER',
  `payment_proof_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_reference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_status` enum('PENDING','APPROVED','REJECTED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `approved_by` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved_at` datetime(3) DEFAULT NULL,
  `rejected_reason` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subscription_orders_user_id_idx` (`user_id`),
  KEY `subscription_orders_order_status_idx` (`order_status`),
  CONSTRAINT `subscription_orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_orders`
--

LOCK TABLES `subscription_orders` WRITE;
/*!40000 ALTER TABLE `subscription_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscription_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_type` enum('STRING','NUMBER','BOOLEAN','JSON') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `system_settings_setting_key_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_favorites`
--

DROP TABLE IF EXISTS `user_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `book_id` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_favorites_user_id_book_id_key` (`user_id`,`book_id`),
  KEY `user_favorites_book_id_fkey` (`book_id`),
  CONSTRAINT `user_favorites_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_favorites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_favorites`
--

LOCK TABLES `user_favorites` WRITE;
/*!40000 ALTER TABLE `user_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_reading_history`
--

DROP TABLE IF EXISTS `user_reading_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_reading_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `book_id` int NOT NULL,
  `lastAccessed` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completionPercentage` int NOT NULL DEFAULT '0',
  `audioPosition` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_reading_history_user_id_book_id_key` (`user_id`,`book_id`),
  KEY `user_reading_history_book_id_fkey` (`book_id`),
  CONSTRAINT `user_reading_history_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_reading_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_reading_history`
--

LOCK TABLES `user_reading_history` WRITE;
/*!40000 ALTER TABLE `user_reading_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_reading_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `subscription_tier` enum('FREE','MONTHLY','YEARLY','LIFETIME') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FREE',
  `subscription_status` enum('ACTIVE','INACTIVE','CANCELLED','EXPIRED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INACTIVE',
  `subscription_start_date` datetime(3) DEFAULT NULL,
  `subscription_end_date_time` datetime(3) DEFAULT NULL,
  `stripe_customer_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stripe_subscription_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `audio_listen_time` int NOT NULL DEFAULT '0',
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('8b542fa4-764f-4a88-9bc7-d51bfef9d7f8','olga.rubalska@gmail.com','$2b$10$Q2p7tG7gFtV34B87hD/4/OBVoE0k5tb.GSc0wXnWoDd4zUh4WIQZy','Olga Rubalska','USER','FREE','ACTIVE','2026-05-01 15:09:54.564','2029-12-19 15:11:47.750',NULL,NULL,0,0,'2026-04-22 11:13:01.258','2026-04-22 11:13:01.258');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'bookwise'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-29 11:20:18
