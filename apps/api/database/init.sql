-- Initial database setup for Gas Mobil
CREATE DATABASE IF NOT EXISTS gas_mobil;
USE gas_mobil;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `phoneNumber` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255),
  `city` varchar(255),
  `latitude` double,
  `longitude` double,
  `role` enum('customer','delivery','admin') NOT NULL DEFAULT 'customer',
  `isActive` tinyint NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `size` varchar(255) NOT NULL,
  `imageUrl` varchar(255),
  `stock` int NOT NULL DEFAULT 0,
  `isAvailable` tinyint NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `status` enum('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `totalAmount` decimal(10,2) NOT NULL,
  `deliveryAddress` varchar(255),
  `deliveryCity` varchar(255),
  `deliveryLatitude` double,
  `deliveryLongitude` double,
  `paymentMethod` varchar(255),
  `stripePaymentIntentId` varchar(255),
  `notes` longtext,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` varchar(36) NOT NULL,
  `orderId` varchar(36) NOT NULL,
  `productId` varchar(36) NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
  KEY `idx_orderId` (`orderId`),
  KEY `idx_productId` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Deliveries table
CREATE TABLE IF NOT EXISTS `deliveries` (
  `id` varchar(36) NOT NULL,
  `orderId` varchar(36) NOT NULL,
  `driverId` varchar(36),
  `status` enum('pending','assigned','in_transit','delivered','failed') NOT NULL DEFAULT 'pending',
  `currentLatitude` double,
  `currentLongitude` double,
  `estimatedDeliveryTime` datetime,
  `actualDeliveryTime` datetime,
  `proof` varchar(255),
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`driverId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  KEY `idx_orderId` (`orderId`),
  KEY `idx_driverId` (`driverId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Products Data
INSERT INTO `products` (`id`, `name`, `description`, `price`, `size`, `stock`, `isAvailable`) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Standard Gas Cylinder', 'Standard gas cylinder for household use', 45.00, '6kg', 50, 1),
('550e8400-e29b-41d4-a716-446655440002', 'Large Gas Cylinder', 'Large gas cylinder for commercial use', 65.00, '12kg', 40, 1),
('550e8400-e29b-41d4-a716-446655440003', 'Extra Large Cylinder', 'Extra large gas cylinder for industrial use', 85.00, '14kg', 30, 1),
('550e8400-e29b-41d4-a716-446655440004', 'Industrial Gas Cylinder', 'Industrial grade gas cylinder', 120.00, '50kg', 20, 1);
