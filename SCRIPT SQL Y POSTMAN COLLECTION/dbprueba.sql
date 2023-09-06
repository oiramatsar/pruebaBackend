/*
 Navicat Premium Data Transfer

 Source Server         : dbPrueba
 Source Server Type    : MySQL
 Source Server Version : 80034
 Source Host           : localhost:3306
 Source Schema         : dbprueba

 Target Server Type    : MySQL
 Target Server Version : 80034
 File Encoding         : 65001

 Date: 05/09/2023 23:03:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bodegas
-- ----------------------------
DROP TABLE IF EXISTS `bodegas`;
CREATE TABLE `bodegas`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_responsable` int(0) NULL DEFAULT NULL,
  `estado` tinyint(1) NULL DEFAULT NULL,
  `created_by` int(0) NULL DEFAULT NULL,
  `updated_by` int(0) NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL,
  `deleted_at` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `bodegas_nombre_IDX`(`nombre`) USING BTREE,
  INDEX `bodegas_ibfk_1`(`id_responsable`) USING BTREE,
  CONSTRAINT `bodegas_ibfk_1` FOREIGN KEY (`id_responsable`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of bodegas
-- ----------------------------
INSERT INTO `bodegas` VALUES (1, 'BODEGA 2', 1, 1, 1, NULL, '2023-09-05 14:39:50', NULL, NULL);
INSERT INTO `bodegas` VALUES (2, 'BODEGA 1', 1, 1, 1, NULL, '2023-09-05 14:40:32', NULL, NULL);
INSERT INTO `bodegas` VALUES (3, 'BODEGA 3', 1, 1, 1, NULL, '2023-09-05 14:45:49', NULL, NULL);
INSERT INTO `bodegas` VALUES (8, 'BODEGA 4', 1, 1, 1, NULL, '2023-09-05 22:36:29', NULL, NULL);

-- ----------------------------
-- Table structure for historiales
-- ----------------------------
DROP TABLE IF EXISTS `historiales`;
CREATE TABLE `historiales`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `cantidad` int(0) NULL DEFAULT NULL,
  `id_bodega_origen` int(0) NULL DEFAULT NULL,
  `id_bodega_destino` int(0) NULL DEFAULT NULL,
  `id_inventario` int(0) NULL DEFAULT NULL,
  `created_by` int(0) NULL DEFAULT NULL,
  `updated_by` int(0) NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL,
  `deleted_at` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_bodega_origen`(`id_bodega_origen`) USING BTREE,
  INDEX `id_bodega_destino`(`id_bodega_destino`) USING BTREE,
  INDEX `id_inventario`(`id_inventario`) USING BTREE,
  CONSTRAINT `historiales_ibfk_1` FOREIGN KEY (`id_bodega_origen`) REFERENCES `bodegas` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `historiales_ibfk_2` FOREIGN KEY (`id_bodega_destino`) REFERENCES `bodegas` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `historiales_ibfk_3` FOREIGN KEY (`id_inventario`) REFERENCES `inventarios` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of historiales
-- ----------------------------
INSERT INTO `historiales` VALUES (2, 1, 1, 2, 2, NULL, NULL, NULL, '2023-09-05 21:17:29', NULL);

-- ----------------------------
-- Table structure for inventarios
-- ----------------------------
DROP TABLE IF EXISTS `inventarios`;
CREATE TABLE `inventarios`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `id_bodega` int(0) NOT NULL,
  `id_producto` int(0) NOT NULL,
  `cantidad` int(0) NULL DEFAULT NULL,
  `created_by` int(0) NULL DEFAULT NULL,
  `updated_by` int(0) NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL,
  `deleted_at` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `id_bodega`, `id_producto`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  INDEX `inventarios_ibfk_1`(`id_bodega`) USING BTREE,
  INDEX `inventarios_ibfk_2`(`id_producto`) USING BTREE,
  CONSTRAINT `inventarios_ibfk_1` FOREIGN KEY (`id_bodega`) REFERENCES `bodegas` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `inventarios_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of inventarios
-- ----------------------------
INSERT INTO `inventarios` VALUES (1, 1, 2, 10, NULL, NULL, '2023-09-05 14:43:32', '2023-09-05 22:34:39', NULL);
INSERT INTO `inventarios` VALUES (2, 2, 1, 2, 1, NULL, '2023-09-05 14:42:30', '2023-09-05 22:29:43', NULL);
INSERT INTO `inventarios` VALUES (7, 3, 2, 11, 1, NULL, '2023-09-05 14:50:55', '2023-09-05 22:34:39', NULL);
INSERT INTO `inventarios` VALUES (13, 3, 1, 3, 1, NULL, '2023-09-05 22:33:45', NULL, NULL);
INSERT INTO `inventarios` VALUES (14, 3, 3, 1, 1, NULL, '2023-09-05 22:37:24', NULL, NULL);
INSERT INTO `inventarios` VALUES (15, 2, 2, 8, NULL, NULL, '2023-09-05 22:37:52', '2023-09-05 22:38:02', NULL);

-- ----------------------------
-- Table structure for productos
-- ----------------------------
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `descripcion` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `estado` tinyint(1) NULL DEFAULT NULL,
  `created_by` int(0) NULL DEFAULT NULL,
  `updated_by` int(0) NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL,
  `deleted_at` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `productos_nombre_IDX`(`nombre`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of productos
-- ----------------------------
INSERT INTO `productos` VALUES (1, 'CAM_L', 'CAMISETA TALLA L', 1, 1, NULL, '2023-09-05 14:42:30', NULL, NULL);
INSERT INTO `productos` VALUES (2, 'CAM_S', 'CAMISETA TALLA S', 1, 1, NULL, '2023-09-05 14:50:55', NULL, NULL);
INSERT INTO `productos` VALUES (3, 'CAM_XS', 'CAMISETA TALLA XS', 1, 1, NULL, '2023-09-05 22:37:24', NULL, NULL);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `foto` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `estado` tinyint(0) NULL DEFAULT NULL,
  `created_by` int(0) NULL DEFAULT NULL,
  `updated_by` int(0) NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL,
  `deleted_at` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'MARIO FERNANDO VIVEROS PAZ', NULL, 1, 1, NULL, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
