-- MySQL dump 10.15  Distrib 10.0.21-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: csvparser
-- ------------------------------------------------------
-- Server version	5.6.27

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
-- Table structure for table `csvcolumnmap`
--

DROP TABLE IF EXISTS `csvcolumnmap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `csvcolumnmap` (
  `ident` bigint(20) NOT NULL AUTO_INCREMENT,
  `CSVAttrName` varchar(100) NOT NULL,
  `TableAttrName` varchar(100) NOT NULL,
  `AttrDataType` varchar(15) DEFAULT NULL,
  `isKeyAttr` bit(1) NOT NULL DEFAULT b'0',
  `isNullable` bit(1) NOT NULL DEFAULT b'0',
  `dbDataType` varchar(45) DEFAULT NULL,
  `colIndex` int(11) DEFAULT '0',
  `def_ident` bigint(20) NOT NULL,
  PRIMARY KEY (`ident`),
  KEY `fk_MasterColumnMapper_ValidDataTypes1_idx` (`AttrDataType`),
  KEY `fk_colummMap_header_idx` (`def_ident`),
  CONSTRAINT `fk_ColumnMap_ValidDataTypes` FOREIGN KEY (`AttrDataType`) REFERENCES `validdatatypes` (`validDataTypes`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_definition_columnmap` FOREIGN KEY (`def_ident`) REFERENCES `csvdefinition` (`ident`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='numer';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csvcolumnmap`
--

LOCK TABLES `csvcolumnmap` WRITE;
/*!40000 ALTER TABLE `csvcolumnmap` DISABLE KEYS */;
/*!40000 ALTER TABLE `csvcolumnmap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `csvdefinition`
--

DROP TABLE IF EXISTS `csvdefinition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `csvdefinition` (
  `ident` bigint(11) NOT NULL AUTO_INCREMENT,
  `csvMapName` varchar(45) NOT NULL,
  `tableName` varchar(255) NOT NULL,
  `Description` text,
  `firstRowHasHeader` bit(1) NOT NULL DEFAULT b'1',
  `haltOnFirstError` bit(1) NOT NULL DEFAULT b'0',
  `useColumnMap` bit(1) NOT NULL DEFAULT b'0',
  `columnDelim` varchar(2) DEFAULT ',',
  `prefix` varchar(45) DEFAULT 'main' COMMENT 'Datasource Prefix',
  `project_url` varchar(255) DEFAULT 'csvparser',
  PRIMARY KEY (`ident`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csvdefinition`
--

LOCK TABLES `csvdefinition` WRITE;
/*!40000 ALTER TABLE `csvdefinition` DISABLE KEYS */;
/*!40000 ALTER TABLE `csvdefinition` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `csvheader`
--

DROP TABLE IF EXISTS `csvheader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `csvheader` (
  `ident` bigint(20) NOT NULL AUTO_INCREMENT,
  `csv_ident` bigint(20) NOT NULL,
  `importDate` date DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `content` longblob,
  `processCSVHeaderFlag` bit(1) NOT NULL DEFAULT b'0',
  `processCSVFlag` bit(1) NOT NULL DEFAULT b'0',
  `processTableFlag` bit(1) NOT NULL DEFAULT b'0',
  `genTableFlag` bit(1) NOT NULL DEFAULT b'0',
  `countDetailRows` int(11) DEFAULT '0',
  `loadFileContent` bit(1) DEFAULT b'0',
  `replaceOnInsert` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`ident`),
  KEY `fk_definiiton_header_idx` (`csv_ident`),
  CONSTRAINT `fk_definiiton_header` FOREIGN KEY (`csv_ident`) REFERENCES `csvdefinition` (`ident`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='				';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csvheader`
--

LOCK TABLES `csvheader` WRITE;
/*!40000 ALTER TABLE `csvheader` DISABLE KEYS */;
/*!40000 ALTER TABLE `csvheader` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `csvimporterrors`
--

DROP TABLE IF EXISTS `csvimporterrors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `csvimporterrors` (
  `ident` bigint(20) NOT NULL AUTO_INCREMENT,
  `header_ident` bigint(20) NOT NULL,
  `ErrorMessage` longtext,
  `RowContent` longtext,
  `rowIndex` int(11) DEFAULT '0',
  PRIMARY KEY (`ident`),
  KEY `fk_header_errors_idx` (`header_ident`),
  CONSTRAINT `fk_header_errors` FOREIGN KEY (`header_ident`) REFERENCES `csvheader` (`ident`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csvimporterrors`
--

LOCK TABLES `csvimporterrors` WRITE;
/*!40000 ALTER TABLE `csvimporterrors` DISABLE KEYS */;
/*!40000 ALTER TABLE `csvimporterrors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `validdatatypes`
--

DROP TABLE IF EXISTS `validdatatypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `validdatatypes` (
  `validDataTypes` varchar(15) NOT NULL,
  `regex` text,
  `evalExpression` text,
  `Comments` text,
  `dbDataType` varchar(45) DEFAULT 'VARCHAR(100)',
  PRIMARY KEY (`validDataTypes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `validdatatypes`
--

LOCK TABLES `validdatatypes` WRITE;
/*!40000 ALTER TABLE `validdatatypes` DISABLE KEYS */;
INSERT INTO `validdatatypes` VALUES ('boolean',NULL,NULL,NULL,'BIT(1)'),('custom','','return value;',NULL,'VARCHAR(100)'),('date',NULL,NULL,NULL,'DATE'),('MM-dd-YYYY','',NULL,NULL,'DATE'),('money','/[$,()]/g','(value.charAt(0) == \'(\'? -1 : 1)*parseFloat(value.replace(regex,\'\'));',NULL,'DECIMAL(12,2)'),('number','/[$,()]/g','(value.charAt(0) == \'(\'? -1 : 1)*Number(value.replace(regex,\'\'));',NULL,'BIGINT(20)'),('percent',NULL,NULL,'','DECIMAL(12,2)'),('text',NULL,NULL,'this is the default - nothing to do here ','TEXT');
/*!40000 ALTER TABLE `validdatatypes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-09 19:19:07
