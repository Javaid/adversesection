/*
SQLyog Community
MySQL - 8.0.45 : Database - provider_table
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`provider_table` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `provider_table`;

/*Table structure for table `addresses` */

DROP TABLE IF EXISTS `addresses`;

CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address_type` varchar(255) DEFAULT NULL,
  `providerId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `providerId` (`providerId`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`providerId`) REFERENCES `providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `addresses_ibfk_2` FOREIGN KEY (`providerId`) REFERENCES `nppesproviders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `addresses_ibfk_3` FOREIGN KEY (`providerId`) REFERENCES `nppesproviders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `addresses_ibfk_4` FOREIGN KEY (`providerId`) REFERENCES `nppesproviders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `addresses` */

insert  into `addresses`(`id`,`address`,`city`,`state`,`postal_code`,`phone`,`address_type`,`providerId`) values 
(1,'1075 E 51ST ST','BROOKLYN','NY','112341620','347-543-4972','LOCATION',NULL),
(2,'909 WALNUT ST FL 3','PHILADELPHIA','PA','191075211','215-955-6215','LOCATION',NULL),
(3,'8414 MIDLAND PKWY','JAMAICA','NY','114322219',NULL,'MAILING',NULL),
(4,'5645 MAIN ST','FLUSHING','NY','113555045','718-661-7267','LOCATION',NULL),
(5,'333 EDELWEISS RD','WEST ISLIP','NY','117952805','631-678-1693','MAILING',NULL),
(6,'301 E MAIN ST','BAY SHORE','NY','117068408','631-968-3400','LOCATION',NULL),
(7,'7707 5TH AVE','BROOKLYN','NY','112093311','718-748-4082','MAILING',NULL),
(8,'105 W MILLER ST','NEWARK','NY','145131422','315-331-6128','MAILING',NULL);

/*Table structure for table `doctors` */

DROP TABLE IF EXISTS `doctors`;

CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `npi` varchar(255) DEFAULT NULL,
  `speciality` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `organization_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `npi` (`npi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `doctors` */

/*Table structure for table `health_information_exchange` */

DROP TABLE IF EXISTS `health_information_exchange`;

CREATE TABLE `health_information_exchange` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int NOT NULL,
  `endpoint_type` varchar(255) DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `endpoint_description` varchar(255) DEFAULT NULL,
  `use_type` varchar(255) DEFAULT NULL,
  `content_type` varchar(255) DEFAULT NULL,
  `affiliation` varchar(255) DEFAULT NULL,
  `endpoint_location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `provider_id` (`provider_id`),
  CONSTRAINT `health_information_exchange_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=441 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `health_information_exchange` */

insert  into `health_information_exchange`(`id`,`provider_id`,`endpoint_type`,`endpoint`,`endpoint_description`,`use_type`,`content_type`,`affiliation`,`endpoint_location`) values 
(10,27,'Direct Messaging Address','ahmed.f.abbas@upmcdirect.com','','','','','600 Grant St Pittsburgh, PA 15219-2702 United States'),
(11,27,'Direct Messaging Address','MUDOCREFERRAL@direct.health.missouri.edu','Endpoint is used to receive electronic continuity of care documents (C-CDA) for outpatient referrals','Direct','Direct','	Curators of the University of Missouri','One Hospital Drive Columbia, MO 65212 United States'),
(73,27,'FHIR','https://example.com/fhir','Test Endpoint','Clinical','JSON','Hospital','NY'),
(109,29,'','','','','','',''),
(116,31,'','','','','','',''),
(122,22,'','','','','','',''),
(123,23,'','','','','','',''),
(154,46,'Direct Messaging Address','cvramana@naadihealthcare.com','Practice email address','Health Information Exchange (HIE','Health information','','	145 Trevino Ave Manteca, CA 95337-4200 United States'),
(156,47,'SOAP URL','https://careepicwest.kp.org:14430/Interconnect-prodcalgateway/wcf/epic.community.hie/xcpdrespondinggatewaysync.svc/ncalceq','Carequality','Health Information Exchange (HIE)','C-CDA','','	39400 Paseo Padre Pkwy Fremont, CA 94538-2310 United States'),
(180,59,'SOAP URL','https://careepicwest.kp.org:14430/Interconnect-prodcalgateway/wcf/epic.community.hie/xcpdrespondinggatewaysync.svc/scalceq','Carequality','Health Information Exchange (HIE)','C-CDA','Southern California Permanente Medical Group','43112 15th St W Lancaster, CA 93534-6219 United States'),
(262,44,'','','','','','',''),
(265,45,'','','','','','',''),
(268,50,'','','','','','',''),
(271,53,'','','','','','',''),
(272,54,'','','','','','',''),
(273,55,'','','','','','',''),
(274,56,'','','','','','',''),
(278,61,'','','','','','',''),
(281,57,'','','','','','',''),
(285,48,'','','','','','',''),
(292,62,'','','','','','',''),
(312,41,'','','','','','',''),
(325,66,'','','','','','',''),
(327,40,'','','','','','',''),
(330,52,'','','','','','',''),
(345,35,'','','','','','',''),
(346,38,'','','','','','',''),
(348,39,'','','','','','',''),
(349,34,'','','','','','',''),
(350,43,'','','','','','',''),
(353,51,'','','','','','',''),
(354,64,'','','','','','',''),
(356,58,'','','','','','',''),
(357,63,'','','','','','',''),
(358,49,'','','','','','',''),
(374,37,'','','','','','',''),
(381,60,'','','','','','',''),
(389,92,'Direct Messaging Address','alyanna.schild.p2@direct.spokaneeye.nextgenshare.com','Secure communication','Direct','Referrals or Continuity of care','Spokane Eye Clinic Inc, PS','427 S Bernard St Spokane, WA 99204-2509 United States'),
(390,92,'FHIR URL','https://fhir.nextgen.com/nge/prod/fhir-api-r4/fhir/r4/','','','','Spokane Eye Clinic Inc, PS','427 S Bernard St Spokane, WA 99204-2509 United States'),
(394,36,'','','','','','',''),
(398,26,'','','','','','',''),
(399,16,'','','','','','',''),
(400,94,'','','','','','',''),
(401,95,'','','','','','',''),
(402,96,'','','','','','',''),
(403,91,'','','','','','',''),
(405,93,'','','','','','',''),
(406,65,'','','','','','',''),
(407,77,'','','','','','',''),
(409,20,'','','','','','',''),
(410,21,'','','','','','',''),
(411,19,'','','','','','',''),
(412,67,'','','','','','',''),
(413,15,'','','','','','',''),
(414,42,'','','','','','',''),
(416,8,'','','','','','',''),
(417,9,'','','','','','',''),
(418,14,'','','','','','',''),
(419,12,'','','','','','',''),
(420,75,'','','','','','',''),
(421,32,'','','','','','',''),
(422,28,'','','','','','',''),
(423,68,'','','','','','',''),
(424,70,'','','','','','',''),
(425,69,'','','','','','',''),
(426,79,'','','','','','',''),
(427,25,'','','','','','',''),
(428,24,'','','','','','',''),
(429,72,'','','','','','',''),
(431,71,'','','','','','',''),
(432,73,'','','','','','',''),
(433,17,'','','','','','',''),
(434,33,'','','','','','',''),
(435,84,'','','','','','',''),
(436,85,'','','','','','',''),
(437,86,'','','','','','',''),
(438,89,'','','','','','',''),
(439,90,'','','','','','',''),
(440,101,'','','','','','','');

/*Table structure for table `login` */

DROP TABLE IF EXISTS `login`;

CREATE TABLE `login` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `login` */

insert  into `login`(`user_id`,`username`,`password`) values 
(2,'maryam','9c87baa223f464954940f859bcf2e233'),
(3,'javed','8b26e84d4bc48a6143a4f846c037403b');

/*Table structure for table `nppesproviders` */

DROP TABLE IF EXISTS `nppesproviders`;

