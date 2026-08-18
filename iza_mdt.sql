-- SQL Schema for MDT Integration with ESX

-- Create the MDT roles table (mapping job grades to permissions)
CREATE TABLE IF NOT EXISTS `mdt_roles` (
    `job_grade` int(11) NOT NULL,
    `permissions` longtext NOT NULL DEFAULT '[]',
    `is_boss` tinyint(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`job_grade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert some default roles mapping based on the previous hardcoded state
INSERT IGNORE INTO `mdt_roles` (`job_grade`, `permissions`, `is_boss`) VALUES
(0, '["view_reports", "view_interchat"]', 0),
(1, '["view_reports", "view_interchat"]', 0),
(2, '["view_reports", "view_interchat"]', 0),
(3, '["view_reports", "view_interchat"]', 0),
(4, '["view_reports", "view_interchat"]', 0),
(5, '["view_reports", "view_interchat", "manage_profiles", "manage_vehicles"]', 0),
(6, '["view_reports", "view_interchat", "manage_profiles", "manage_vehicles"]', 0),
(7, '["view_reports", "view_interchat", "manage_profiles", "manage_vehicles", "write_news", "manage_charges"]', 0),
(8, '["view_reports", "view_interchat", "manage_profiles", "manage_vehicles", "write_news", "manage_charges"]', 1),
(9, '["view_reports", "view_interchat", "manage_profiles", "manage_vehicles", "write_news", "manage_charges"]', 1),
(10, '["view_reports", "view_interchat", "manage_profiles", "manage_vehicles", "write_news", "manage_charges"]', 1);

-- Bolos Table
CREATE TABLE IF NOT EXISTS `mdt_bolos` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `details` text NOT NULL,
    `status` varchar(50) NOT NULL DEFAULT 'Active Watch',
    `timestamp` bigint(20) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- News Table
CREATE TABLE IF NOT EXISTS `mdt_news` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `content` text NOT NULL,
    `author` varchar(100) NOT NULL,
    `required_grade` int(11) NOT NULL DEFAULT 0,
    `timestamp` bigint(20) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Wanted/Warrants Table
CREATE TABLE IF NOT EXISTS `mdt_wanted` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `description` text NOT NULL,
    `priority` varchar(50) NOT NULL DEFAULT 'Medium',
    `issuer` varchar(100) NOT NULL,
    `timestamp` bigint(20) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add a column to users to track their active MDT status
-- This assumes the ESX users table exists
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `mdt_active` tinyint(1) NOT NULL DEFAULT 0;
