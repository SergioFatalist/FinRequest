-- MySQL dump 10.13  Distrib 5.5.41, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: 2019
-- ------------------------------------------------------
-- Server version	5.5.41-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `budget_per_project_allowed`
--

DROP TABLE IF EXISTS `budget_per_project_allowed`;
/*!50001 DROP VIEW IF EXISTS `budget_per_project_allowed`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `budget_per_project_allowed` (
  `target_id` tinyint NOT NULL,
  `category_id` tinyint NOT NULL,
  `planned` tinyint NOT NULL,
  `allowed` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `budget_per_project_in_progress`
--

DROP TABLE IF EXISTS `budget_per_project_in_progress`;
/*!50001 DROP VIEW IF EXISTS `budget_per_project_in_progress`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `budget_per_project_in_progress` (
  `target_id` tinyint NOT NULL,
  `category_id` tinyint NOT NULL,
  `in_progress` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `budget_per_project_used`
--

DROP TABLE IF EXISTS `budget_per_project_used`;
/*!50001 DROP VIEW IF EXISTS `budget_per_project_used`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `budget_per_project_used` (
  `target_id` tinyint NOT NULL,
  `category_id` tinyint NOT NULL,
  `used` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `budgets`
--

DROP TABLE IF EXISTS `budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budgets` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `filename` varchar(128) DEFAULT NULL,
  `month` varchar(6) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` int(1) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='Budgets table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budgets`
--

LOCK TABLES `budgets` WRITE;
/*!40000 ALTER TABLE `budgets` DISABLE KEYS */;
/*!40000 ALTER TABLE `budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budgets_data`
--

DROP TABLE IF EXISTS `budgets_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budgets_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `budget_id` int(11) unsigned DEFAULT NULL,
  `category_id` int(11) unsigned DEFAULT NULL,
  `allowed` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq` (`budget_id`,`category_id`),
  KEY `category_idx` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='Budget data table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '-1',
  `active` int(1) NOT NULL DEFAULT '0',
  `planned` int(1) NOT NULL DEFAULT '1',
  `investment` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `payment_type` int(11) NOT NULL DEFAULT '2',
  `active` int(11) NOT NULL DEFAULT '0',
  `comment` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contractors`
--

DROP TABLE IF EXISTS `contractors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contractors` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `active` int(11) NOT NULL DEFAULT '0',
  `comment` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1746 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `docs`
--

DROP TABLE IF EXISTS `docs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `docs` (
  `name` varchar(255) NOT NULL,
  `comment` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_actions`
--

DROP TABLE IF EXISTS `group_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_actions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group_id` int(10) unsigned NOT NULL DEFAULT '0',
  `action_id` int(10) unsigned NOT NULL DEFAULT '0',
  `permit` int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq` (`group_id`,`action_id`),
  KEY `actions_idx` (`action_id`)
) ENGINE=InnoDB AUTO_INCREMENT=289 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_permissions`
--

DROP TABLE IF EXISTS `group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group_id` int(10) unsigned NOT NULL DEFAULT '0',
  `module_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_id` (`group_id`,`module_id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COMMENT='Group permissions table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `sysname` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `dt` datetime DEFAULT NULL,
  `event` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modules` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `sysname` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='Modules list';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `modules_actions`
--

DROP TABLE IF EXISTS `modules_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modules_actions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `module_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `sysname` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `module_idx` (`module_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nets`
--

DROP TABLE IF EXISTS `nets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nets` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `curator_id` int(11) DEFAULT NULL,
  `chief_operating_officer_id` int(11) DEFAULT NULL,
  `active` int(1) NOT NULL DEFAULT '1',
  `projects` int(1) NOT NULL DEFAULT '0',
  `comment` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `parameters`
--

DROP TABLE IF EXISTS `parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parameters` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `sysname` varchar(45) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_change_confirmations`
--

DROP TABLE IF EXISTS `password_change_confirmations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_change_confirmations` (
  `ccode` varchar(64) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `dt` bigint(20) NOT NULL,
  `used` int(1) NOT NULL,
  UNIQUE KEY `ccode` (`ccode`,`user_id`,`dt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Таблица хранения запросов';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `points`
--

DROP TABLE IF EXISTS `points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `points` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `net_id` int(11) NOT NULL DEFAULT '0',
  `active` int(1) NOT NULL DEFAULT '1',
  `project` int(1) NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL,
  `city` varchar(64) NOT NULL,
  `address` varchar(128) NOT NULL,
  `phone` varchar(14) NOT NULL,
  `dt_created` datetime DEFAULT NULL,
  `dt_finished` datetime DEFAULT NULL,
  `finished` int(1) NOT NULL DEFAULT '0',
  `curator_id` int(11) NOT NULL DEFAULT '0',
  `project_id` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `dt_created` datetime NOT NULL,
  `company_id` int(11) NOT NULL DEFAULT '0',
  `dt_payment` datetime DEFAULT NULL,
  `order_no` varchar(16) DEFAULT NULL,
  `payment_type` int(11) NOT NULL DEFAULT '0',
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `p_l` int(11) NOT NULL DEFAULT '0',
  `category_id` int(11) NOT NULL DEFAULT '0',
  `dt_changed` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `contractor` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `author_id` int(11) NOT NULL DEFAULT '0',
  `request_type` int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `dt_created` (`dt_created`)
) ENGINE=InnoDB AUTO_INCREMENT=19753 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='Requests table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `requests_arch`
--

DROP TABLE IF EXISTS `requests_arch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requests_arch` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `dt_created` datetime NOT NULL,
  `company_id` int(11) NOT NULL,
  `net_id` int(11) NOT NULL,
  `point_id` int(11) NOT NULL,
  `point_status` int(11) NOT NULL,
  `dt_payment` datetime NOT NULL,
  `order_no` int(11) NOT NULL,
  `payment_type` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `p_l` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `contractor` varchar(128) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_no` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Archived requests table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `requests_history`
--

DROP TABLE IF EXISTS `requests_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requests_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `dt` datetime NOT NULL,
  `comment` text,
  `details` text,
  `approve_comment` text,
  `decline_comment` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=124421 DEFAULT CHARSET=utf8 COMMENT='История изменений по заявке';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `requests_points`
--

DROP TABLE IF EXISTS `requests_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requests_points` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int(11) unsigned NOT NULL DEFAULT '0',
  `point_status` int(11) unsigned NOT NULL DEFAULT '0',
  `point_id` int(11) unsigned NOT NULL DEFAULT '0',
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_id` (`request_id`,`point_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27725 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `requests_statuses`
--

DROP TABLE IF EXISTS `requests_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requests_statuses` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `sysname` varchar(45) NOT NULL,
  `complement_id` int(11) unsigned NOT NULL DEFAULT '0',
  `is_approve` int(1) unsigned DEFAULT '1',
  `ordering` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `requests_templates`
--

DROP TABLE IF EXISTS `requests_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requests_templates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `dt_created` datetime NOT NULL,
  `company_id` int(11) NOT NULL DEFAULT '0',
  `dt_payment` datetime DEFAULT NULL,
  `order_no` varchar(16) DEFAULT NULL,
  `payment_type` int(11) NOT NULL DEFAULT '0',
  `amount` decimal(14,2) NOT NULL DEFAULT '0.00',
  `p_l` int(11) NOT NULL DEFAULT '0',
  `category_id` int(11) NOT NULL DEFAULT '0',
  `dt_changed` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `contractor` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `author_id` int(11) NOT NULL DEFAULT '0',
  `request_type` int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11782 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='Request templates table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `requests_templates_points`
--

DROP TABLE IF EXISTS `requests_templates_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requests_templates_points` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int(11) unsigned NOT NULL DEFAULT '0',
  `point_status` int(11) unsigned NOT NULL DEFAULT '0',
  `point_id` int(11) unsigned NOT NULL DEFAULT '0',
  `amount` float unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_id` (`request_id`,`point_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16687 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rules`
--

DROP TABLE IF EXISTS `rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rules` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `ordering` int(10) unsigned NOT NULL DEFAULT '0',
  `active` int(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rules_actions`
--

DROP TABLE IF EXISTS `rules_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rules_actions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `condition_id` int(11) unsigned NOT NULL DEFAULT '0',
  `left_entity_id` int(11) unsigned DEFAULT NULL,
  `left_field_id` int(11) unsigned DEFAULT NULL,
  `action` enum('set','inc','dec') DEFAULT NULL,
  `right_entity_id` int(11) unsigned DEFAULT NULL,
  `right_field_id` int(11) unsigned DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL,
  `stop` int(1) unsigned DEFAULT NULL,
  `ordering` int(11) unsigned NOT NULL DEFAULT '0',
  `active` int(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `condition_idx` (`condition_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rules_conditions`
--

DROP TABLE IF EXISTS `rules_conditions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rules_conditions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `rule_id` int(11) unsigned NOT NULL DEFAULT '0',
  `left_entity_id` int(11) unsigned DEFAULT NULL,
  `left_field_id` int(11) unsigned DEFAULT NULL,
  `cond` enum('==','!=','>','<','>=','<=') DEFAULT NULL,
  `right_entity_id` int(11) unsigned DEFAULT NULL,
  `right_field_id` int(11) unsigned DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL,
  `ordering` int(11) unsigned NOT NULL DEFAULT '0',
  `active` int(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `rule_idx` (`rule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rules_entities`
--

DROP TABLE IF EXISTS `rules_entities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rules_entities` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `sysname` varchar(45) DEFAULT NULL,
  `is_left` int(1) unsigned NOT NULL DEFAULT '0',
  `is_right` int(1) unsigned NOT NULL DEFAULT '1',
  `is_actional` int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rules_fields`
--

DROP TABLE IF EXISTS `rules_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rules_fields` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `entity_id` int(11) unsigned DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `sysname` varchar(45) DEFAULT NULL,
  `mapped_to` varchar(45) NOT NULL DEFAULT '',
  `mapped_fields` varchar(90) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_actions`
--

DROP TABLE IF EXISTS `user_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_actions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL DEFAULT '0',
  `action_id` int(10) unsigned NOT NULL DEFAULT '0',
  `permit` int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq` (`user_id`,`action_id`),
  KEY `action_idx` (`action_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_categories`
--

DROP TABLE IF EXISTS `user_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned DEFAULT NULL,
  `category_id` int(11) unsigned DEFAULT NULL,
  `permit` int(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq` (`category_id`,`user_id`),
  KEY `users_idx` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16781 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_nets`
--

DROP TABLE IF EXISTS `user_nets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_nets` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned DEFAULT NULL,
  `net_id` int(11) unsigned DEFAULT NULL,
  `permit` int(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq` (`user_id`,`net_id`),
  KEY `user_idx` (`user_id`),
  KEY `net_idx` (`net_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2553 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `user_permitted_categories`
--

DROP TABLE IF EXISTS `user_permitted_categories`;
/*!50001 DROP VIEW IF EXISTS `user_permitted_categories`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `user_permitted_categories` (
  `user_id` tinyint NOT NULL,
  `id` tinyint NOT NULL,
  `name` tinyint NOT NULL,
  `parent_id` tinyint NOT NULL,
  `active` tinyint NOT NULL,
  `planned` tinyint NOT NULL,
  `investment` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `user_permitted_nets`
--

DROP TABLE IF EXISTS `user_permitted_nets`;
/*!50001 DROP VIEW IF EXISTS `user_permitted_nets`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `user_permitted_nets` (
  `user_id` tinyint NOT NULL,
  `id` tinyint NOT NULL,
  `name` tinyint NOT NULL,
  `curator_id` tinyint NOT NULL,
  `chief_operating_officer_id` tinyint NOT NULL,
  `active` tinyint NOT NULL,
  `projects` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `user_permitted_points`
--

DROP TABLE IF EXISTS `user_permitted_points`;
/*!50001 DROP VIEW IF EXISTS `user_permitted_points`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `user_permitted_points` (
  `user_id` tinyint NOT NULL,
  `id` tinyint NOT NULL,
  `net_id` tinyint NOT NULL,
  `project_id` tinyint NOT NULL,
  `active` tinyint NOT NULL,
  `project` tinyint NOT NULL,
  `name` tinyint NOT NULL,
  `city` tinyint NOT NULL,
  `address` tinyint NOT NULL,
  `phone` tinyint NOT NULL,
  `dt_created` tinyint NOT NULL,
  `dt_finished` tinyint NOT NULL,
  `finished` tinyint NOT NULL,
  `curator_id` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `user_points`
--

DROP TABLE IF EXISTS `user_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_points` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned DEFAULT NULL,
  `point_id` int(11) unsigned DEFAULT NULL,
  `permit` int(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq` (`point_id`,`user_id`),
  KEY `users_idx` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9185 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(32) NOT NULL,
  `password` varchar(64) NOT NULL,
  `email` varchar(128) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `master_id` int(11) DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT '1',
  `active` int(1) NOT NULL DEFAULT '0',
  `group_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8 COMMENT='Users table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `uslugi`
--

DROP TABLE IF EXISTS `uslugi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `uslugi` (
  `NAME` varchar(10) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `budget_per_project_allowed`
--

/*!50001 DROP TABLE IF EXISTS `budget_per_project_allowed`*/;
/*!50001 DROP VIEW IF EXISTS `budget_per_project_allowed`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `budget_per_project_allowed` AS select `budgets`.`target_id` AS `target_id`,`categories`.`id` AS `category_id`,`categories`.`planned` AS `planned`,sum(`budgets_data`.`allowed`) AS `allowed` from ((`budgets` left join `budgets_data` on((`budgets`.`id` = `budgets_data`.`budget_id`))) left join `categories` on((`budgets_data`.`category_id` = `categories`.`id`))) where (`budgets`.`type` = 1) group by `categories`.`id`,`budgets`.`target_id`,`categories`.`planned` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `budget_per_project_in_progress`
--

/*!50001 DROP TABLE IF EXISTS `budget_per_project_in_progress`*/;
/*!50001 DROP VIEW IF EXISTS `budget_per_project_in_progress`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `budget_per_project_in_progress` AS select `points`.`id` AS `target_id`,`categories`.`id` AS `category_id`,round(sum(`requests_points`.`amount`),2) AS `in_progress` from (((`requests` join `requests_points`) join `points`) join `categories`) where ((`requests_points`.`request_id` = `requests`.`id`) and (`requests_points`.`point_id` = `points`.`id`) and (`points`.`project` = 1) and (`requests`.`category_id` = `categories`.`id`) and (`requests`.`status` <> 10)) group by `categories`.`id`,`points`.`id`,`categories`.`planned` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `budget_per_project_used`
--

/*!50001 DROP TABLE IF EXISTS `budget_per_project_used`*/;
/*!50001 DROP VIEW IF EXISTS `budget_per_project_used`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `budget_per_project_used` AS select `points`.`id` AS `target_id`,`categories`.`id` AS `category_id`,round(sum(`requests_points`.`amount`),2) AS `used` from (((`requests` join `requests_points`) join `points`) join `categories`) where ((`requests_points`.`request_id` = `requests`.`id`) and (`requests_points`.`point_id` = `points`.`id`) and (`points`.`project` = 1) and (`requests`.`category_id` = `categories`.`id`) and (`requests`.`status` = 10)) group by `categories`.`id`,`points`.`id`,`categories`.`planned` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `user_permitted_categories`
--

/*!50001 DROP TABLE IF EXISTS `user_permitted_categories`*/;
/*!50001 DROP VIEW IF EXISTS `user_permitted_categories`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `user_permitted_categories` AS select `uc`.`user_id` AS `user_id`,`c`.`id` AS `id`,`c`.`name` AS `name`,`c`.`parent_id` AS `parent_id`,`c`.`active` AS `active`,`c`.`planned` AS `planned`,`c`.`investment` AS `investment` from (`categories` `c` join `user_categories` `uc`) where ((`c`.`id` = `uc`.`category_id`) and (`c`.`active` = 1) and (`uc`.`permit` = 1)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `user_permitted_nets`
--

/*!50001 DROP TABLE IF EXISTS `user_permitted_nets`*/;
/*!50001 DROP VIEW IF EXISTS `user_permitted_nets`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `user_permitted_nets` AS select `un`.`user_id` AS `user_id`,`n`.`id` AS `id`,`n`.`name` AS `name`,`n`.`curator_id` AS `curator_id`,`n`.`chief_operating_officer_id` AS `chief_operating_officer_id`,`n`.`active` AS `active`,`n`.`projects` AS `projects` from (`nets` `n` join `user_nets` `un`) where ((`n`.`id` = `un`.`net_id`) and (`n`.`active` = 1) and (`un`.`permit` = 1)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `user_permitted_points`
--

/*!50001 DROP TABLE IF EXISTS `user_permitted_points`*/;
/*!50001 DROP VIEW IF EXISTS `user_permitted_points`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `user_permitted_points` AS select `up`.`user_id` AS `user_id`,`up`.`point_id` AS `id`,`un`.`net_id` AS `net_id`,`p`.`project_id` AS `project_id`,`p`.`active` AS `active`,`p`.`project` AS `project`,`p`.`name` AS `name`,`p`.`city` AS `city`,`p`.`address` AS `address`,`p`.`phone` AS `phone`,`p`.`dt_created` AS `dt_created`,`p`.`dt_finished` AS `dt_finished`,`p`.`finished` AS `finished`,`p`.`curator_id` AS `curator_id` from ((`points` `p` join `user_points` `up`) join `user_nets` `un`) where ((`up`.`user_id` = `un`.`user_id`) and (`up`.`point_id` = `p`.`id`) and (`un`.`net_id` = `p`.`net_id`) and (`un`.`permit` = 1) and (`up`.`permit` = 1)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