CREATE TABLE `nppesproviders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `npi` bigint DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `organization_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `npi` (`npi`),
  UNIQUE KEY `npi_2` (`npi`),
  UNIQUE KEY `npi_3` (`npi`),
  UNIQUE KEY `npi_4` (`npi`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `nppesproviders` */

insert  into `nppesproviders`(`id`,`npi`,`first_name`,`last_name`,`organization_name`,`gender`) values 
(1,1801434949,'JOHN','ABADEER',NULL,NULL),
(2,1427724624,'JONATHAN','ABAEV',NULL,NULL),
(3,1952580102,'JONATHAN','ABAYEV',NULL,NULL),
(4,1588201701,'JOHN','ABBATE',NULL,NULL),
(5,1851606073,'JOHN','ABDULAHAD',NULL,NULL),
(6,1407001993,'JOHN','ABEEL',NULL,NULL),
(7,1104316769,'JONATHAN','ABELACK',NULL,NULL);

/*Table structure for table `oig_data` */

DROP TABLE IF EXISTS `oig_data`;

CREATE TABLE `oig_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `npi` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `speciality` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `exclusion_reason` varchar(255) DEFAULT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(10) DEFAULT NULL,
  `zip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `npi` (`npi`),
  CONSTRAINT `oig_data_ibfk_1` FOREIGN KEY (`npi`) REFERENCES `providers` (`npi`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `oig_data` */

insert  into `oig_data`(`id`,`npi`,`first_name`,`last_name`,`speciality`,`address`,`exclusion_reason`,`entity_type`,`city`,`state`,`zip`) values 
(1,'1063913515','TIFFANY','RYDER','Physician Assistant','123 Main St',NULL,NULL,'DOVER','DE','19901'),
(2,'1457444275','HEZEKIAH','MOORE','Physician M.D.LL)','77 Oak St',NULL,NULL,'DOVER','DE','19901'),
(3,'1003230079','BEN','MOUSAVI','Physician M.D.','33 Birch Ln',NULL,NULL,'WILMINGTON','DE','19802'),
(4,'1952576381','OMIED','SAMIEE','Physician M.D.','44 Pine Rd',NULL,NULL,'LEWES','DE','19958'),
(7,'1376557132','SHUN K','SUNDER','Physician M.D.','56 Cedar St',NULL,NULL,'DOVER','DE','19901'),
(8,'1932292315','FRANK','TZENG','Physician M.D.','101 Elm St',NULL,NULL,'WILMINGTON','DE','19802'),
(9,'1043471741','AUSTIN','HARRIS','Physician M.D.','11 Maple Ave',NULL,NULL,'DOVER','DE','19901'),
(12,'1871777276','ANGEL','GOMEZ-GARCIA','Physician M.D.','22 Pine Ln',NULL,NULL,'WILMINGTON','DE','19802'),
(13,'1336207505','CHIVANO','CHHIENG','Physician M.D.','44 Cedar Rd',NULL,NULL,'DOVER','DE','19901'),
(14,'1316102544','OMAR','TAHIR ','Physician M.D.','55 Elm Ave',NULL,NULL,'WILMINGTON','DE','19802'),
(15,'1457444275','HEZEKIAH','MOORE','Physician M.D.','77 Oak St',NULL,NULL,'DOVER','DE','19901'),
(16,'1003230079','BEN','MOUSAVI','Physician M.D.','88 Birch Ln',NULL,NULL,'WILMINGTON','DE','19802'),
(17,'1952576381','OMIED','SAMIEE','Physician M.D.','99 Pine Rd',NULL,NULL,'LEWES','DE','19958'),
(18,'1376557132','SHUN K','SUNDER','Physician M.D.','101 Cedar St',NULL,NULL,'DOVER','DE','19901'),
(19,'1932292315','FRANK','TZENG','Physician M.D.','102 Elm St',NULL,NULL,'WILMINGTON','DE','19802'),
(20,'1043471741','AUSTIN','HARRIS','Physician M.D.','104 Maple Ave',NULL,NULL,'DOVER','DE','19901'),
(21,'1871777276','ANGEL','GOMEZ-GARCIA','Physician M.D.','105 Pine Ln',NULL,NULL,'WILMINGTON','DE','19802');

/*Table structure for table `provider_compliance` */

DROP TABLE IF EXISTS `provider_compliance`;

CREATE TABLE `provider_compliance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int NOT NULL,
  `npi_type` varchar(50) DEFAULT NULL,
  `enumeration_date` date DEFAULT NULL,
  `sole_proprietor` tinyint(1) DEFAULT '0',
  `status` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `provider_id` (`provider_id`),
  CONSTRAINT `provider_compliance_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `provider_compliance` */

insert  into `provider_compliance`(`id`,`provider_id`,`npi_type`,`enumeration_date`,`sole_proprietor`,`status`,`createdAt`,`updatedAt`,`start_date`,`end_date`) values 
(1,17,'NPI-1 individual','2026-02-17',0,'Active','2026-02-23 21:07:01','2026-04-01 15:38:54',NULL,NULL),
(3,19,'NPI-1','2020-12-08',1,'Active','2026-02-24 10:31:39','2026-02-24 11:07:38',NULL,NULL),
(4,20,'NPI-1','2005-05-31',1,'Active','2026-02-24 14:20:32','2026-02-24 14:23:23',NULL,NULL),
(9,22,'NPI-1','2013-03-24',0,'Active','2026-02-24 15:07:35','2026-03-08 21:26:19',NULL,NULL),
(10,22,'NPI-1','2013-03-24',0,'Active','2026-02-24 21:30:55','2026-03-08 21:26:24',NULL,NULL),
(11,23,'NPI-1','2021-06-30',0,'Active','2026-02-24 22:28:22','2026-03-08 21:26:29',NULL,NULL),
(12,24,'NPI-1','2022-05-23',0,'Active','2026-02-25 21:32:15','2026-03-08 21:26:33',NULL,NULL),
(13,25,'NPI-1','2019-07-18',0,'Active','2026-02-26 14:45:11','2026-03-08 21:26:40',NULL,NULL),
(14,26,'NPI-1','2025-05-20',0,'Active','2026-02-27 10:42:27','2026-03-08 21:26:44',NULL,NULL),
(15,27,'NPI-1','2018-06-09',0,'Active','2026-02-27 12:26:19','2026-03-08 21:26:48',NULL,NULL),
(16,28,'NPI-1','2010-03-17',0,'Active','2026-03-02 13:54:02','2026-03-08 21:26:55',NULL,NULL),
(17,15,'NPI-1 individual','2018-04-03',0,'Active','2026-03-02 15:55:32','2026-04-01 14:33:55',NULL,NULL),
(22,29,'NPI-1','2022-05-19',0,'Active','2026-03-04 11:22:20','2026-03-08 21:26:06',NULL,NULL),
(23,31,'NPI-1','2024-07-12',0,'Active','2026-03-08 21:24:07','2026-03-09 10:16:14',NULL,NULL),
(24,32,'NPI-1','2006-08-23',0,'Active','2026-03-09 11:19:43','2026-03-09 11:20:08',NULL,NULL),
(25,33,'NPI-1','2006-06-16',0,'Active','2026-03-10 14:14:40','2026-03-10 14:14:40',NULL,NULL),
(26,34,'NPI-1','2018-02-21',0,'Expired','2026-03-11 10:44:58','2026-03-13 12:11:39','2021-11-03','2023-03-31'),
(27,35,'NPI-1','2006-09-29',0,'Active','2026-03-11 12:12:43','2026-03-13 11:57:56','2025-01-23','2027-03-31'),
(28,36,'NPI-1','2021-02-17',0,'Cancelled','2026-03-11 12:18:49','2026-03-12 15:38:01',NULL,NULL),
(29,37,'NPI-1','2006-10-02',1,'Accusation','2026-03-11 12:34:43','2026-03-13 12:12:04','2026-01-02',NULL),
(30,38,'NPI-1','2014-02-12',1,'First Amended Accusation','2026-03-11 12:41:59','2026-03-13 12:12:17','2026-01-02',NULL),
(31,39,'NPI-1','2008-04-27',0,'Decision','2026-03-11 12:46:36','2026-03-13 12:12:33','2026-01-05',NULL),
(32,40,'NPI-1','2006-07-28',1,'Decision','2026-03-11 13:55:27','2026-03-13 12:12:47','2026-01-05',NULL),
(33,41,'NPI-1','2006-09-30',1,'Interim Suspension Order','2026-03-11 14:01:52','2026-03-13 12:13:03','2026-01-05',NULL),
(34,42,'NPI-1','2008-06-24',0,'Accusation','2026-03-11 14:07:45','2026-03-13 12:13:35','2026-01-06',NULL),
(35,43,'NPI-1','2006-11-01',1,'Accusation','2026-03-11 14:10:32','2026-03-13 12:13:54','2026-01-07',NULL),
(36,44,'NPI-1','2007-04-10',1,'Decision','2026-03-11 14:14:47','2026-03-13 12:14:03','2026-01-08',NULL),
(37,45,'NPI-1','2010-11-30',1,'Accusation','2026-03-11 14:17:42','2026-03-13 12:14:14','2026-01-08',NULL),
(38,46,'NPI-1','2005-11-28',0,'Accusation and Petition to Revoke Probation','2026-03-11 14:21:20','2026-03-13 12:14:22','2026-01-08',NULL),
(39,47,'NPI-1','2012-02-08',1,'Accusation','2026-03-11 14:25:28','2026-03-13 12:14:32','2026-01-08',NULL),
(40,48,'NPI-1','2006-09-16',0,'Second Amended Accusation','2026-03-11 14:28:35','2026-03-13 12:14:43','2026-01-08',NULL),
(41,49,'NPI-1','2009-11-30',1,'Petition to Revoke Probation Dismissed','2026-03-11 14:30:45','2026-03-13 12:14:55','2026-01-09',NULL),
(42,50,'NPI-1','2009-10-29',0,'Accusation','2026-03-11 14:32:22','2026-03-13 12:15:06','2026-01-09',NULL),
(43,51,'NPI-1','2006-08-18',1,'Surrender','2026-03-11 14:38:37','2026-03-13 12:15:24','2026-01-09',NULL),
(44,52,'NPI-1','2020-04-22',0,'Accusation','2026-03-11 14:41:50','2026-03-13 12:15:28','2026-01-09',NULL),
(45,53,'NPI-1','2006-09-14',0,'Decision','2026-03-11 14:43:35','2026-03-13 12:15:30','2026-01-09',NULL),
(46,54,'NPI-1','2016-04-01',0,'Accusation','2026-03-11 14:45:15','2026-03-13 12:15:33','2026-01-09',NULL),
(47,55,'NPI-1','2007-05-17',1,'Public Reprimand','2026-03-11 14:47:16','2026-03-13 12:15:35','2026-01-09',NULL),
(48,56,'NPI-1','2006-08-05',1,'Accusation','2026-03-11 14:51:32','2026-03-13 12:15:38','2026-01-09',NULL),
(49,57,'NPI-1','2007-01-29',1,'Accusation','2026-03-11 14:54:52','2026-03-13 12:15:40','2026-01-09',NULL),
(50,58,'NPI-1','2007-03-12',0,'Public Letter of Reprimand','2026-03-11 14:57:15','2026-03-13 12:15:43','2026-01-09',NULL),
(51,59,'NPI-1','2015-03-26',1,'First Amended Accusation','2026-03-11 15:00:05','2026-03-13 12:15:44','2026-01-09',NULL),
(52,60,'NPI-1','2009-10-19',0,'Accusation','2026-03-11 15:04:20','2026-03-13 12:15:53','2026-01-09',NULL),
(53,61,'NPI-1','2007-06-14',1,'Decision','2026-03-11 15:07:13','2026-03-13 15:05:58','2026-01-12',NULL),
(54,62,'NPI-2','2007-05-23',0,'Repitition to Revoke Probation','2026-03-11 15:09:00','2026-03-13 12:09:38','2026-01-13','2026-03-11'),
(55,63,'NPI-1','2006-12-04',0,'Decision','2026-03-11 15:10:55','2026-03-13 12:09:52','2026-01-14',NULL),
(56,64,'NPI-1','2008-07-28',0,'Accusation','2026-03-11 15:12:53','2026-03-13 12:10:11','2026-01-14',NULL),
(57,65,'NPI-1','2007-12-20',1,'Decision','2026-03-11 15:14:38','2026-03-13 12:10:20','2026-01-15',NULL),
(58,66,'NPI-1','2006-05-03',1,'Accusation','2026-03-11 15:17:20','2026-03-13 12:10:51','2026-01-15',NULL),
(59,16,'NPI-1 individual','2006-09-13',0,NULL,'2026-04-01 12:40:08','2026-04-01 12:40:08',NULL,NULL),
(60,94,'NPI-1 individual','2024-02-22',0,NULL,'2026-04-01 12:45:25','2026-04-01 12:45:58',NULL,NULL),
(61,95,'NPI-1 individual','2024-07-07',1,NULL,'2026-04-01 12:47:07','2026-04-01 12:47:07',NULL,NULL),
(62,92,'NPI-1 individual','2016-09-19',0,NULL,'2026-04-01 12:51:53','2026-04-01 12:51:53',NULL,NULL),
(63,96,'NPI-1 individual','2018-02-14',0,NULL,'2026-04-01 12:52:41','2026-04-01 12:52:41',NULL,NULL),
(64,91,'NPI-1 individual','2023-09-19',1,NULL,'2026-04-01 12:53:29','2026-04-01 12:53:29',NULL,NULL),
(65,93,'NPI-1 individual','2023-02-03',0,NULL,'2026-04-01 12:54:42','2026-04-01 12:54:42',NULL,NULL),
(66,21,'NPI-1 individual','2016-10-08',0,NULL,'2026-04-01 14:30:43','2026-04-01 14:30:43',NULL,NULL),
(67,67,'NPI-1 individual','2013-03-21',0,NULL,'2026-04-01 14:32:39','2026-04-01 14:32:39',NULL,NULL),
(68,9,'NPI-1 individual','2006-08-18',1,NULL,'2026-04-01 14:35:22','2026-04-01 14:35:22',NULL,NULL),
(69,8,'NPI-1 individual','2008-01-30',0,NULL,'2026-04-01 14:38:04','2026-04-01 14:38:04',NULL,NULL),
(70,14,'NPI-1 individual','2006-05-16',0,NULL,'2026-04-01 14:41:17','2026-04-01 14:41:17',NULL,NULL),
(71,12,'NPI-1 individual','2017-05-15',0,NULL,'2026-04-01 14:43:23','2026-04-01 14:43:23',NULL,NULL),
(72,75,'NPI-1 individual','2007-04-25',0,NULL,'2026-04-01 14:45:19','2026-04-01 14:45:19',NULL,NULL),
(73,68,'NPI-1 individual','2007-10-04',1,NULL,'2026-04-01 14:48:07','2026-04-01 14:48:07',NULL,NULL),
(74,70,'NPI-1 individual','2023-03-07',0,NULL,'2026-04-01 14:49:27','2026-04-01 14:49:27',NULL,NULL),
(75,69,'NPI-1 individual','2018-12-04',0,NULL,'2026-04-01 14:51:10','2026-04-01 14:51:10',NULL,NULL),
(76,79,'NPI-1 individual','2015-12-29',1,NULL,'2026-04-01 14:52:20','2026-04-01 14:52:20',NULL,NULL),
(77,72,'NPI-1 individual','2008-08-06',0,NULL,'2026-04-01 15:27:14','2026-04-01 15:27:14',NULL,NULL),
(78,71,'NPI-1 individual','2019-06-12',0,NULL,'2026-04-01 15:33:29','2026-04-01 15:33:29',NULL,NULL),
(79,73,'NPI-1 individual','2024-03-25',0,NULL,'2026-04-01 15:36:45','2026-04-01 15:36:45',NULL,NULL),
(80,84,'NPI-1 individual','2006-10-02',0,NULL,'2026-04-01 15:41:28','2026-04-01 15:41:28',NULL,NULL),
(81,85,'NPI-1 individual','2006-05-17',1,NULL,'2026-04-01 15:43:26','2026-04-01 15:43:26',NULL,NULL),
(82,86,'NPI-1 individual','2021-03-25',0,NULL,'2026-04-01 15:45:49','2026-04-01 15:45:49',NULL,NULL),
(83,89,'NPI-1 individual','2007-11-11',0,NULL,'2026-04-01 15:48:51','2026-04-01 15:48:51',NULL,NULL),
(84,90,'NPI-1 individual','2008-03-06',0,NULL,'2026-04-01 15:51:02','2026-04-01 15:51:02',NULL,NULL),
(85,101,'NPI-1','2021-04-09',0,'A','2026-04-01 17:24:56','2026-04-01 17:24:56',NULL,NULL);

/*Table structure for table `provider_compliance s` */

DROP TABLE IF EXISTS `provider_compliance s`;

CREATE TABLE `provider_compliance s` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int NOT NULL,
  `source` varchar(255) DEFAULT NULL,
  `npi_type` varchar(255) DEFAULT NULL,
  `reason` text,
  `enumeration_date` date DEFAULT NULL,
  `sole_proprietor` tinyint(1) DEFAULT '0',
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `provider_id` (`provider_id`),
  CONSTRAINT `provider_compliance s_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `provider_compliance s` */

insert  into `provider_compliance s`(`id`,`provider_id`,`source`,`npi_type`,`reason`,`enumeration_date`,`sole_proprietor`,`status`) values 
(1,16,'NPPES','NPI-1',NULL,'2006-09-13',0,'A'),
(2,17,'NPPES','NPI-1 individual',NULL,NULL,0,'A');

/*Table structure for table `provider_identifiers` */

DROP TABLE IF EXISTS `provider_identifiers`;

CREATE TABLE `provider_identifiers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int NOT NULL,
  `npi_number` varchar(50) DEFAULT NULL,
  `pac_id` varchar(255) DEFAULT NULL,
  `tax_id` varchar(255) DEFAULT NULL,
  `medicare_enrollment_id` varchar(255) DEFAULT NULL,
  `medicaid_enrollment_id` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `issuer` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `number` varchar(100) DEFAULT NULL,
  `other_issuer` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `provider_id` (`provider_id`),
  CONSTRAINT `provider_identifiers_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `provider_identifiers` */

insert  into `provider_identifiers`(`id`,`provider_id`,`npi_number`,`pac_id`,`tax_id`,`medicare_enrollment_id`,`medicaid_enrollment_id`,`value`,`issuer`,`state`,`number`,`other_issuer`) values 
(1,20,'1457354813',NULL,NULL,NULL,NULL,'NPI Number','NPPES',NULL,'1457354813',NULL),
(4,21,'1629528179','','','','','','','','1629528179',''),
(6,22,'1730421165','','','','','','','WI','1730421165',''),
(9,24,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD',NULL,NULL,NULL),
(10,25,'1912550013',NULL,NULL,NULL,NULL,'','',NULL,'1912550013',NULL),
(11,26,'1326830969',NULL,NULL,NULL,NULL,'','',NULL,'1326830969',NULL),
(13,27,'1740850767',NULL,NULL,NULL,NULL,NULL,'MEDICAD',NULL,NULL,NULL),
(16,27,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(19,27,'1740850767',NULL,NULL,NULL,NULL,NULL,NULL,'MO',NULL,NULL),
(21,28,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','MD','609500303',NULL),
(22,28,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','MD','609500300',NULL),
(23,28,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','MD','609500301',NULL),
(56,28,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','MD','609550002',NULL),
(57,29,'1275270282',NULL,NULL,NULL,NULL,'','',NULL,'1275270282',NULL),
(58,31,'1710724018',NULL,NULL,NULL,NULL,'','',NULL,'1710724018',NULL),
(59,27,'1215420740',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(62,32,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','FL','256431900',NULL),
(63,31,'1710724018',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(64,33,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','GA','000960649I',NULL),
(65,33,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','GA','00960649A',NULL),
(66,33,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)','GA','P000653055','	RR Medicare'),
(67,33,'1770527814',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(68,34,'1063913515',NULL,NULL,NULL,NULL,'','',NULL,'1063913515',NULL),
(69,35,'1578655098',NULL,NULL,NULL,NULL,'','',NULL,'1578655098',NULL),
(70,36,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','NJ','0800554',NULL),
(71,37,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','CA','00G540510',NULL),
(72,38,'1003230079',NULL,NULL,NULL,NULL,'','',NULL,'1003230079',NULL),
(73,39,'1952576381',NULL,NULL,NULL,NULL,'','',NULL,'1952576381',NULL),
(74,40,'1376557132',NULL,NULL,NULL,NULL,'','',NULL,'1376557132',NULL),
(75,41,'1932292315',NULL,NULL,NULL,NULL,'','',NULL,'1932292315',NULL),
(76,42,'1043471741',NULL,NULL,NULL,NULL,'','',NULL,'1043471741',NULL),
(77,43,'1174600985',NULL,NULL,NULL,NULL,'','',NULL,'1174600985',NULL),
(78,44,'1043433808',NULL,NULL,NULL,NULL,'','',NULL,'1043433808',NULL),
(79,45,'1255633038',NULL,NULL,NULL,NULL,'','',NULL,'1255633038',NULL),
(80,46,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','OH','0141902',NULL),
(81,46,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)',NULL,'300118852','Railroad'),
(82,47,'1407128275',NULL,NULL,NULL,NULL,'','',NULL,'1407128275',NULL),
(83,48,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','CA','00A931360',NULL),
(84,49,'1225366396',NULL,NULL,NULL,NULL,'','',NULL,'1225366396',NULL),
(85,50,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','AR','061833974',NULL),
(86,50,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','CA','1457687204',NULL),
(87,51,'1235243155',NULL,NULL,NULL,NULL,'','',NULL,'1235243155',NULL),
(88,52,'1366062069',NULL,NULL,NULL,NULL,'','',NULL,'1366062069',NULL),
(89,53,'1275638009',NULL,NULL,NULL,NULL,'','',NULL,'1275638009',NULL),
(90,54,'1548623077',NULL,NULL,NULL,NULL,'','',NULL,'1548623077',NULL),
(91,55,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)','CA','CB224033','MEDICARE PTAN'),
(92,56,'1356350805',NULL,NULL,NULL,NULL,'','',NULL,'1356350805',NULL),
(93,57,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)','CA','G39826','License'),
(94,58,'1699807065',NULL,NULL,NULL,NULL,'','',NULL,'1699807065',NULL),
(95,59,'1932593068',NULL,NULL,NULL,NULL,'','',NULL,'1932593068',NULL),
(96,60,'1447586904',NULL,NULL,NULL,NULL,'','',NULL,'1447586904',NULL),
(97,61,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','CA','00A100422',NULL),
(98,62,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','CA','00798360',NULL),
(99,63,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)','CA','p161722','kaiser permanente'),
(100,64,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)','CA','C180326','	STATE LICENSE'),
(101,65,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)','CA','95-4799597','Tax ID'),
(102,66,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','CA','00G861890',NULL),
(103,93,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)','IL','209.025259','Health Alliance'),
(104,92,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)',NULL,'13960606','CAQH'),
(105,92,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','WA','2122883',NULL),
(106,9,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','CA','00A552920',NULL),
(107,9,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)',NULL,'110245797','RailRoad Medicare'),
(108,8,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','MS','06926726',NULL),
(109,8,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)','TN','6041886','BCBS'),
(110,8,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','TN','Q002944',NULL),
(111,14,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','IL','036060695',NULL),
(112,14,NULL,NULL,NULL,NULL,NULL,NULL,'Other (non-Medicare)','IL','045000608','	Blue Cross Blue Shield'),
(113,75,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','TN','1529324',NULL),
(114,84,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','NJ','9004009',NULL),
(115,84,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','NJ','9004009',NULL),
(116,90,NULL,NULL,NULL,NULL,NULL,NULL,'MEDICAD','IN','200991350',NULL),
(117,101,'1710567136',NULL,NULL,NULL,NULL,'','',NULL,'1710567136',NULL);

/*Table structure for table `provider_locations` */

DROP TABLE IF EXISTS `provider_locations`;

CREATE TABLE `provider_locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int NOT NULL,
  `type` enum('primary','secondary','mailing') NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zip` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `fax` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `provider_id` (`provider_id`),
  CONSTRAINT `provider_locations_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `provider_locations` */

insert  into `provider_locations`(`id`,`provider_id`,`type`,`name`,`address`,`city`,`state`,`zip`,`country`,`phone`,`fax`,`email`) values 
(1,14,'mailing','JAVED BANGASH','2050 LARKIN AVE','ELGIN','IL','601234405','US','847-742-9698','847-742-9743',''),
(2,14,'primary','JAVED BANGASH','2050 LARKIN AVE','ELGIN','IL','601234405','US','847-742-9698','847-742-9743',''),
(3,15,'primary','ASMAA ABADA','29425 NORTHWESTERN HWY','SOUTHFIELD','MI','480341080','US','248-557-6500','248-557-2781',''),
(4,15,'mailing','ASMAA ABADA','29425 NORTHWESTERN HWY','SOUTHFIELD','MI','480341080','US','248-557-6500','248-557-2781',''),
(5,16,'primary','AHSAN AROZULLAH','1740 W TAYLOR ST','CHICAGO','IL','606127232','US','866-600-2273','',''),
(6,16,'mailing','AHSAN AROZULLAH','1747 W ROOSEVELT RD','CHICAGO','IL','606081264','US','312-996-9399','312-413-8950',''),
(7,17,'mailing','USAMA ABO-DONIA','1461 BATH AVE','BROOKLYN','NY','112283818','US','718-450-7070','718-621-0777',''),
(8,17,'primary','USAMA ABO-DONIA','1461 BATH AVE','BROOKLYN','NY','112283818','US','718-450-7070','718-621-0777',''),
(11,19,'primary','ASADULLAH AHMADI','678 N WELLS ST','CHICAGO','IL','606543717','US','312-255-0425','',''),
(12,19,'mailing','ASADULLAH AHMADI','678 N WELLS ST','CHICAGO','IL','606543717','US','312-255-0425','',''),
(13,20,'mailing','ASAD ABBAS','1618 W BAKER RD.','BAYTOWN','TX','775212280','US','281-420-3937','281-420-1330',''),
(14,20,'primary','ASAD ABBAS','1618 W BAKER RD.','BAYTOWN','TX','775212280','US','281-420-3937','281-420-1330',''),
(15,21,'mailing','ASAD ALI','1 ATWELL RD','COOPERSTOWN','NY','133261394','US','607-547-3456','',''),
(16,21,'primary','ASAD ALI','1 ATWELL RD','COOPERSTOWN','NY','133261394','US','607-547-3282','607-547-6989',''),
(17,22,'primary','MEHREEN IQBAL','3465 NATIONAL DR STE 105','PLANO','TX','750251095','US','214-894-4530','214-894-4531',''),
(18,22,'mailing','MEHREEN IQBAL','3465 NATIONAL DR STE 105','PLANO','TX','750251095','US','214-894-4530','214-894-4531',''),
(19,23,'primary','MEHREEN ABBAS','522 TEXAN TRL','CORPUS CHRISTI','TX','784112563','US','361-400-4033','',''),
(20,23,'mailing','MEHREEN ABBAS','522 TEXAN TRL','CORPUS CHRISTI','TX','784112563','US','361-400-4033','',''),
(21,24,'primary','TAIBAH CHAUDHARY','501 S. WASHINGTON AVE.','SCRANTON','PA','18505','US','570-866-3058','',''),
(22,24,'mailing','TAIBAH CHAUDHARY','THE WRIGHT CENTER FOR GRADUATE MEDICAL EDUCATION','SCRANTON','PA','18505','US','570-866-3058','570-343-4800',''),
(23,25,'primary','TAIBAH ALBAKER','VCU SCHOOL OF DENTISTRY - DEPT OF PEDIATRIC DENTISTRY','RICHMOND','VA','232980506','US','804-467-7868','',''),
(24,25,'mailing','TAIBAH ALBAKER','PO BOX 980566','RICHMOND','VA','232980566','US','804-828-9095','',''),
(25,26,'mailing','AHMED ABDALLA','1400 BEAUMONT AVE','BEAUMONT','CA','922234704','US','951-769-4295','',''),
(26,26,'primary','AHMED ABDALLA','9493 GARFIELD ST','RIVERSIDE','CA','925033765','US','951-299-7100','',''),
(27,27,'mailing','AHMED ABBAS','201 E MADISON ST STE 328','SPRINGFIELD','IL','627025131','US','217-545-8000','',''),
(28,27,'primary','AHMED ABBAS','402 N KEENE ST STE 101','COLUMBIA','MO','652016986','US','573-882-1515','573-884-0070',''),
(29,28,'mailing','SARAH AARON','2336 GODDARD PKWY','SALISBURY','MD','218011126','US','410-334-6961','410-334-6362',''),
(30,28,'primary','SARAH AARON','29520 CANVASBACK DR','EASTON','MD','216017124','US','410-822-5007','410-822-5569',''),
(31,29,'mailing','SARAH AARON','126 VIA BUENA VENTURA','REDONDO BEACH','CA','902775805','US','','',''),
(32,29,'primary','SARAH AARON','1500 ROSECRANS AVE','MANHATTAN BEACH','CA','902663763','US','310-643-9401','',''),
(34,31,'mailing','KHADIJAH ABDUL-AZEEZ','21 CARRIAGE LAKE DR','STOCKBRIDGE','GA','302816268','US','404-951-2333','',''),
(35,31,'primary','KHADIJAH ABDUL-AZEEZ','21 CARRIAGE LAKE DR','STOCKBRIDGE','GA','302816268','US','404-951-2333','',''),
(36,32,'primary','JAWAD FARHAT','1000 PLANTATION ISLAND DR S STE 9','SAINT AUGUSTINE','FL','320803106','US','904-460-9191','904-471-4859',''),
(37,32,'mailing','JAWAD FARHAT','1000 PLANTATION ISLAND DR S STE 9','SAINT AUGUSTINE','FL','320803106','US','904-460-9191','904-471-4859',''),
(38,32,'secondary','JAWAD FARHAT','1301 PLANTATION ISLAND DRIVE','SUITE 106A SAINT AUGUSTINE','FL','32080','US',' 904-460-9191','904-471-4859',NULL),
(41,29,'primary','Main Office','123 Street','NY','NY','10001','USA','1234567890','0987654321','office@example.com'),
(42,33,'primary','UZMA HASAN','1001 SAM PERRY BLVD','FREDERICKSBURG','VA','224014453','US','540-741-3340','540-741-3348',''),
(43,33,'mailing','UZMA HASAN','1101 SAM PERRY BLVD','FREDERICKSBURG','VA','224014467','US','540-741-3340','540-741-3348',''),
(44,34,'primary','TIFFANY RYDER','640 S STATE ST','DOVER','DE','199013530','US','302-744-6156','302-735-3845',''),
(45,34,'mailing','TIFFANY RYDER','640 S. STATE STREET','DOVER','DE','199013530','US','302-480-1688','302-480-9807',''),
(46,35,'mailing','LYDELL LETTSOME','640 S STATE ST # MC3055','DOVER','DE','199013530','US','302-480-1688','302-480-9807',''),
(47,35,'primary','LYDELL LETTSOME','640 S STATE ST FL 2','DOVER','DE','199013530','US','302-744-7500','302-735-3218',''),
(48,36,'primary','AMELIA LAMB','701 N CLAYTON ST','WILMINGTON','DE','198053165','US','302-421-4100','',''),
(49,36,'mailing','AMELIA LAMB','4170 CITY AVE','PHILADELPHIA','PA','191311610','US','215-871-6100','',''),
(50,36,'secondary','AMELIA LAMB','4170 CITY AVE # 210','PHILADELPHIA','PA',NULL,'US','215-871-6100',NULL,NULL),
(51,37,'mailing','HEZEKIAH MOORE','1703 TERMINO AVE STE 204','LONG BEACH','CA','908042128','US','562-498-4425','562-498-4243',''),
(52,37,'primary','HEZEKIAH MOORE','1703 TERMINO AVE STE 204','LONG BEACH','CA','908042128','US','562-498-4425','562-498-4243',''),
(53,38,'primary','BEN MOUSAVI','7801 MISSION CENTER CT STE 105','SAN DIEGO','CA','921081314','US','818-625-7210','',''),
(54,38,'mailing','BEN MOUSAVI','7801 MISSION CENTER CT STE 105','SAN DIEGO','CA','921081314','US','818-625-7210','',''),
(55,39,'mailing','OMIED SAMIEE','840 TOWNE CENTER DR','POMONA','CA','917675900','US','909-398-1550','909-398-1573',''),
(56,39,'primary','OMIED SAMIEE','1818 N ORANGE GROVE AVE','POMONA','CA','917673028','US','909-620-7200','909-620-5800',''),
(57,40,'primary','SHUN SUNDER','43860 N. 10TH ST. WEST','LANCASTER','CA','93534','US','661-726-3060','661-726-3723',''),
(58,40,'mailing','SHUN SUNDER','43860 10TH ST W','LANCASTER','CA','935344848','US','661-726-3058','661-726-3723',''),
(59,41,'mailing','FRANK TZENG','2485 HIGH SCHOOL AVE STE 204','CONCORD','CA','945201817','US','925-676-1995','',''),
(60,41,'primary','FRANK TZENG','2485 HIGH SCHOOL AVE STE 204','CONCORD','CA','945201817','US','925-676-1995','925-676-0168',''),
(61,42,'primary','AUSTIN HARRIS','15910 VENTURA BLVD','ENCINO','CA','914362802','US','818-728-9877','',''),
(62,42,'mailing','AUSTIN HARRIS','15910 VENTURA BLVD','ENCINO','CA','914362802','US','818-728-9877','',''),
(63,43,'primary','MARISHA CHILCOTT','2800 CLEVELAND AVE','SANTA ROSA','CA','954032783','US','707-800-7568','',''),
(64,43,'mailing','MARISHA CHILCOTT','2800 CLEVELAND AVE STE A','SANTA ROSA','CA','954032784','US','707-921-7447','888-995-0195',''),
(65,43,'secondary','MARISHA CHILCOTT','5 BON AIR RD STE 107','LARKSPUR','CA',NULL,'US','415-924-1330',NULL,NULL),
(66,44,'primary','LINDSAY CLARK','880 CASS ST STE 108','MONTEREY','CA','939402948','US','831-601-8161','',''),
(67,44,'mailing','LINDSAY CLARK','PO BOX 1416','PEBBLE BEACH','CA','939531416','US','831-601-8161','',''),
(68,45,'primary','JAYNESH PATEL','155 N FRESNO ST','FRESNO','CA','937012302','US','559-232-3457','',''),
(69,45,'mailing','JAYNESH PATEL','2615 E CLINTON AVE','FRESNO','CA','937032223','US','559-232-3457','',''),
(70,46,'primary','CHIGURUPATI RAMANA','145 TREVINO AVE','MANTECA','CA','953374200','US','209-788-8180','209-783-0036',''),
(71,46,'mailing','CHIGURUPATI RAMANA','145 TREVINO AVE','MANTECA','CA','953374200','US','209-788-8180','209-783-0036',''),
(72,47,'primary','RUPINDER RANDHAWA','1501 CLAUS RD','MODESTO','CA','953559711','US','209-558-4700','209-557-6388',''),
(73,47,'mailing','RUPINDER RANDHAWA','1501 CLAUS RD','MODESTO','CA','953559711','US','209-557-6342','',''),
(74,48,'mailing','ERIC SNYDER','PO BOX 260831','ENCINO','CA','914260831','US','310-379-2134','',''),
(75,48,'primary','ERIC SNYDER','18321 CLARK ST','TARZANA','CA','913563501','US','818-708-5172','',''),
(76,49,'mailing','BABAK ABEDI','5266 CANTERBURY DR','SAN DIEGO','CA','921162006','US','310-880-2536','',''),
(77,49,'primary','BABAK ABEDI','751 MEDICAL CENTER CT','CHULA VISTA','CA','919116617','US','619-502-5800','',''),
(78,50,'mailing','MARTA ATALLA','557 N MACLAY AVE','SAN FERNANDO','CA','913402424','US','818-639-0209','818-639-0210',''),
(79,50,'primary','MARTA ATALLA','557 N MACLAY AVE','SAN FERNANDO','CA','913402424','US','818-639-0210','',''),
(80,50,'secondary','MARTA ATALLA','557 N MACLAY AVE','SAN FERNANDO','CA',NULL,'US','818-639-0209','818-639-0210',NULL),
(81,51,'primary','JOILO BARBOSA','123 E MAIN ST # 268','WALLA WALLA','WA','993621923','US','509-529-2966','',''),
(82,51,'mailing','JOILO BARBOSA','123 E MAIN ST # 268','WALLA WALLA','WA','993621923','US','','',''),
(83,52,'mailing','JOSHUA DAVIS','325 DISTEL CIR','LOS ALTOS','CA','940221408','US','','',''),
(84,52,'primary','JOSHUA DAVIS','7600 DOMINION CT','SANTA CRUZ','CA','95003','US','831-458-6200','',''),
(85,53,'primary','SIMMI DHALIWAL','160 E ARTESIA ST STE 330','POMONA','CA','917672922','US','909-622-5654','909-622-4914',''),
(86,53,'mailing','SIMMI DHALIWAL','PO BOX 9032','ALTA LOMA','CA','917011032','US','909-622-5654','909-622-4914',''),
(87,54,'primary','TESHAGER EJIGU','555 E HARDY ST','INGLEWOOD','CA','903014011','US','310-673-4660','',''),
(88,54,'mailing','TESHAGER EJIGU','555 E HARDY ST','INGLEWOOD','CA','903014011','US','310-673-4660','',''),
(89,55,'mailing','RAMIZ ELIAS','5600 SHASTA DAISY TRL','SAN DIEGO','CA','921306972','US','858-342-2226','',''),
(90,55,'primary','RAMIZ ELIAS','7695 CARDINAL CT','SAN DIEGO','CA','921233357','US','858-384-6857','858-277-1475',''),
(91,56,'mailing','G. REZA FARSAD','1401 N PALM CANYON DR','PALM SPRINGS','CA','922624434','US','760-320-3538','760-320-4579',''),
(92,56,'primary','G. REZA FARSAD','1401 N PALM CANYON DR','PALM SPRINGS','CA','922624434','US','760-320-3538','760-320-4579',''),
(93,57,'mailing','LAYBON JONES','96 SPRINGSTOWNE CTR','VALLEJO','CA','945915599','US','707-642-4155','707-642-4588',''),
(94,57,'primary','LAYBON JONES','96 SPRINGSTOWNE CTR','VALLEJO','CA','945915599','US','707-642-4155','707-642-4588',''),
(95,58,'primary','KELLY KILLEEN','436 N BEDFORD DR STE 103','BEVERLY HILLS','CA','902104323','US','310-278-8200','310-278-8230',''),
(96,58,'mailing','KELLY KILLEEN','436 N BEDFORD DR STE 103','BEVERLY HILLS','CA','902104323','US','310-278-8200','310-278-8230',''),
(97,59,'primary','KYLE SMITH','4620 HOLLYWOOD BLVD','LOS ANGELES','CA','900275408','US','323-546-4605','844-706-6440',''),
(98,59,'mailing','KYLE SMITH','4620 HOLLYWOOD BLVD','LOS ANGELES','CA','900275408','US','323-546-4605','844-706-6440',''),
(99,60,'mailing','JARED WONG','4950 SAN BERNARDINO ST STE 202','MONTCLAIR','CA','917632328','US','909-621-7647','877-887-5774',''),
(100,60,'primary','JARED WONG','4950 SAN BERNARDINO ST STE 202','MONTCLAIR','CA','917632328','US','909-621-7647','877-887-5774',''),
(101,60,'secondary','JARED WONG','315 N 3RD AVE STE 206','COVINA','CA',NULL,'US','626-593-0695','877-887-5774',NULL),
(102,61,'mailing','GADSON JOHNSON','701 SANTA MONICA BLVD','SANTA MONICA','CA','904012623','US','310-993-4103','',''),
(103,61,'primary','GADSON JOHNSON','701 SANTA MONICA BLVD','SANTA MONICA','CA','904012623','US','310-993-4103','',''),
(104,62,'mailing','','826 ORANGE AVE # 605','CORONADO','CA','921182619','US','619-435-4088','619-435-4088',''),
(105,62,'primary','','447 9TH AVE','SAN DIEGO','CA','921017369','US','619-435-4088','619-435-4088',''),
(106,63,'mailing','CHIVANO CHHIENG','300 FIR ST','SAN DIEGO','CA','921012327','US','619-499-2777','619-557-2770',''),
(107,63,'primary','CHIVANO CHHIENG','300 FIR ST','SAN DIEGO','CA','921012327','US','619-499-2777','619-557-2770',''),
(108,64,'mailing','OMAR TAHIR','18092 WIKA RD STE 220','APPLE VALLEY','CA','923072132','US','760-683-2199','888-355-9670',''),
(109,64,'primary','OMAR TAHIR','16008 KAMANA RD STE 101','APPLE VALLEY','CA','923071376','US','760-683-2199','888-355-9670',''),
(110,65,'primary','ANGEL GARCIA','3531 FEDERAL AVE','LOS ANGELES','CA','900662810','US','949-343-4911','714-771-8481',''),
(111,65,'mailing','ANGEL GARCIA','3531 FEDERAL AVE','LOS ANGELES','CA','900662810','US','949-343-4911','714-771-8481',''),
(112,66,'mailing','MICHAEL MICHALSKI','PO BOX 2248','LA MESA','CA','91943','US','619-667-7072','619-667-7064',''),
(113,66,'primary','MICHAEL MICHALSKI','5358 JACKSON DR','LA MESA','CA','919423040','US','619-667-7072','619-667-7064',''),
(114,67,'primary','ASMA ABBAS','9421 JOSEPH CAMPAU ST','HAMTRAMCK','MI','482123485','US','313-462-4960','',''),
(115,67,'mailing','ASMA ABBAS','9421 JOSEPH CAMPAU ST','HAMTRAMCK','MI','482123485','US','313-462-4960','',''),
(116,68,'primary','TAHA ABDELWAHHAB','22248 MAIN ST','HAYWARD','CA','945414005','US','650-899-0762','510-256-0248',''),
(117,68,'mailing','TAHA ABDELWAHHAB','1355 DENTON AVE','HAYWARD','CA','945452029','US','','',''),
(118,69,'primary','TAHANI ABBAS','7351 W CHARLESTON BLVD STE 120','LAS VEGAS','NV','891171572','US','702-470-0620','',''),
(119,69,'mailing','TAHANI ABBAS','21600 OXNARD ST STE 1800','WOODLAND HILLS','CA','913677807','US','','',''),
(120,70,'mailing','TAHA AFRIDI','9829 PEMBROKE DR','HAGERSTOWN','MD','217401585','US','240-469-7961','',''),
(121,70,'primary','TAHA AFRIDI','9829 PEMBROKE DR','HAGERSTOWN','MD','217401585','US','240-469-7961','',''),
(122,71,'mailing','UMER ALI','371 HOES LN','PISCATAWAY','NJ','088544143','US','732-595-2444','',''),
(123,71,'primary','UMER ALI','371 HOES LN','PISCATAWAY','NJ','088544143','US','732-595-2444','',''),
(124,72,'mailing','UMER AHMAD','8001 YOUREE DR','SHREVEPORT','LA','711152302','US','318-212-3821','318-212-3825',''),
(125,72,'primary','UMER AHMAD','8001 YOUREE DR','SHREVEPORT','LA','711152302','US','318-212-3821','318-212-3825',''),
(126,73,'primary','UMER JALIL','2902 HAINE DR','HARLINGEN','TX','785508969','US','956-296-4000','',''),
(127,73,'mailing','UMER JALIL','2902 HAINE DR','HARLINGEN','TX','785508969','US','956-296-4000','',''),
(128,74,'primary','NAILA ABDULLAH','28050 GRAND RIVER AVE','FARMINGTON HILLS','MI','48336','US','248-471-8232','',''),
(129,74,'mailing','NAILA ABDULLAH','28050 GRAND RIVER AVE','FARMINGTON HILLS','MI','483365919','US','248-471-8232','',''),
(130,75,'mailing','JAVERIA AHMED','PO BOX 400','JACKSON','TN','383020400','US','731-425-5752','731-425-5783',''),
(131,75,'primary','JAVERIA AHMED','2863 HIGHWAY 45 BYP','JACKSON','TN','383053618','US','731-664-1375','731-660-8369',''),
(132,76,'mailing','ARSALAN AHANI','30 N SAN MATEO DR','SAN MATEO','CA','944012824','US','650-340-6141','650-340-6142',''),
(133,76,'primary','ARSALAN AHANI','30 N SAN MATEO DR','SAN MATEO','CA','944012824','US','650-340-6141','650-340-6142',''),
(134,77,'mailing','ARSALAN ABBASI','200 MEMORIAL AVE','WESTMINSTER','MD','211575726','US','517-290-5377','',''),
(135,77,'primary','ARSALAN ABBASI','200 MEMORIAL AVE','WESTMINSTER','MD','211575726','US','517-290-5377','',''),
(136,79,'mailing','TAIBA ALSARRAF','780 BOYLSTON ST APT 5G','BOSTON','MA','021997804','US','','',''),
(137,79,'primary','TAIBA ALSARRAF','100 E NEWTON ST','BOSTON','MA','021182308','US','617-638-4700','',''),
(144,86,'primary','ZIAD AFFAS','22250 PROVIDENCE DR STE 705','SOUTHFIELD','MI','480756215','US','248-993-5678','',''),
(145,86,'mailing','ZIAD AFFAS','22250 PROVIDENCE DR STE 705','SOUTHFIELD','MI','480756215','US','248-552-9858','248-849-9510',''),
(150,89,'mailing','ZIAD ALI','630 W 168TH ST','NEW YORK','NY','100323725','US','212-342-3616','',''),
(151,89,'primary','ZIAD ALI','622 W 168TH ST','NEW YORK','NY','100323720','US','212-342-3616','',''),
(152,90,'mailing','ZIAD ALSOUFI','12040 NE 128TH ST','KIRKLAND','WA','980343013','US','425-899-5359','425-899-3143',''),
(153,90,'primary','ZIAD ALSOUFI','12040 NE 128TH ST','KIRKLAND','WA','980343013','US','425-899-5359','425-899-3143',''),
(154,91,'mailing','ALYANNA CARINO','251 LLEWELLYN AVE','CAMPBELL','CA','950081940','US','','',''),
(155,91,'primary','ALYANNA CARINO','251 LLEWELLYN AVE','CAMPBELL','CA','950081940','US','408-379-3790','',''),
(156,92,'mailing','ALYANNA ARZNER','427 S BERNARD ST','SPOKANE','WA','992042509','US','509-456-0107','509-747-2635',''),
(157,92,'primary','ALYANNA ARZNER','9651 N NEVADA ST','SPOKANE','WA','99218','US','509-456-0107','509-747-2635',''),
(158,93,'mailing','ALYANNA KIM BALANAY DIMLA','611 W PARK ST','URBANA','IL','618012501','US','','',''),
(159,93,'primary','ALYANNA KIM BALANAY DIMLA','516 W MADISON ST','DANVILLE','IL','618325657','US','217-383-3364','217-431-7793',''),
(160,94,'mailing','ALYANA LARRY','100 N PACIFIC COAST HWY','EL SEGUNDO','CA','902454359','US','424-210-9148','',''),
(161,94,'primary','ALYANA LARRY','100 N PACIFIC COAST HWY','EL SEGUNDO','CA','902454359','US','424-210-9148','',''),
(162,95,'primary','ALYANA SOSA','214 LONGVIEW TER','NAUGATUCK','CT','067703456','US','203-232-8411','',''),
(163,95,'mailing','ALYANA SOSA','214 LONGVIEW TER','NAUGATUCK','CT','067703456','US','203-232-8411','',''),
(164,96,'primary','ALYANNA BASKIN','3601 E 11 MILE RD','WARREN','MI','480922878','US','303-989-8169','',''),
(165,96,'mailing','ALYANNA BASKIN','3601 E 11 MILE RD','WARREN','MI','480922878','US','','',''),
(166,92,'secondary','ALYANNA ARZNER','9651 N NEVADA ST','SPOKANE, WA 99218','United States',NULL,'US','509-456-0107','509-747-2635',NULL),
(175,101,'primary','HAMZA ABBAD','1625 N CAMPBELL AVE','TUCSON','AZ','857194330','US','520-626-3894','',''),
(176,101,'mailing','HAMZA ABBAD','1625 N CAMPBELL AVE','TUCSON','AZ','857194330','US','','','');

/*Table structure for table `providers` */

DROP TABLE IF EXISTS `providers`;

CREATE TABLE `providers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `npi` varchar(20) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `npi_status` varchar(100) DEFAULT NULL,
  `mips_score` float DEFAULT NULL,
  `payment` float DEFAULT NULL,
  `medicare_status` varchar(20) DEFAULT NULL,
  `risk_level` varchar(20) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `organization_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `providerName` varchar(255) DEFAULT NULL,
  `speciality` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `npi` (`npi`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `providers` */

insert  into `providers`(`id`,`npi`,`location`,`npi_status`,`mips_score`,`payment`,`medicare_status`,`risk_level`,`first_name`,`last_name`,`organization_name`,`gender`,`providerName`,`speciality`) values 
(8,'1184801367','MEMPHIS, TN','Active',0,0,'Active','LOW','JAVED','ABDULLAH',NULL,NULL,'JAVED ABDULLAH','Internal Medicine, Interventional Cardiology'),
(9,'1346354479','INDIO, CA','Active',0,0,'Active','LOW','JAVED','AHMAD',NULL,NULL,'JAVED AHMAD','Internal Medicine'),
(12,'1497282909','ALBUQUERQUE, NM','Active',0,0,'Active','LOW','JAVED','CAPRIETTA',NULL,NULL,'JAVED CAPRIETTA','Nurse Practitioner'),
(13,'1366257859','KENDALL PARK, NJ','Active',0,0,'Active','LOW','MEHREEN','AKHTAR',NULL,NULL,'MEHREEN AKHTAR','Physical Therapist'),
(14,'1326090598','ELGIN, IL','Active',0,0,'Active','LOW','JAVED','BANGASH',NULL,NULL,'JAVED BANGASH','Pediatrics'),
(15,'1265938781','SOUTHFIELD, MI','Active',0,0,'Active','LOW','ASMAA','ABADA',NULL,NULL,'ASMAA ABADA','Podiatrist, Foot & Ankle Surgery'),
(16,'1083719173','CHICAGO, IL','Active',0,0,'Active','LOW','AHSAN','AROZULLAH',NULL,NULL,'AHSAN AROZULLAH','Internal Medicine'),
(17,'1417268905','BROOKLYN, NY','Active',0,0,'Active','LOW','USAMA','ABO-DONIA',NULL,NULL,'USAMA ABO-DONIA','Physical Therapist'),
(19,'1073119848','CHICAGO, IL','Active',0,0,'Active','LOW','ASADULLAH','AHMADI',NULL,NULL,'ASADULLAH AHMADI','Pharmacist'),
(20,'1457354813','BAYTOWN, TX','Active',0,0,'Active','LOW','ASAD','ABBAS',NULL,NULL,'ASAD ABBAS','Ophthalmology'),
(21,'1629528179','COOPERSTOWN, NY','Active',0,0,'Active','LOW','ASAD','ALI',NULL,NULL,'ASAD ALI','Internal Medicine'),
(22,'1730421165','PLANO, TX','Active',0,0,'Active','LOW','MEHREEN','IQBAL',NULL,NULL,'MEHREEN IQBAL','Anesthesiology'),
(23,'1740850767','CORPUS CHRISTI, TX','Active',0,0,'Active','LOW','MEHREEN','ABBAS',NULL,NULL,'MEHREEN ABBAS','Pediatrics'),
(24,'1669110482','SCRANTON, PA','Active',0,0,'Active','LOW','TAIBAH','CHAUDHARY',NULL,NULL,'TAIBAH CHAUDHARY','Student in an Organized Health Care Education/Training Program'),
(25,'1912550013','RICHMOND, VA','Active',0,0,'Active','LOW','TAIBAH','ALBAKER',NULL,NULL,'TAIBAH ALBAKER','Student in an Organized Health Care Education/Training Program'),
(26,'1326830969','BEAUMONT, CA','Active',0,0,'Active','LOW','AHMED','ABDALLA',NULL,NULL,'AHMED ABDALLA','Pharmacist'),
(27,'1215420740','SPRINGFIELD, IL','Active',0,0,'Active','LOW','AHMED','ABBAS',NULL,NULL,'AHMED ABBAS','Psychiatry & Neurology, Neurology'),
(28,'1316261571','SALISBURY, MD','Active',0,0,'Active','LOW','SARAH','AARON',NULL,NULL,'SARAH AARON','Counselor'),
(29,'1275270282','REDONDO BEACH, CA','Active',0,0,'Active','LOW','SARAH','AARON',NULL,NULL,'SARAH AARON','Physical Therapist'),
(31,'1710724018','STOCKBRIDGE, GA','Active',0,0,'Active','LOW','KHADIJAH','ABDUL-AZEEZ',NULL,NULL,'KHADIJAH ABDUL-AZEEZ','Behavior Technician'),
(32,'1114034709','SAINT AUGUSTINE, FL','Active',0,0,'Active','LOW','JAWAD','FARHAT',NULL,NULL,'JAWAD FARHAT','Hospitalist'),
(33,'1770527814','FREDERICKSBURG, VA','Active',0,0,'Active','LOW','UZMA','HASAN',NULL,NULL,'UZMA HASAN','Hospitalist'),
(34,'1063913515','DOVER, DE','Expired',0,0,'Active','HIGH','TIFFANY','RYDER',NULL,NULL,'TIFFANY RYDER','Physician Assistant'),
(35,'1578655098','DOVER, DE','Active',0,0,'Active','LOW','LYDELL','LETTSOME',NULL,NULL,'LYDELL LETTSOME','Surgery'),
(36,'1225621550','WILMINGTON, DE','Cancelled',0,0,'Active','LOW','AMELIA','LAMB',NULL,NULL,'AMELIA LAMB','Physician Assistant, Medical'),
(37,'1457444275','LONG BEACH, CA','Accusation',0,0,'Active','HIGH','HEZEKIAH','MOORE',NULL,NULL,'HEZEKIAH MOORE','Pediatrics'),
(38,'1003230079','SAN DIEGO, CA','First Amended Accusation',0,0,'Active','MEDIUM','BEN','MOUSAVI',NULL,NULL,'BEN MOUSAVI','General Acute Care Hospital'),
(39,'1952576381','POMONA, CA','Decision',0,0,'Active','HIGH','OMIED','SAMIEE',NULL,NULL,'OMIED SAMIEE','Internal Medicine'),
(40,'1376557132','LANCASTER, CA','Decision',0,0,'Active','MEDIUM','SHUN','SUNDER',NULL,NULL,'SHUN SUNDER','Specialist'),
(41,'1932292315','CONCORD, CA','Interim Suspension Order',0,0,'Active','HIGH','FRANK','TZENG',NULL,NULL,'FRANK TZENG','Specialist'),
(42,'1043471741','ENCINO, CA','Accusation',0,0,'Active','HIGH','AUSTIN','HARRIS',NULL,NULL,'AUSTIN HARRIS','Anesthesiology'),
(43,'1174600985','SANTA ROSA, CA','Accusation',0,0,'Active','LOW','MARISHA','CHILCOTT',NULL,NULL,'MARISHA CHILCOTT','Family Medicine'),
(44,'1043433808','MONTEREY, CA','Decision',0,0,'Active','LOW','LINDSAY','CLARK',NULL,NULL,'LINDSAY CLARK','Internal Medicine, Cardiovascular Disease'),
(45,'1255633038','FRESNO, CA','Acusation',0,0,'Active','LOW','JAYNESH','PATEL',NULL,NULL,'JAYNESH PATEL','Internal Medicine'),
(46,'1861475568','MANTECA, CA','Accusation and Petition to Revoke Probation',0,0,'Active','LOW','CHIGURUPATI','RAMANA',NULL,NULL,'CHIGURUPATI RAMANA','Radiology, Vascular & Interventional Radiology'),
(47,'1407128275','MODESTO, CA','Accusation',0,0,'Active','LOW','RUPINDER','RANDHAWA',NULL,NULL,'RUPINDER RANDHAWA','Psychiatry & Neurology, Neurology'),
(48,'1154427177','ENCINO, CA','Second Amended Accusation',0,0,'Active','LOW','ERIC','SNYDER',NULL,NULL,'ERIC SNYDER','Emergency Medicine, Emergency Medical Services'),
(49,'1225366396','SAN DIEGO, CA','Petition to Revoke Probation Dismissed',0,0,'Active','LOW','BABAK','ABEDI',NULL,NULL,'BABAK ABEDI','Anesthesiology'),
(50,'1457687204','SAN FERNANDO, CA','Accusation',0,0,'Active','LOW','MARTA','ATALLA',NULL,NULL,'MARTA ATALLA','Pediatrics'),
(51,'1235243155','WALLA WALLA, WA','Surrender',0,0,'Active','LOW','JOILO','BARBOSA',NULL,NULL,'JOILO BARBOSA','Emergency Medicine'),
(52,'1366062069','LOS ALTOS, CA','Accusation',0,0,'Active','LOW','JOSHUA','DAVIS',NULL,NULL,'JOSHUA DAVIS','Family Medicine'),
(53,'1275638009','POMONA, CA','Decision',0,0,'Active','LOW','SIMMI','DHALIWAL',NULL,NULL,'SIMMI DHALIWAL','Obstetrics & Gynecology'),
(54,'1548623077','INGLEWOOD, CA','Accusation',0,0,'Active','LOW','TESHAGER','EJIGU',NULL,NULL,'TESHAGER EJIGU','Internal Medicine'),
(55,'1417164518','SAN DIEGO, CA','Public Reprimand',0,0,'Active','LOW','RAMIZ','ELIAS',NULL,NULL,'RAMIZ ELIAS','Internal Medicine'),
(56,'1356350805','PALM SPRINGS, CA','Accusation',0,0,'Active','LOW','G. REZA','FARSAD',NULL,NULL,'G. REZA FARSAD','Specialist'),
(57,'1205972296','VALLEJO, CA','Accusation',0,0,'Active','LOW','LAYBON','JONES',NULL,NULL,'LAYBON JONES','Internal Medicine, Cardiovascular Disease'),
(58,'1699807065','BEVERLY HILLS, CA','Public Letter of Reprimand',0,0,'Active','LOW','KELLY','KILLEEN',NULL,NULL,'KELLY KILLEEN','Plastic Surgery'),
(59,'1932593068','LOS ANGELES, CA','First Amended Accusation',0,0,'Active','LOW','KYLE','SMITH',NULL,NULL,'KYLE SMITH','Psychiatry & Neurology, Psychiatry'),
(60,'1447586904','MONTCLAIR, CA','Accusation',0,0,'Active','LOW','JARED','WONG',NULL,NULL,'JARED WONG','Surgery'),
(61,'1578767232','SANTA MONICA, CA','Decision',0,0,'Active','LOW','GADSON','JOHNSON',NULL,NULL,'GADSON JOHNSON','Psychiatry & Neurology, Psychiatry'),
(62,'1255542908','CORONADO, CA','Petition to Revoke Probation',0,0,'Active','LOW',NULL,NULL,'RICHARD HEIDENFELDER MD',NULL,'RICHARD HEIDENFELDER MD','Psychiatry & Neurology, Psychiatry'),
(63,'1336207505','SAN DIEGO, CA','Decision',0,0,'Active','MEDIUM','CHIVANO','CHHIENG',NULL,NULL,'CHIVANO CHHIENG','Family Medicine'),
(64,'1316102544','APPLE VALLEY, CA','Accusation',0,0,'Active','MEDIUM','OMAR','TAHIR',NULL,NULL,'OMAR TAHIR',NULL),
(65,'1871777276','LOS ANGELES, CA','Decision',0,0,'Active','MEDIUM','ANGEL','GARCIA',NULL,NULL,'ANGEL GARCIA','Clinic/Center, Ambulatory Surgical'),
(66,'1104884790','LA MESA, CA','Accusation',0,0,'Active','LOW','MICHAEL','MICHALSKI',NULL,NULL,'MICHAEL MICHALSKI','Internal Medicine, Cardiovascular Disease'),
(67,'1982946463','HAMTRAMCK, MI','Active',0,0,'Active','Clear','ASMA','ABBAS',NULL,NULL,'ASMA ABBAS','Family Medicine'),
(68,'1760670616','HAYWARD, CA','Active',0,0,'Active','Clear','TAHA','ABDELWAHHAB',NULL,NULL,'TAHA ABDELWAHHAB','Registered Nurse'),
(69,'1225508161','LAS VEGAS, NV','Active',0,0,'Active','Clear','TAHANI','ABBAS',NULL,NULL,'TAHANI ABBAS','Behavior Technician'),
(70,'1366145443','HAGERSTOWN, MD','Active',0,0,'Active','Clear','TAHA','AFRIDI',NULL,NULL,'TAHA AFRIDI','Student in an Organized Health Care Education/Training Program'),
(71,'1609435650','PISCATAWAY, NJ','Active',0,0,'Active','Clear','UMER','ALI',NULL,NULL,'UMER ALI','Specialist/Technologist, Other, Electroneurodiagnostic'),
(72,'1265698591','SHREVEPORT, LA','Active',0,0,'Active','Clear','UMER','AHMAD',NULL,NULL,'UMER AHMAD','Internal Medicine'),
(73,'1295585115','HARLINGEN, TX','Active',0,0,'Active','Clear','UMER','JALIL',NULL,NULL,'UMER JALIL','Student in an Organized Health Care Education/Training Program'),
(74,'1700372273','FARMINGTON HILLS, MI','Active',0,0,'Active','Clear','NAILA','ABDULLAH',NULL,NULL,'NAILA ABDULLAH','Internal Medicine'),
(75,'1457570475','JACKSON, TN','Active',0,0,'Active','Clear','JAVERIA','AHMED',NULL,NULL,'JAVERIA AHMED','Internal Medicine, Endocrinology, Diabetes & Metabolism'),
(76,'1215035696','SAN MATEO, CA','Active',0,0,'Active','Clear','ARSALAN','AHANI',NULL,NULL,'ARSALAN AHANI','Dentist, Oral and Maxillofacial Surgery'),
(77,'1942762604','WESTMINSTER, MD','Active',0,0,'Active','Clear','ARSALAN','ABBASI',NULL,NULL,'ARSALAN ABBASI','Internal Medicine'),
(79,'1174988547','BOSTON, MA','Active',0,0,'Active','Clear','TAIBA','ALSARRAF',NULL,NULL,'TAIBA ALSARRAF','Advanced Practice Dental Therapist'),
(84,'1740373489','NEPTUNE, NJ','Active',0,0,'Active','Clear','ZIAD','ABBUD',NULL,NULL,'ZIAD ABBUD','Specialist'),
(85,'1700838414','DALLAS, TX','Active',0,0,'Active','Clear','ZIAD','ABDO',NULL,NULL,'ZIAD ABDO','Emergency Medicine, Emergency Medical Services'),
(86,'1205413200','SOUTHFIELD, MI','Active',0,0,'Active','Clear','ZIAD','AFFAS',NULL,NULL,'ZIAD AFFAS','Student in an Organized Health Care Education/Training Program'),
(89,'1588844245','NEW YORK, NY','Active',0,0,'Active','Clear','ZIAD','ALI',NULL,NULL,'ZIAD ALI','Internal Medicine'),
(90,'1760652648','KIRKLAND, WA','Active',0,0,'Active','Clear','ZIAD','ALSOUFI',NULL,NULL,'ZIAD ALSOUFI','Hospitalist'),
(91,'1487432571','CAMPBELL, CA','Active',0,0,'Active','Clear','ALYANNA','CARINO',NULL,NULL,'ALYANNA CARINO','Licensed Vocational Nurse'),
(92,'1750839742','SPOKANE, WA','Active',0,0,'Active','Clear','ALYANNA','ARZNER',NULL,NULL,'ALYANNA ARZNER','Optometrist'),
(93,'1073219838','URBANA, IL','Active',0,0,'Active','Clear','ALYANNA KIM','BALANAY DIMLA',NULL,NULL,'ALYANNA KIM BALANAY DIMLA','Nurse Practitioner, Family'),
(94,'1093571606','EL SEGUNDO, CA','Active',0,0,'Active','Clear','ALYANA','LARRY',NULL,NULL,'ALYANA LARRY','Behavior Technician'),
(95,'1124864731','NAUGATUCK, CT','Active',0,0,'Active','Clear','ALYANA','SOSA',NULL,NULL,'ALYANA SOSA','Nurse Practitioner'),
(96,'1710487913','WARREN, MI','Active',0,0,'Active','Clear','ALYANNA','BASKIN',NULL,NULL,'ALYANNA BASKIN','Behavior Technician'),
(101,'1710567136','TUCSON, AZ','Active',0,0,'Active','Clear','HAMZA','ABBAD',NULL,NULL,'HAMZA ABBAD','Psychiatry & Neurology, Neurology');

/*Table structure for table `sam_data` */

DROP TABLE IF EXISTS `sam_data`;

CREATE TABLE `sam_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `npi` varchar(255) NOT NULL,
  `classification` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `prefix` varchar(50) DEFAULT NULL,
  `first` varchar(100) DEFAULT NULL,
  `middle` varchar(100) DEFAULT NULL,
  `last` varchar(100) DEFAULT NULL,
  `suffix` varchar(50) DEFAULT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `address3` varchar(255) DEFAULT NULL,
  `address4` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `open_data_flag` char(1) DEFAULT NULL,
  `exclusion_program` varchar(100) DEFAULT NULL,
  `excluding_agency` varchar(100) DEFAULT NULL,
  `ct_code` varchar(50) DEFAULT NULL,
  `exclusion_type` varchar(100) DEFAULT NULL,
  `additional_comments` varchar(255) DEFAULT NULL,
  `active_date` date DEFAULT NULL,
  `termination_date` date DEFAULT NULL,
  `record_status` varchar(50) DEFAULT NULL,
  `cross_reference` varchar(100) DEFAULT NULL,
  `cage` varchar(50) DEFAULT NULL,
  `creation_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `npi` (`npi`),
  CONSTRAINT `sam_data_ibfk_1` FOREIGN KEY (`npi`) REFERENCES `providers` (`npi`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `sam_data` */

insert  into `sam_data`(`id`,`npi`,`classification`,`name`,`prefix`,`first`,`middle`,`last`,`suffix`,`address1`,`address2`,`address3`,`address4`,`city`,`state`,`country`,`zip_code`,`open_data_flag`,`exclusion_program`,`excluding_agency`,`ct_code`,`exclusion_type`,`additional_comments`,`active_date`,`termination_date`,`record_status`,`cross_reference`,`cage`,`creation_date`) values 
(1,'1063913515','Individual','RYDER, TIFFANY','Ms.','TIFFANY','E','RYDER',NULL,'123 Main St',NULL,NULL,NULL,'DOVER','DE','USA','19901',NULL,'SAMA','OIG','DE001','Debarred',NULL,'2023-01-01','2023-12-31','Active','CAGE001',NULL,'2026-03-16'),
(2,'1457444275','Individual','MOORE, HEZEKIAH','Mr.','HEZEKIAH','N','MOORE',NULL,'678 Walnut Ave',NULL,NULL,NULL,'DOVER','DE','USA','19901',NULL,'SAMG','OIG','DE007','Debarred',NULL,'2023-01-01','2023-12-31','Active','CAGE007',NULL,'2026-03-16'),
(3,'1003230079','Individual','MOUSAVI, BEN','Mr.','BEN',NULL,'MOUSAVI',NULL,'987 Spruce Ln',NULL,NULL,NULL,'WILMINGTON','DE','USA','19802',NULL,'SAMH','OIG','DE008','Suspension',NULL,'2023-01-01','2023-12-31','Active','CAGE008',NULL,'2026-03-16'),
(4,'1952576381','Individual','SAMIEE, OMIED','Mr.','OMIED',NULL,'SAMIEE',NULL,'987 Spruce Ln',NULL,NULL,NULL,'LEWES','DE','USA','19958',NULL,'SAMI','OIG','DE009','Debarred',NULL,'2023-01-01','2023-12-31','Active','CAGE009',NULL,'2026-03-16'),
(5,'1376557132','Individual','SUNDER, SHUN K','Mr.','SHUN K','','SUNDER',NULL,'246 Pine Ave',NULL,NULL,NULL,'DOVER','DE','USA','19901',NULL,'SAMJ','OIG','DE010','Suspension',NULL,'2023-01-01','2023-12-31','Active','CAGE010',NULL,'2026-03-16'),
(6,'1932292315','Individual','TZENG, FRANK S','Mr.','FRANK S',NULL,'TZENG',NULL,'357 Cedar Rd',NULL,NULL,NULL,'WILMINGTON','DE','USA','19802',NULL,'SAMK','OIG','DE011','Debarred',NULL,'2023-01-01','2023-12-31','Active','CAGE011',NULL,'2026-03-16'),
(7,'1043471741','Individual','HARRIS AUSTIN B','Mr.','AUSTIN B',NULL,'HARRIS',NULL,'579 Oak St',NULL,NULL,NULL,'DOVER','DE','USA','19901',NULL,'SAMM','OIG','DE013','Debarred',NULL,'2023-01-01','2023-12-31','Active','CAGE013',NULL,'2026-03-16'),
(11,'1871777276','Individual','GOMEZ-GARCIA, ANGEL H','Mr.','ANGEL H',NULL,'GOMEZ-GARCIA',NULL,'680 Maple Rd',NULL,NULL,NULL,'WILMINGTON','DE','USA','19802',NULL,'SAMN','OIG','DE014','Suspension',NULL,'2023-01-01','2023-12-31','Active','CAGE014',NULL,'2026-03-16');

/*Table structure for table `taxonomies` */

DROP TABLE IF EXISTS `taxonomies`;

CREATE TABLE `taxonomies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taxonomy_code` varchar(255) DEFAULT NULL,
  `taxonomy_description` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT NULL,
  `providerId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `providerId` (`providerId`),
  CONSTRAINT `taxonomies_ibfk_1` FOREIGN KEY (`providerId`) REFERENCES `providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `taxonomies_ibfk_2` FOREIGN KEY (`providerId`) REFERENCES `nppesproviders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `taxonomies_ibfk_3` FOREIGN KEY (`providerId`) REFERENCES `nppesproviders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `taxonomies_ibfk_4` FOREIGN KEY (`providerId`) REFERENCES `nppesproviders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `taxonomies` */

insert  into `taxonomies`(`id`,`taxonomy_code`,`taxonomy_description`,`is_primary`,`providerId`) values 
(1,'363A00000X','Physician Assistant',1,NULL),
(2,'122300000X','Dentist',0,NULL),
(3,'363A00000X','Physician Assistant',1,NULL),
(4,'225100000X','Physical Therapist',1,NULL),
(5,'183500000X','Pharmacist',1,NULL),
(6,'183500000X','Pharmacist',1,NULL);

/*Table structure for table `taxonomy` */

DROP TABLE IF EXISTS `taxonomy`;

CREATE TABLE `taxonomy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int NOT NULL,
  `primary_taxonomy` varchar(100) DEFAULT NULL,
  `selected_taxonomy` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `document_link` text,
  `source_url` text,
  PRIMARY KEY (`id`),
  KEY `provider_id` (`provider_id`),
  CONSTRAINT `taxonomy_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=173 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `taxonomy` */

insert  into `taxonomy`(`id`,`provider_id`,`primary_taxonomy`,`selected_taxonomy`,`state`,`license_number`,`status`,`document_link`,`source_url`) values 
(14,26,'Yes','183500000X-Pharmacist','CA','90914',NULL,NULL,NULL),
(16,27,'Yes','2084N0400X','MO','2025034841',NULL,NULL,NULL),
(17,27,'No','2084N0400X','MO','2025034841',NULL,NULL,NULL),
(23,25,'Yes','390200000X-Student in an Organized Health Care Education','VA','0442000372',NULL,NULL,NULL),
(24,16,'Yes','207R00000X-Internal Medicine','IL','036090744',NULL,NULL,NULL),
(25,24,'Yes','390200000X-Student in an Organized Health Care Education','PA',NULL,NULL,NULL,NULL),
(27,28,'Counselor','101Y00000X',NULL,NULL,NULL,NULL,NULL),
(28,15,'Yes','213ES0103X-Podiatrist, Foot & Ankle Surgery','MI','5901400432',NULL,NULL,NULL),
(30,29,'Physical Therapist','225100000X','CA','302115',NULL,NULL,NULL),
(32,31,'Behavior Technician','106S00000X',NULL,NULL,NULL,NULL,NULL),
(33,19,'Pharmacist','183500000X','IL','051303544',NULL,NULL,NULL),
(34,21,'No','207R00000X- Internal Medicine','PA','MT214831',NULL,NULL,NULL),
(35,21,'Yes','207RN0300X-Internal Medicine, Nephrology','NY','309509',NULL,NULL,NULL),
(36,23,'Pediatrics','208000000X','TX','V0324',NULL,NULL,NULL),
(38,32,'No','208M00000X','FL','ME74226',NULL,NULL,NULL),
(39,32,'Yes','207R00000X','FL','ME74226',NULL,NULL,NULL),
(40,22,NULL,'207L00000X','TX','T4396',NULL,NULL,NULL),
(41,22,NULL,'207L00000X','WI','69711',NULL,NULL,NULL),
(42,22,NULL,'207L00000X','MO','2019032504',NULL,NULL,NULL),
(43,22,NULL,'207LP2900X','MO','2019032504',NULL,NULL,NULL),
(44,22,'Anesthesiology, Pain Medicine','207LP2900X','TX','T4396',NULL,NULL,NULL),
(46,33,'Yes','208M00000X','VA','0101248466',NULL,NULL,NULL),
(47,33,'No','207R00000X','VA','0101248466',NULL,NULL,NULL),
(49,34,'Physician Assistant','363A00000X','DE','C5-0011625','Expired','https://delpros.delaware.gov/oh_verifylicensedetails?pid=a0e8y000000rSI3AAM','https://delpros.delaware.gov/OH_VerifyLicense(AL)'),
(51,35,'Surgery','208600000X','DE','C1-0024789','Active','https://delpros.delaware.gov/oh_verifylicensedetails?pid=a0e8y000001abgiAAA','https://delpros.delaware.gov/OH_VerifyLicense(AL)'),
(53,36,'NO','363AM0700X-physician Assistant','DE','C5-0011584','Cancelled','https://delpros.delaware.gov/oh_verifylicensedetails?pid=a0e8y000001ak3kAAA','https://delpros.delaware.gov/OH_VerifyLicense(AL)'),
(54,36,'NO','390200000X-Student in an Organized Health Care Education',NULL,NULL,'Cancelled','https://delpros.delaware.gov/oh_verifylicensedetails?pid=a0e8y000001ak3kAAA','https://delpros.delaware.gov/OH_VerifyLicense(AL)'),
(55,36,'Yes','363A00000X-physician Assistant','DE','C5-0011584','Cancelled','https://delpros.delaware.gov/oh_verifylicensedetails?pid=a0e8y000001ak3kAAA','https://delpros.delaware.gov/OH_VerifyLicense(AL)'),
(57,37,'Yes','208000000X - Pediatrics','CA','G54051','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(59,38,'No','282N00000X- General Acute Care Hospital',NULL,NULL,'First Amended Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(60,38,'Yes','207R00000X-Internal Medicine','CA','A131983','First Amended Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(62,39,'No','207R00000X- Internal Medicine','CA','A119974','Decision','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(63,39,'Yes','208M00000X- Hospitalist','CA','A119974','Decision','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(65,40,'Yes','174400000X- Specialist','CA','A26701','Decision','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(67,41,'Yes','174400000X- Specialist','CA','A48433','Interim Suspension Order','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(69,42,'Yes','207L00000X- Anesthesiology','CA','A115606','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(71,43,'Yes','207Q00000X- Family Medicine','CA','a88901','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(73,44,'Yes',' 207RC0000X-Internal Medicine, Cardiovascular Disease','CA','A96580','Decisiom','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(75,45,'No','207R00000X- Internal Medicine','CA','A124058','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(76,45,'No','207RS0012X- Internal Medicine - Sleep Medicine','CA','A124058','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(77,45,'Yes','208M00000X- Hospitalist','CA','A124058','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(79,46,'Yes','2085R0204X- Radiology, Vascular & Interventional Radiology','CA','C170471','Accusation and Petition to Revoke Probation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(81,47,'No','2084N0400X- Psychiatry & Neurology - Neurology','IL','125-060725','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(82,47,'Yes','2084N0400X- Psychiatry & Neurology, Neurology','CA','A140073','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(84,48,'Yes','207PE0004X- Emergency Medicine, Emergency Medical Services','CA','A93136','Second Amended Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(86,49,'Yes','207L00000X- Anesthesiology','CA','A95902','Petition to Revoke Probation Dismissed','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(88,50,'No','208000000X- Pediatrics','AR','t2009-123','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(89,50,'No','208000000X- Pediatrics','CA','A121879','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(90,50,'Yes','174400000X- Specialist','CA','A121879','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(92,51,'No','207P00000X- Emergency Medicine','WA','000043302','Surrender','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(93,51,'Yes','207P00000X- Emergency Medicine','CA','G159851','Surrender','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(95,52,'Yes','207Q00000X- Family Medicine','CA','A192258','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(97,53,'Yes','207V00000X- Obstetrics & Gynecology','CA','A63694','Decision','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(99,54,'Yes','207R00000X- Internal Medicine','CA','A186107','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(101,55,'No','207R00000X- Internal Medicine','CA','A99956','Public Reprimand','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(102,55,'No','282N00000X- General Acute Care Hospital','CA','A99956','Public Reprimand','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(103,55,'No','208M00000X- Hospitalist','CA','A99956','Public Reprimand','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(104,55,'No','208D00000X- General Practice','CA','A99956','Public Reprimand','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(105,55,'Yes','261QP2300X- Clinic/Center, Primary Care','CA','A99956','Public Reprimand','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(107,56,'No','174400000X-Specialist','CA','00A378650','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(108,56,'Yes','174400000X- Specialist','CA','A037865','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(110,57,'Yes','207RC0000X- Internal Medicine, Cardiovascular Disease','CA','G39826','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(112,58,'Yes','208200000X- Plastic Surgery','CA','A92060','Public Letter of Reprimand','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(114,59,'Yes','2084P0800X- Psychiatry & Neurology, Psychiatry','CA','A144448','First Amended Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(116,60,'Yes','208600000X- Surgery','CA','A137345','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(118,61,'Yes','2084P0800X- Psychiatry & Neurology, Psychiatry','CA','A100422','Decision','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(120,62,'Yes','2084P0800X- Psychiatry & Neurology, Psychiatry','CA','A79836','Petition to Revoke Probation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(122,63,'Yes','207Q00000X- Family Medicine','CA','A71847','Decision','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(124,64,'Yes','2086S0129X','CA','C180326','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(126,65,'Yes','261QA1903X- Clinic/Center, Ambulatory Surgical','CA','A052635','Decision','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(128,66,'Yes','207RC0000X- Internal Medicine, Cardiovascular Disease','CA','G86189','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(129,66,'No','207RI0011X- Internal Medicine - Interventional Cardiology','CA','G86189','Accusation','https://mbc.ca.gov/Download/Documents/alert-actions-2026.xlsx','https://mbc.ca.gov/Resources/Publications/Alerts.aspx'),
(135,8,'No','207RI0011X- Internal Medicine - Interventional Cardiology','TN','50265',NULL,NULL,NULL),
(136,8,'Yes','207RI0011X- Internal Medicine - Interventional Cardiology','MS','23973',NULL,NULL,NULL),
(137,14,'No','208000000X- Pediatrics','IL','336025262',NULL,NULL,NULL),
(138,14,'Yes','208000000X- Pediatrics','IL','036-060695',NULL,NULL,NULL),
(139,17,'Yes','225100000X-Physical Therapist','NY','015685-1',NULL,NULL,NULL),
(140,68,'No','163W00000X-Registered Nurse','CA','641128',NULL,NULL,NULL),
(141,68,'Yes','363L00000X-Nurse Practitioner','CA','22045',NULL,NULL,NULL),
(142,73,'Yes','390200000X-Student in an Organized Health Care Education',NULL,NULL,NULL,NULL,NULL),
(143,89,'Yes','207R00000X- Internal Medicine','NY','261488',NULL,NULL,NULL),
(144,93,'Yes','363LF0000X-Nurse Practitioner, Family','IL','209.025259',NULL,NULL,NULL),
(145,94,'Yes','106S00000X-Behavior Technician',NULL,NULL,NULL,NULL,NULL),
(146,95,'No','363L00000X-Nurse Practitioner','CT','16230',NULL,NULL,NULL),
(147,95,'Yes','163W00000X-Registered Nurse','CT','222263',NULL,NULL,NULL),
(148,92,'No','152W00000X-Optometrist','OR','4053ATI',NULL,NULL,NULL),
(149,92,'Yes','152W00000X-Optometrist','WA','OD60903815',NULL,NULL,NULL),
(150,96,'Yes','106S00000X-Behavior Technician',NULL,NULL,NULL,NULL,NULL),
(151,91,'Yes','164X00000X-Licensed Vocational Nurse','CA','735657',NULL,NULL,NULL),
(152,77,'Internal Medicine','207R00000X','MD','D0094681',NULL,NULL,NULL),
(153,67,'Yes','207Q00000X- Family Medicine','MI','4301114339',NULL,NULL,NULL),
(154,20,'Ophthalmology','207W00000X','TX','L3898',NULL,NULL,NULL),
(155,9,'Yes','207R00000X- Internal Medicine','CA','A55292',NULL,NULL,NULL),
(156,12,'No','363L00000X-Nurse Practitioner','NM','CNP-03316',NULL,NULL,NULL),
(157,12,'No','363LF0000X-Nurse Practitioner, Family','FL','ARNP9340971',NULL,NULL,NULL),
(158,12,'No','363LP0808X- Nurse Practitioner - Psych/Mental Health','FL','APRN9340971',NULL,NULL,NULL),
(159,12,'Yes','363LP0808X- Nurse Practitioner - Psych/Mental Health','NM','CNP03316',NULL,NULL,NULL),
(160,75,'Yes','207RE0101X- Internal Medicine - Endocrinology, Diabetes & Metabolism','TN','44235',NULL,NULL,NULL),
(161,70,'Yes','390200000X-Student in an Organized Health Care Education',NULL,NULL,NULL,NULL,NULL),
(162,69,'Yes','106S00000X-Behavior Technician',NULL,NULL,NULL,NULL,NULL),
(163,79,'Yes','125K00000X-Advanced Practice Dental Therapist','MA','BB1832268PTA1',NULL,NULL,NULL),
(164,72,'Yes','207R00000X- Internal Medicine','LA','202279',NULL,NULL,NULL),
(165,71,'Yes','246ZE0600X-Specialist/Technologist, Other, Electroneurodiagnostic','NJ','4181',NULL,NULL,NULL),
(166,84,'Yes','174400000X- Specialist','NJ','ma06183300',NULL,NULL,NULL),
(167,85,'No','207PE0004X- Emergency Medicine, Emergency Medical Services','TX','L7939',NULL,NULL,NULL),
(168,85,'Yes','208600000X- Surgery','TX','L7939',NULL,NULL,NULL),
(169,86,'No','390200000X-Student in an Organized Health Care Education',NULL,NULL,NULL,NULL,NULL),
(170,86,'Yes','207RC0000X- Internal Medicine, Cardiovascular Disease','MI','4351048401',NULL,NULL,NULL),
(171,90,'Yes','208M00000X- Hospitalist','IN','01067754A',NULL,NULL,NULL),
(172,101,'','','','','','','');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `users` */

/* Procedure structure for procedure `DeleteProviderCompliance` */

/*!50003 DROP PROCEDURE IF EXISTS  `DeleteProviderCompliance` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteProviderCompliance`(
    IN p_id INT
)
BEGIN
    DELETE FROM provider_compliance
    WHERE id = p_id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `DeleteProviderLocation` */

/*!50003 DROP PROCEDURE IF EXISTS  `DeleteProviderLocation` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteProviderLocation`(IN p_id INT)
BEGIN
    DELETE FROM provider_locations WHERE id=p_id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `GetAllProviders` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetAllProviders` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllProviders`()
BEGIN
  SELECT * FROM providers;
END */$$
DELIMITER ;

/* Procedure structure for procedure `GetComplianceByProviderId` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetComplianceByProviderId` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `GetComplianceByProviderId`(
    IN p_provider_id INT
)
BEGIN
    SELECT *
    FROM provider_compliance
    WHERE provider_id = p_provider_id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `GetIdentifiersByProviderId` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetIdentifiersByProviderId` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `GetIdentifiersByProviderId`(
    IN p_provider_id INT
)
BEGIN
    SELECT * FROM provider_identifiers WHERE provider_id = p_provider_id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `GetLocationsByProviderId` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetLocationsByProviderId` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `GetLocationsByProviderId`(IN p_provider_id INT)
BEGIN
    SELECT * FROM provider_locations WHERE provider_id = p_provider_id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `GetProviderById` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetProviderById` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `GetProviderById`(IN p_id INT)
BEGIN
  SELECT * FROM providers WHERE id = p_id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `getProviderByNpi` */

/*!50003 DROP PROCEDURE IF EXISTS  `getProviderByNpi` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `getProviderByNpi`(IN npiVal VARCHAR(20))
BEGIN
   SELECT * FROM providerss WHERE npi = npiVal;
END */$$
DELIMITER ;

/* Procedure structure for procedure `GetTaxonomyByProviderId` */

/*!50003 DROP PROCEDURE IF EXISTS  `GetTaxonomyByProviderId` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `GetTaxonomyByProviderId`(
    IN p_provider_id INT
)
BEGIN
    SELECT *
    FROM taxonomy
    WHERE provider_id = p_provider_id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `InsertHealthInformationExchange` */

/*!50003 DROP PROCEDURE IF EXISTS  `InsertHealthInformationExchange` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertHealthInformationExchange`(
  IN p_provider_id INT,
  IN p_endpoint_type VARCHAR(255),
  IN p_endpoint VARCHAR(255),
  IN p_endpoint_description VARCHAR(255),
  IN p_use_type VARCHAR(255),
  IN p_content_type VARCHAR(255),
  IN p_affiliation VARCHAR(255),
  IN p_endpoint_location VARCHAR(255)
)
BEGIN

INSERT INTO health_information_exchange(
  provider_id,
  endpoint_type,
  ENDPOINT,
  endpoint_description,
  use_type,
  content_type,
  affiliation,
  endpoint_location
)
VALUES(
  p_provider_id,
  p_endpoint_type,
  p_endpoint,
  p_endpoint_description,
  p_use_type,
  p_content_type,
  p_affiliation,
  p_endpoint_location
);

END */$$
DELIMITER ;

/* Procedure structure for procedure `InsertProvider` */

/*!50003 DROP PROCEDURE IF EXISTS  `InsertProvider` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertProvider`(
  IN p_npi VARCHAR(50),
  IN p_speciality VARCHAR(255),
  IN p_location VARCHAR(255),
  IN p_npi_status VARCHAR(100),
  IN p_mips_score FLOAT,
  IN p_payment FLOAT,
  IN p_medicare_status VARCHAR(100),
  IN p_risk_level VARCHAR(100),
  IN p_first_name VARCHAR(100),
  IN p_last_name VARCHAR(100),
  IN p_organization_name VARCHAR(255),
  IN p_gender VARCHAR(50),
  IN p_providerName VARCHAR(255)
)
BEGIN

INSERT INTO providers(
  npi,
  speciality,
  location,
  npi_status,
  mips_score,
  payment,
  medicare_status,
  risk_level,
  first_name,
  last_name,
  organization_name,
  gender,
  providerName
)
VALUES(
  p_npi,
  p_speciality,
  p_location,
  p_npi_status,
  p_mips_score,
  p_payment,
  p_medicare_status,
  p_risk_level,
  p_first_name,
  p_last_name,
  p_organization_name,
  p_gender,
  p_providerName
);

END */$$
DELIMITER ;

/* Procedure structure for procedure `InsertProviderCompliance` */

/*!50003 DROP PROCEDURE IF EXISTS  `InsertProviderCompliance` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertProviderCompliance`(
    IN p_provider_id INT,
    IN p_SOURCE VARCHAR(100),
    IN p_npi_type VARCHAR(50),
    IN p_reason TEXT,
    IN p_enumeration_date DATE,
    IN p_sole_proprietor BOOLEAN,
    IN p_STATUS VARCHAR(50)
)
BEGIN
    INSERT INTO provider_compliance (
        provider_id,
        SOURCE,
        npi_type,
        reason,
        enumeration_date,
        sole_proprietor,
        STATUS
    )
    VALUES (
        p_provider_id,
        p_SOURCE,
        p_npi_type,
        p_reason,
        p_enumeration_date,
        p_sole_proprietor,
        p_STATUS
    );
END */$$
DELIMITER ;

/* Procedure structure for procedure `InsertProviderIdentifier` */

/*!50003 DROP PROCEDURE IF EXISTS  `InsertProviderIdentifier` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertProviderIdentifier`(
    IN p_provider_id INT,
    IN p_npi_number VARCHAR(50),
    IN p_pac_id VARCHAR(255),
    IN p_tax_id VARCHAR(255),
    IN p_medicare_enrollment_id VARCHAR(255),
    IN p_medicaid_enrollment_id VARCHAR(255),
    IN p_value VARCHAR(255),
    IN p_issuer VARCHAR(255),
    IN p_state VARCHAR(10),
    IN p_number VARCHAR(100),
    IN p_other_issuer VARCHAR(255)
)
BEGIN
    INSERT INTO provider_identifiers (
        provider_id, npi_number, pac_id, tax_id, medicare_enrollment_id, medicaid_enrollment_id,
        value, issuer, state, number, other_issuer
    )
    VALUES (
        p_provider_id, p_npi_number, p_pac_id, p_tax_id, p_medicare_enrollment_id, p_medicaid_enrollment_id,
        p_value, p_issuer, p_state, p_number, p_other_issuer
    );
END */$$
DELIMITER ;

/* Procedure structure for procedure `InsertProviderLocation` */

/*!50003 DROP PROCEDURE IF EXISTS  `InsertProviderLocation` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertProviderLocation`(
    IN p_provider_id INT,
    IN p_type ENUM('primary','secondary','mailing'),
    IN p_name VARCHAR(255),
    IN p_address VARCHAR(255),
    IN p_city VARCHAR(100),
    IN p_state VARCHAR(50),
    IN p_zip VARCHAR(20),
    IN p_country VARCHAR(100),
    IN p_phone VARCHAR(50),
    IN p_fax VARCHAR(50),
    IN p_email VARCHAR(100)
)
BEGIN
    INSERT INTO provider_locations
    (provider_id, type, name, address, city, state, zip, country, phone, fax, email)
    VALUES
    (p_provider_id, p_type, p_name, p_address, p_city, p_state, p_zip, p_country, p_phone, p_fax, p_email);
END */$$
DELIMITER ;

/* Procedure structure for procedure `InsertProviderTaxonomy` */

/*!50003 DROP PROCEDURE IF EXISTS  `InsertProviderTaxonomy` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertProviderTaxonomy`(
    IN p_provider_id INT,
    IN p_primary_taxonomy VARCHAR(100),
    IN p_selected_taxonomy VARCHAR(255),
    IN p_state VARCHAR(100),
    IN p_license_number VARCHAR(100)
)
BEGIN
    INSERT INTO taxonomy (
        provider_id,
        primary_taxonomy,
        selected_taxonomy,
        state,
        license_number
    )
    VALUES (
        p_provider_id,
        p_primary_taxonomy,
        p_selected_taxonomy,
        p_state,
        p_license_number
    );
END */$$
DELIMITER ;

/* Procedure structure for procedure `UpdateHealthInformationExchange` */

/*!50003 DROP PROCEDURE IF EXISTS  `UpdateHealthInformationExchange` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateHealthInformationExchange`(
  IN p_id INT,
  IN p_endpoint_type VARCHAR(255),
  IN p_endpoint VARCHAR(255),
  IN p_endpoint_description VARCHAR(255),
  IN p_use_type VARCHAR(255),
  IN p_content_type VARCHAR(255),
  IN p_affiliation VARCHAR(255),
  IN p_endpoint_location VARCHAR(255)
)
BEGIN

UPDATE health_information_exchange
SET
  endpoint_type = p_endpoint_type,
  ENDPOINT = p_endpoint,
  endpoint_description = p_endpoint_description,
  use_type = p_use_type,
  content_type = p_content_type,
  affiliation = p_affiliation,
  endpoint_location = p_endpoint_location
WHERE id = p_id;

END */$$
DELIMITER ;

/* Procedure structure for procedure `UpdateProvider` */

/*!50003 DROP PROCEDURE IF EXISTS  `UpdateProvider` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateProvider`(
  IN p_id INT,
  IN p_npi VARCHAR(50),
  IN p_speciality VARCHAR(255),
  IN p_location VARCHAR(255),
  IN p_npi_status VARCHAR(100),
  IN p_mips_score FLOAT,
  IN p_payment FLOAT,
  IN p_medicare_status VARCHAR(100),
  IN p_risk_level VARCHAR(100),
  IN p_first_name VARCHAR(100),
  IN p_last_name VARCHAR(100),
  IN p_organization_name VARCHAR(255),
  IN p_gender VARCHAR(50),
  IN p_providerName VARCHAR(255)
)
BEGIN

UPDATE providers
SET
  npi = p_npi,
  speciality = p_speciality,
  location = p_location,
  npi_status = p_npi_status,
  mips_score = p_mips_score,
  payment = p_payment,
  medicare_status = p_medicare_status,
  risk_level = p_risk_level,
  first_name = p_first_name,
  last_name = p_last_name,
  organization_name = p_organization_name,
  gender = p_gender,
  providerName = p_providerName
WHERE id = p_id;

END */$$
DELIMITER ;

/* Procedure structure for procedure `UpdateProviderCompliance` */

/*!50003 DROP PROCEDURE IF EXISTS  `UpdateProviderCompliance` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateProviderCompliance`(
    IN p_id INT,
    IN p_SOURCE VARCHAR(100),
    IN p_npi_type VARCHAR(50),
    IN p_reason TEXT,
    IN p_enumeration_date DATE,
    IN p_sole_proprietor TINYINT(1),
    IN p_STATUS VARCHAR(50)
)
BEGIN
    UPDATE provider_compliance
    SET
        SOURCE = p_SOURCE,
        npi_type = p_npi_type,
        reason = p_reason,
        enumeration_date = p_enumeration_date,
        sole_proprietor = p_sole_proprietor,
        STATUS = p_STATUS
    WHERE id = p_id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `UpdateProviderLocation` */

/*!50003 DROP PROCEDURE IF EXISTS  `UpdateProviderLocation` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateProviderLocation`(
    IN p_id INT,
    IN p_type ENUM('primary','secondary','mailing'),
    IN p_name VARCHAR(255),
    IN p_address VARCHAR(255),
    IN p_city VARCHAR(100),
    IN p_state VARCHAR(50),
    IN p_zip VARCHAR(20),
    IN p_country VARCHAR(100),
    IN p_phone VARCHAR(50),
    IN p_fax VARCHAR(50),
    IN p_email VARCHAR(100)
)
BEGIN
    UPDATE provider_locations
    SET type=p_type, name=p_name, address=p_address, city=p_city,
        state=p_state, zip=p_zip, country=p_country, phone=p_phone,
        fax=p_fax, email=p_email
    WHERE id=p_id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `UpdateProviderTaxonomy` */

/*!50003 DROP PROCEDURE IF EXISTS  `UpdateProviderTaxonomy` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateProviderTaxonomy`(
    IN p_id INT,
    IN p_primary_taxonomy VARCHAR(100),
    IN p_selected_taxonomy VARCHAR(255),
    IN p_state VARCHAR(100),
    IN p_license_number VARCHAR(100)
)
BEGIN
    UPDATE taxonomy
    SET
        primary_taxonomy = p_primary_taxonomy,
        selected_taxonomy = p_selected_taxonomy,
        state = p_state,
        license_number = p_license_number
    WHERE id = p_id;
END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
