/*
 Navicat Premium Data Transfer

 Source Server         : DBMS
 Source Server Type    : MySQL
 Source Server Version : 80012
 Source Host           : localhost:3306
 Source Schema         : project

 Target Server Type    : MySQL
 Target Server Version : 80012
 File Encoding         : 65001

 Date: 04/12/2018 14:54:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account
-- ----------------------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account`  (
  `AccountId` int(11) NOT NULL AUTO_INCREMENT,
  `SSN` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `InitiatedTime` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `Balance` decimal(10, 2) NULL DEFAULT 0.00,
  `PendingBalance` decimal(10, 2) NULL DEFAULT 0.00,
  `PlanId` int(11) NULL DEFAULT NULL,
  `ToBankRollingLimit` decimal(10, 2) NULL DEFAULT 0.00,
  `paymentRollingLimit` decimal(10, 2) NULL DEFAULT 0.00,
  PRIMARY KEY (`AccountId`) USING BTREE,
  INDEX `PlanId`(`PlanId`) USING BTREE,
  CONSTRAINT `account_ibfk_1` FOREIGN KEY (`PlanId`) REFERENCES `plan` (`planid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for bank
-- ----------------------------
DROP TABLE IF EXISTS `bank`;
CREATE TABLE `bank`  (
  `AccountId` int(11) NOT NULL,
  `BankId` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `AccountNumber` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `verified` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'N',
  `IsPrimary` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'N',
  PRIMARY KEY (`AccountId`, `BankId`, `AccountNumber`) USING BTREE,
  CONSTRAINT `bank_ibfk_1` FOREIGN KEY (`AccountId`) REFERENCES `account` (`accountid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for email
-- ----------------------------
DROP TABLE IF EXISTS `email`;
CREATE TABLE `email`  (
  `Token` int(11) NOT NULL,
  `EmailAddress` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Token`) USING BTREE,
  CONSTRAINT `email_ibfk_1` FOREIGN KEY (`Token`) REFERENCES `token` (`tokenid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for phone
-- ----------------------------
DROP TABLE IF EXISTS `phone`;
CREATE TABLE `phone`  (
  `Token` int(11) NOT NULL,
  `PhoneNo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Token`) USING BTREE,
  CONSTRAINT `phone_ibfk_1` FOREIGN KEY (`Token`) REFERENCES `token` (`tokenid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for plan
-- ----------------------------
DROP TABLE IF EXISTS `plan`;
CREATE TABLE `plan`  (
  `PlanId` int(11) NOT NULL AUTO_INCREMENT,
  `BalanceToBankWeekLimit` decimal(10, 2) NOT NULL,
  `SingleToBankLimit` decimal(10, 2) NOT NULL,
  PRIMARY KEY (`PlanId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of plan
-- ----------------------------
INSERT INTO `plan` VALUES (1, 999.99, 2999.99);
INSERT INTO `plan` VALUES (2, 19999.99, 49999.99);

-- ----------------------------
-- Table structure for request_transactionofaccount_from
-- ----------------------------
DROP TABLE IF EXISTS `request_transactionofaccount_from`;
CREATE TABLE `request_transactionofaccount_from`  (
  `TransactionId` int(11) NOT NULL,
  `FromToken` int(11) NOT NULL,
  `Amount` decimal(10, 2) NOT NULL,
  `TStatus` enum('started','canceled','finished') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'started',
  PRIMARY KEY (`TransactionId`, `FromToken`) USING BTREE,
  INDEX `FromToken`(`FromToken`) USING BTREE,
  CONSTRAINT `request_transactionofaccount_from_ibfk_1` FOREIGN KEY (`TransactionId`) REFERENCES `transactionofaccount` (`transactionid`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `request_transactionofaccount_from_ibfk_2` FOREIGN KEY (`FromToken`) REFERENCES `token` (`tokenid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for send_transactionofaccount
-- ----------------------------
DROP TABLE IF EXISTS `send_transactionofaccount`;
CREATE TABLE `send_transactionofaccount`  (
  `TransactionId` int(11) NOT NULL,
  `TStatus` enum('pending','canceled','finished') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'pending',
  `TargetToken` int(11) NOT NULL,
  PRIMARY KEY (`TransactionId`) USING BTREE,
  INDEX `TargetToken`(`TargetToken`) USING BTREE,
  CONSTRAINT `send_transactionofaccount_ibfk_1` FOREIGN KEY (`TransactionId`) REFERENCES `transactionofaccount` (`transactionid`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `send_transactionofaccount_ibfk_2` FOREIGN KEY (`TargetToken`) REFERENCES `token` (`tokenid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for token
-- ----------------------------
DROP TABLE IF EXISTS `token`;
CREATE TABLE `token`  (
  `TokenId` int(11) NOT NULL AUTO_INCREMENT,
  `Status` enum('verified','abandoned') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'verified',
  `AccountId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`TokenId`) USING BTREE,
  INDEX `AccountId`(`AccountId`) USING BTREE,
  CONSTRAINT `token_ibfk_1` FOREIGN KEY (`AccountId`) REFERENCES `account` (`accountid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for transactionofaccount
-- ----------------------------
DROP TABLE IF EXISTS `transactionofaccount`;
CREATE TABLE `transactionofaccount`  (
  `TransactionId` int(11) NOT NULL AUTO_INCREMENT,
  `CreateAccountId` int(11) NOT NULL,
  `Memo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `Amount` decimal(10, 2) NOT NULL,
  `InitiatedTime` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `LastUpatedTime` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`TransactionId`) USING BTREE,
  INDEX `CreateAccountId`(`CreateAccountId`) USING BTREE,
  CONSTRAINT `transactionofaccount_ibfk_1` FOREIGN KEY (`CreateAccountId`) REFERENCES `account` (`accountid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for transactionofbank
-- ----------------------------
DROP TABLE IF EXISTS `transactionofbank`;
CREATE TABLE `transactionofbank`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `AccountId` int(11) NOT NULL,
  `BankId` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `AccountNumber` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Amount` decimal(10, 2) NOT NULL,
  `Type` enum('T','F') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'T',
  `InitiatedTime` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `AccountId`(`AccountId`) USING BTREE,
  CONSTRAINT `transactionofbank_ibfk_1` FOREIGN KEY (`AccountId`) REFERENCES `account` (`accountid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Function structure for addBankCard
-- ----------------------------
DROP FUNCTION IF EXISTS `addBankCard`;
delimiter ;;
CREATE FUNCTION `addBankCard`(`acntid` integer,`bkid` char(15),`acntnum` char(15))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare val integer;
	SELECT AccountId into val FROM bank WHERE BankId=bkid and AccountNumber=acntnum and AccountId=acntid;
	if val is not null then
	return 1;
	end if;
	INSERT INTO bank(AccountId, BankId, AccountNumber) VALUES(acntid, bkid, acntnum);
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for addEmail
-- ----------------------------
DROP FUNCTION IF EXISTS `addEmail`;
delimiter ;;
CREATE FUNCTION `addEmail`(`acntid` integer,`eml` varchar(50))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare _token integer;
	declare _accountid integer;
	declare bln DECIMAL(10,2);
	declare pbln decimal (10,2);
	
	SELECT t.TokenId,t.AccountId into _token,_accountid FROM email as e,account as a, token as t where e.EmailAddress=eml and t.TokenId=e.Token and t.`Status` <>'abandoned';
	if _token is not null and _accountid is null  then
		select SUM(t.Amount) into pbln from send_transactionofaccount as s, transactionofaccount as t where t.TransactionId=s.TransactionId and s.TargetToken=_token and s.TStatus='pending' and  TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())<600;
		select SUM(t.Amount) into bln from send_transactionofaccount as s, transactionofaccount as t where t.TransactionId=s.TransactionId and s.TargetToken=_token and s.TStatus='pending'and  TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())>600;
		UPDATE account as a set a.Balance=a.Balance+bln,a.PendingBalance=a.PendingBalance+pbln where a.AccountId=acntid;
		UPDATE token as t set t.AccountId=acntid where t.TokenId=_token;
		UPDATE send_transactionofaccount as s set s.TStatus='finished' where s.TargetToken=_token and s.TStatus='pending' and EXISTS(select*from transactionofaccount as t where s.TransactionId=t.TransactionId and TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())>600);
	elseif _token is not null and _accountid <> acntid then
		return 1; # email have use by others
	elseif _token is not null and _accountid = acntid then 
		return 2; # user already have this email
	else
		set _token=null;
		SELECT t.TokenId into _token FROM email as e,account as a, token as t where t.AccountId=acntid and e.EmailAddress=eml and t.TokenId=e.Token and t.`Status` ='abandoned';
		if _token is not NULL then
			UPDATE token set `Status`= 'verified';
		else 
			INSERT INTO token(AccountId) VALUES (acntid);
			INSERT INTO email(Token,EmailAddress) VALUES(@@IDENTITY,eml);
		end if;
		
	end if;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for addPhone
-- ----------------------------
DROP FUNCTION IF EXISTS `addPhone`;
delimiter ;;
CREATE FUNCTION `addPhone`(`acntid` integer,`phone` varchar(50))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare _token integer;
	declare _accountid integer;
	declare bln DECIMAL(10,2);
	declare pbln decimal (10,2);
	SELECT t.TokenId,t.AccountId into _token,_accountid FROM phone as p,account as a, token as t where p.PhoneNo=phone and t.TokenId=p.Token and t.`Status` <>'abandoned';
	if _token is not null and _accountid is null  then
		select SUM(t.Amount) into pbln from send_transactionofaccount as s, transactionofaccount as t where t.TransactionId=s.TransactionId and s.TargetToken=_token and s.TStatus='pending' and  TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())<600;
		select SUM(t.Amount) into bln from send_transactionofaccount as s, transactionofaccount as t where t.TransactionId=s.TransactionId and s.TargetToken=_token and s.TStatus='pending'and  TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())>600;
		UPDATE account as a set a.Balance=a.Balance+bln,a.PendingBalance=a.PendingBalance+pbln where a.AccountId=acntid;
		UPDATE token as t set t.AccountId=acntid where t.TokenId=_token;
		UPDATE send_transactionofaccount as s set s.TStatus='finished' where s.TargetToken=_token and s.TStatus='pending' and EXISTS(select*from transactionofaccount as t where s.TransactionId=t.TransactionId and TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())>600);
	elseif _token is not null and _accountid <> acntid then
		return 1; # phone have use by others
	elseif _token is not null and _accountid = acntid then 
		return 2; # user already have this phone
	else
		set _token=null;
		SELECT t.TokenId into _token FROM phone as p,account as a, token as t where t.AccountId=acntid  and p.PhoneNo=phone and t.TokenId=p.Token and t.`Status` ='abandoned';
		if _token is not NULL then
			UPDATE token set `Status`= 'verified';
		else 
			INSERT INTO token(AccountId) VALUES (acntid);
			INSERT INTO phone(Token,PhoneNo) VALUES(@@IDENTITY,phone);
		end if;
		
	end if;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for cancelSendTransaction
-- ----------------------------
DROP FUNCTION IF EXISTS `cancelSendTransaction`;
delimiter ;;
CREATE FUNCTION `cancelSendTransaction`(`acntid` integer,`trnsctid` integer)
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare val integer;
	declare amt DECIMAL(10,2);
	set val=null;
	SELECT t.TransactionId into val FROM send_transactionofaccount as s,transactionofaccount as t where t.TransactionId=trnsctid and s.TransactionId=t.TransactionId and t.CreateAccountId=acntid and s.TStatus='pending' and (TIMESTAMPDIFF(Second, t.InitiatedTime, NOW())<600);
	if val is null then
		return 1;
	end if;
	update send_transactionofaccount set TStatus='canceled' WHERE TransactionId=trnsctid;
	select Amount into amt from transactionofaccount as ta where ta.TransactionId=trnsctid;
	UPDATE account as a set a.Balance=(a.Balance+amt),a.paymentRollingLimit=(a.paymentRollingLimit+amt) where a.AccountId=acntid;
	
	UPDATE account as a set a.PendingBalance=a.PendingBalance-(select Amount from transactionofaccount as ta where ta.TransactionId=trnsctid) where a.AccountId=(select t.AccountId FROM send_transactionofaccount as s, token as t where s.TransactionId=trnsctid and s.TargetToken=t.TokenId);
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for checkpaymentLimite
-- ----------------------------
DROP FUNCTION IF EXISTS `checkpaymentLimite`;
delimiter ;;
CREATE FUNCTION `checkpaymentLimite`(`acntid` integer,`amt` decimal(10,2))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare val DECIMAL(10,2);
	select a.paymentRollingLimit into val from account as a where a.AccountId=acntid;
	if val < amt then
		return 1;
	end if;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for checkSingleLimit
-- ----------------------------
DROP FUNCTION IF EXISTS `checkSingleLimit`;
delimiter ;;
CREATE FUNCTION `checkSingleLimit`(acntid INTEGER,Amount decimal(10,2))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare Slimit decimal(10,2);
	select SingleToBankLimit into Slimit from account as a, plan as p
		where a.AccountId=acntid and a.PlanId=p.PlanId;
	if amount > Slimit then
		return 1;
	end if;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for checkWeekLimit
-- ----------------------------
DROP FUNCTION IF EXISTS `checkWeekLimit`;
delimiter ;;
CREATE FUNCTION `checkWeekLimit`(`acntid` integer,`amt` decimal(10,2))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare Wlimit decimal(10,2);
	declare WeekAmount decimal(10,2);
	select ToBankRollingLimit into Wlimit from account where AccountId=acntid;
	if amt>Wlimit then 
		return 1;
	end if;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for createRequestTransaction
-- ----------------------------
DROP FUNCTION IF EXISTS `createRequestTransaction`;
delimiter ;;
CREATE FUNCTION `createRequestTransaction`(`acnid` integer,`payors` json,`mm` longtext)
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare payor json;
	declare payorname varchar(50);
	declare payoramount decimal(10,2);
	declare totalamount decimal(10,2) DEFAULT 0.0;
	declare payornametype TINYINT(1);
	declare payortoken INTEGER;
	declare trsctnid integer;
	DECLARE i INT DEFAULT 0;
	declare targetAccountId INTEGER;
	declare totalpayor INTEGER DEFAULT 0;
	declare erropayoer INTEGER DEFAULT 0;
	if JSON_LENGTH(payors)=0 then
		return 1;#amount of payors is 0
	end if;
	INSERT INTO transactionofaccount(CreateAccountId,Amount,Memo) VALUES(acnid,0,mm);
	set trsctnid=@@IDENTITY;
	set totalpayor=JSON_LENGTH(payors);
	WHILE i < JSON_LENGTH(payors) DO
    SELECT JSON_EXTRACT(payors,CONCAT('$[',i,']')) INTO payor;
    SELECT JSON_EXTRACT(payor,'$.username') into payorname;
		SET payorname = REPLACE(payorname,'"','');
		SELECT JSON_EXTRACT(payor,'$.amount') into payoramount;
		SELECT JSON_EXTRACT(payor,'$.type') into payornametype;
		set totalamount=totalamount+payoramount;
		set payortoken=null;
		if payornametype=1 then #name is email
			SELECT e.Token into payortoken from email as e,token as t where e.EmailAddress=payorname and t.TokenId=e.token and t.`Status` <>'abandoned';
			if payortoken is null then
				INSERT INTO token()VALUES();
				set payortoken=@@IDENTITY;
				INSERT INTO email(Token,EmailAddress)VALUES(payortoken,payorname);
			end if;
		else #name is phone
			SELECT p.Token into payortoken from phone as p where p.PhoneNo=payorname;
			if payortoken is null then
				INSERT INTO token()VALUES();
				set payortoken=@@IDENTITY;
				INSERT INTO phone(Token,PhoneNo)VALUES(payortoken,payorname);
			end if;
		end if;
		set targetAccountId=null;
		select AccountId into targetAccountId from token where TokenId = payortoken;
		if targetAccountId = acnid then
			set erropayoer=erropayoer+1;
		else
			INSERT into request_transactionofaccount_from(TransactionId,FromToken,Amount) VALUES(trsctnid,payortoken,payoramount);
		end if;
    set i=i+1;
	END WHILE;
	if erropayoer=totalpayor then
		delete from transactionofaccount WHERE TransactionId=trsctnid;
		return 2;
	end if;
	update transactionofaccount set Amount=totalamount where TransactionId=trsctnid;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for createSendTransaction
-- ----------------------------
DROP FUNCTION IF EXISTS `createSendTransaction`;
delimiter ;;
CREATE FUNCTION `createSendTransaction`(`acntid` integer,`target` varchar(50),`tp` tinyint(1),`amt` DECIMAL(10,2),`mm` LONGTEXT)
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare _token INTEGER DEFAULT null;
	declare haspbc TINYINT(1);
	declare bl DECIMAL(10,2);
	declare bkid char(15) DEFAULT null;
	declare accntnum char(15) DEFAULT NULL;
	declare overlimite int(11) DEFAULT 0;
	declare targetAccoundId INTEGER;
	select checkpaymentLimite(acntid,amt) into overlimite;
	if amt=0 then
		return 2; #Amount can not be 0
	end if;
	if overlimite <> 0 then
		return 3;#over paymentlimit
	end if;
	select Balance into bl from account where AccountId=acntid;
	select BankId,AccountNumber into bkid,accntnum from bank where AccountId=acntid and IsPrimary='Y' and verified='Y';
	if bkid is null and (bl-amt)<0 then
		return 1;#balance is not enough and user do not have primary bank card
	end if;
	if tp=1 then
		select e.Token into _token from token as t,email as e where t.TokenId=e.Token and e.EmailAddress=target and t.`Status` <>'abandoned';
	else
		select p.Token into _token from token as t,phone as p where t.TokenId=p.Token and p.PhoneNo=target and t.`Status` <>'abandoned';
	end if;
	if _token is null then
		INSERT INTO token VALUES();
		if tp=1 then
			INSERT INTO email(Token,EmailAddress) VALUES(@@IDENTITY,target);
		else
			INSERT INTO phone(Token,PhoneNo) VALUES(@@IDENTITY,target);
		end if;
		set _token=@@IDENTITY;
		INSERT INTO transactionofaccount(CreateAccountId,Memo,Amount) VALUES(acntid,mm,amt);
		INSERT INTO send_transactionofaccount(TransactionId,TargetToken)VALUES(@@IDENTITY,_token);
	else
		select AccountId into targetAccoundId from token where TokenId=_token;
		if targetAccoundId=acntid then
			return 4;
		end if;
		INSERT INTO transactionofaccount(CreateAccountId,Memo,Amount) VALUES(acntid,mm,amt);
		INSERT INTO send_transactionofaccount(TransactionId,TargetToken)VALUES(@@IDENTITY,_token);
		UPDATE account as a set a.PendingBalance=a.PendingBalance+amt where a.AccountId=(select t.AccountId from token as t where t.TokenId=_token);
	end if;
	if (bl-amt)<0 then
		INSERT INTO transactionofbank(AccountId,BankId,AccountNumber,Type,Amount) VALUES(acntid,bkid,accntnum,'F',amt);
		UPDATE account as a set a.paymentRollingLimit=a.paymentRollingLimit-amt where a.AccountId=acntid;
	else
		UPDATE account as a set a.Balance=a.Balance-amt,a.paymentRollingLimit=a.paymentRollingLimit-amt where a.AccountId=acntid;
	end if;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for createUserWithEmail
-- ----------------------------
DROP FUNCTION IF EXISTS `createUserWithEmail`;
delimiter ;;
CREATE FUNCTION `createUserWithEmail`(`name` varchar(50),`e_mail` varchar(50),`password` varchar(50))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare tokenExist TINYINT(1);
	declare accountExist TINYINT(1);
	declare tokenid integer;
	declare bln DECIMAL(10,2);
	declare pbln decimal (10,2);
	select IF(t.AccountId is null,false,true) into accountExist from token as t,email as e where t.TokenId=e.Token and e.EmailAddress=`e_mail` and  t.`Status` <> 'abandoned' ;
	select IF(t.TokenId is NULL,false,true) into tokenExist from token as t,email as e where t.TokenId=e.Token and e.EmailAddress=`e_mail` and t.`Status` <> 'abandoned';
	if tokenExist=true and accountExist=true then
		return 1;# email has been register
	elseif tokenExist=true and accountExist=false then
		select t.TokenId into tokenid from token as t,email as e where t.TokenId=e.Token and e.EmailAddress=`e_mail` and t.`Status` <> 'abandoned';
		select SUM(t.Amount) into pbln from send_transactionofaccount as s, transactionofaccount as t where t.TransactionId=s.TransactionId and s.TargetToken=tokenid and s.TStatus='pending' and  TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())<600;
		select SUM(t.Amount) into bln from send_transactionofaccount as s, transactionofaccount as t where t.TransactionId=s.TransactionId and s.TargetToken=tokenid and s.TStatus='pending'and  TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())>600;
		INSERT INTO account(`Name`,`Password`,Balance,PendingBalance,PlanId,ToBankRollingLimit,paymentRollingLimit)VALUES(`name`,`password`,IFNULL(bln,0),IFNULL(pbln,0),1,(select BalanceToBankWeekLimit from plan where PlanId=1),299.99);
		UPDATE token as t set t.AccountId=@@IDENTITY,`Status`='verified' where t.TokenId=tokenid;
		UPDATE send_transactionofaccount as s set s.TStatus='finished' where s.TargetToken=tokenid and s.TStatus='pending' and EXISTS(select*from transactionofaccount as t where s.TransactionId=t.TransactionId and TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())>600);
		return 0; #email has not been register but in the token
	else
		INSERT INTO account(`Name`,`Password`,PlanId,ToBankRollingLimit,paymentRollingLimit)VALUES(`name`,`password`,1,(select BalanceToBankWeekLimit from plan where PlanId=1),299.99);
		INSERT INTO token(AccountId,`Status`)VALUES(@@IDENTITY,'verified');
		INSERT INTO email(Token,EmailAddress)VALUES(@@IDENTITY,`e_mail`);
		return 0; #email not in the database
	end if;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for createUserWithPhone
-- ----------------------------
DROP FUNCTION IF EXISTS `createUserWithPhone`;
delimiter ;;
CREATE FUNCTION `createUserWithPhone`(`username` varchar(50),`phone` varchar(50),`password` varchar(50))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare tokenExist TINYINT(1);
	declare accountExist TINYINT(1);
	declare tokenid integer;
	declare bln DECIMAL(10,2);
	declare pbln decimal (10,2);
	select IF(t.AccountId is null,false,true) into accountExist from token as t,phone as p where t.TokenId=p.Token and p.PhoneNo=`phone` and  t.`Status` <> 'abandoned' ;
	select IF(t.TokenId is NULL,false,true) into tokenExist from token as t,phone as p where t.TokenId=p.Token and p.PhoneNo=`phone` and t.`Status` <> 'abandoned';
	if tokenExist=true and accountExist=true then
	return 1;# phone has been register
	elseif tokenExist=true and accountExist=false then
	select t.TokenId into tokenid from token as t,phone as p where t.TokenId=p.Token and p.PhoneNo=`e_mail` and t.`Status` <> 'abandoned';
	select SUM(t.Amount) into pbln from send_transactionofaccount as s, transactionofaccount as t where t.TransactionId=s.TransactionId and s.TargetToken=tokenid and s.TStatus='pending' and  TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())<600;
	select SUM(t.Amount) into bln from send_transactionofaccount as s, transactionofaccount as t where t.TransactionId=s.TransactionId and s.TargetToken=tokenid and s.TStatus='pending'and  TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())>600;
	INSERT INTO account(`Name`,`Password`,Balance,PendingBalance,PlanId,ToBankRollingLimit,paymentRollingLimit)VALUES(`name`,`password`,IFNULL(bln,0),IFNULL(pbln,0),1,(select BalanceToBankWeekLimit from plan where PlanId=1),299.99);
	UPDATE token as t set t.AccountId=@@IDENTITY,`Status`='verified' where t.TokenId=tokenid;
	UPDATE send_transactionofaccount as s set s.TStatus='finished' where s.TargetToken=tokenid and s.TStatus='pending' and EXISTS(select*from transactionofaccount as t where s.TransactionId=t.TransactionId and TIMESTAMPDIFF(SECOND,t.InitiatedTime,NOW())>600);
	return 0; #phone has not been register but in the token
	else
	INSERT INTO account(`Name`,`Password`,PlanId,ToBankRollingLimit,paymentRollingLimit)VALUES(`name`,`password`,1,(select BalanceToBankWeekLimit from plan where PlanId=1),299.99);
	INSERT INTO token(AccountId,`Status`)VALUES(@@IDENTITY,'verified');
	INSERT INTO phone(Token,PhoneNo)VALUES(@@IDENTITY,`phone`);
	return 0; #phone not in the database
	end if;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for paytransactionRequest
-- ----------------------------
DROP FUNCTION IF EXISTS `paytransactionRequest`;
delimiter ;;
CREATE FUNCTION `paytransactionRequest`(`acntid` integer,`trsctid` integer)
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	#Routine body goes here...
	declare bl DECIMAL(10,2);
	DECLARE amt DECIMAL(10,2) DEFAULT null;
	declare bkid char(15) DEFAULT null;
	declare accntnum char(15) DEFAULT NULL;
	declare _token integer;
	declare overlimite int(11) DEFAULT 0;
	select r.Amount,r.FromToken into amt,_token from request_transactionofaccount_from as r, token as t where t.AccountId=acntid and t.TokenId=r.FromToken and r.TransactionId=trsctid and r.TStatus='started';
	if amt is null then
		return 3;
	end if;
	select checkpaymentLimite(acntid,amt) into overlimite;
	if overlimite <> 0 then
		return 2;#over paymentlimit
	end if;
	select Balance into bl from account where AccountId=acntid;
	select BankId,AccountNumber into bkid,accntnum from bank where AccountId=acntid and IsPrimary='Y' and verified='Y';
	if bkid is null and (bl-amt)<0 then
		return 1;#balance is not enough and user do not have primary bank card
	end if;
	update request_transactionofaccount_from set TStatus='finished' where TransactionId=trsctid and FromToken=_token;
	UPDATE account SET Balance=Balance+amt where AccountId in (select CreateAccountId from transactionofaccount where TransactionId=trsctid);
	if (bl-amt)<0 then
		INSERT INTO transactionofbank(AccountId,BankId,AccountNumber,Type,Amount) VALUES(acntid,bkid,accntnum,'F',amt);
		UPDATE account set paymentRollingLimit=paymentRollingLimit-amt where AccountId=acntid;
	else
		UPDATE account set Balance=Balance-amt,paymentRollingLimit=paymentRollingLimit-amt where AccountId=acntid;
	end if;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for removeBankCard
-- ----------------------------
DROP FUNCTION IF EXISTS `removeBankCard`;
delimiter ;;
CREATE FUNCTION `removeBankCard`(`acnId` integer,`bkId` char(15),`acntNmb` char(15))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare primarytag CHAR(1);
	declare npbkId char(15);
	declare npacntNum char(15);
	declare cardexist TINYINT(1);
	select IF(count(*)>0,true,false) into cardexist from bank as b where b.AccountId=acnId and b.BankId=bkId and b.AccountNumber=acntNmb;
	if cardexist=false then
	return 1;#user do not have this bank card
	end if;
	SELECT IsPrimary into primarytag from bank as b where b.AccountId=acnId and b.BankId=bkId and b.AccountNumber=acntNmb;
	select BankId,AccountNumber into npbkId,npacntNum from bank where AccountId=acnId and verified='Y' order by BankId asc limit 1;
	if primarytag='Y' and npbkId is not null and npacntNum is not null then
	update bank as b set b.IsPrimary='Y' where b.AccountId=acnId and b.BankId=npbkId and b.AccountNumber=npacntNum;
	end if;
	delete from bank where AccountId=acnId and BankId=bkId and AccountNumber=acntNmb;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for removeEmail
-- ----------------------------
DROP FUNCTION IF EXISTS `removeEmail`;
delimiter ;;
CREATE FUNCTION `removeEmail`(`acnid` integer,`eml` varchar(50))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare _tokenid integer;
	declare amountofeml integer;
	declare amountofphone integer;
	select t.TokenId into _tokenid from email as e,token as t where e.EmailAddress=eml and e.Token=t.TokenId and t.AccountId=acnid and t.`Status` <>'abandoned';
	if _tokenid is null then
		return 2;# user do not have this email
	end if;
	select count(*) into amountofphone from phone as p,token as t where p.Token=t.TokenId and t.AccountId=acnid and t.`Status` ='verified';
	select count(*) into amountofeml from email as e,token as t where e.Token=t.TokenId and t.AccountId=acnid and t.`Status` ='verified';
	if (amountofphone+amountofeml)<2 then
		set _tokenid=null;
		select t.TokenId into _tokenid from email as e,token as t where e.EmailAddress=eml and e.Token=t.TokenId and t.AccountId=acnid and t.`Status` ='pending';
		if _tokenid is not null then
			update token set `Status`='abandoned' where TokenId=_tokenid;
			return 0;
		end if;
		return 1;# user only have this email link to account
	else
		#delete from email where token=_tokenid;
		update token set `Status`='abandoned' where TokenId=_tokenid;
		return 0;
	end if;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for removePhone
-- ----------------------------
DROP FUNCTION IF EXISTS `removePhone`;
delimiter ;;
CREATE FUNCTION `removePhone`(`acnid` integer,`phn` varchar(50))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare _tokenid integer;
	declare amountofeml integer;
	declare amountofphone integer;
	select t.TokenId into _tokenid  from phone as p,token as t where p.PhoneNo=phn and p.Token=t.TokenId and t.AccountId=acnid and t.`Status` <>'abandoned';
	if _tokenid is null then
		return 2;# user do not have this phone
	end if;
	select count(*) into amountofphone from phone as p,token as t where p.Token=t.TokenId and t.AccountId=acnid and t.`Status` ='verified';
	select count(*) into amountofeml from email as e,token as t where e.Token=t.TokenId and t.AccountId=acnid and t.`Status` ='verified';
	if (amountofphone+amountofeml)<2 then
		set _tokenid=null;
		select t.TokenId into _tokenid  from phone as p,token as t where p.PhoneNo=phn and p.Token=t.TokenId and t.AccountId=acnid and t.`Status` ='pending';
		if _tokenid is not null then
			update token set `Status`='abandoned' where TokenId=_tokenid;
			return _tokenid;
		end if;
		return _tokenid;# user only have this email link to account
	else
		#delete from phone where token=_tokenid;
		update token set `Status`='abandoned' where TokenId=_tokenid;
		return 0;
	end if;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for sendMoneytoBank
-- ----------------------------
DROP FUNCTION IF EXISTS `sendMoneytoBank`;
delimiter ;;
CREATE FUNCTION `sendMoneytoBank`(`acntid` INTEGER,`Amount` decimal(10,2),`Bid` varchar(15),`Anum` varchar(15))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare singleresult int(11);
	declare weeklimitResult int(11);
	declare bl decimal(10,2);
	declare v char(1);
	declare val integer;
	select AccountId into val from bank where BankId=Bid and AccountNumber=Anum;
	if val <> acntid then
		return 5; # this bank acount is not belong to user
	end if;
	select Balance into bl from account WHERE AccountId=acntid;
	if bl <Amount then
		return 1; # amount over balance
	end if;
	select verified into v from bank where AccountId=acntid and BankId=Bid and AccountNumber=Anum;
	if v<>'Y' then
		return 2; # card is not verified;
	end if;
	set singleresult = checkSingleLimit(acntid,Amount);
	if singleresult > 0 then return 3; # over single limit
	end if;
	set weeklimitResult = checkWeekLimit(acntid,Amount);
	if weeklimitResult >0 then return 4; # over week limit
	end if;
	
	update account  as a
		set a.Balance = (a.Balance-Amount),a.ToBankRollingLimit=(a.ToBankRollingLimit-Amount)
		where a.AccountId=acntid;
	insert into transactionofBank(AccountId,BankId,AccountNumber,Amount,Type)
		values(acntid,Bid,Anum,Amount,'T');
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for setPrimaryBankCard
-- ----------------------------
DROP FUNCTION IF EXISTS `setPrimaryBankCard`;
delimiter ;;
CREATE FUNCTION `setPrimaryBankCard`(`acnId` integer,`bkId` char(15),`acntNmb` char(15))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare exist tinyint(1);
	declare count integer;
	declare _bankid char(15);
	declare _accountnum char(15);
	select count(*) into count from bank as b where b.AccountId=acnId;
	if count < 1 then
		return 2;
	end if;
	select IF(b.AccountId is null,false,true) into exist from bank as b where b.AccountId=acnId and b.BankId=bkId and b.AccountNumber=acntNmb;
	if exist=true then
		select b.BankId,b.AccountNumber into _bankid,_accountnum from bank as b where b.AccountId=acnId and b.IsPrimary='Y';
		UPDATE bank as b set IsPrimary='Y',verified='Y' where b.AccountId=acnId and b.BankId=bkId and b.AccountNumber=acntNmb;
		UPDATE bank as b set IsPrimary='N' where b.AccountId=acnId and b.BankId=_bankid and b.AccountNumber=_accountnum;
		return 0;
	else 
		return 1;
	end if;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for test
-- ----------------------------
DROP FUNCTION IF EXISTS `test`;
delimiter ;;
CREATE FUNCTION `test`(fake integer)
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	DECLARE acnid INTEGER;
	DECLARE trnid integer;
	declare amt DECIMAL(10,2);
	declare done int default false;
	declare total INTEGER DEFAULT 0;
	declare cur CURSOR for 
		select a.AccountId,trn.TransactionId,trn.Amount from transactionofaccount as trn,send_transactionofaccount as s, token as t, account as a
			where a.AccountId=trn.CreateAccountId and trn.TransactionId=s.TransactionId and s.TargetToken=t.TokenId and t.AccountId is null and s.TStatus='pending' and TIMESTAMPDIFF(SECOND,trn.InitiatedTime,NOW())>=60*60*24*15;
	declare continue HANDLER for not found set done = true;
	open cur;
	update_loop:loop
		fetch cur into acnid,trnid,amt;
		if done then
			leave update_loop;
		end if;
		UPDATE account set Balance=Balance+amt,paymentRollingLimit=(paymentRollingLimit+amt) where AccountId=acnid;
		UPDATE send_transactionofaccount set TStatus='canceled' where TransactionId=trnid;
		set total=total+1;
	end loop;
	close cur;
	RETURN total;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for verifyBankCard
-- ----------------------------
DROP FUNCTION IF EXISTS `verifyBankCard`;
delimiter ;;
CREATE FUNCTION `verifyBankCard`(`acntid` integer,`bkid` char(15),`acntnum` char(15))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare val integer;
	SELECT AccountId into val FROM bank WHERE BankId=bkid and AccountNumber=acntnum and AccountId=acntid;
	if val is null then
	return 1;
	end if;
	update bank set verified='Y' where BankId=bkid and AccountNumber=acntnum and AccountId=acntid;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for verifyEmail
-- ----------------------------
DROP FUNCTION IF EXISTS `verifyEmail`;
delimiter ;;
CREATE FUNCTION `verifyEmail`(`acntid` integer,`eml` varchar(50))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	DECLARE val integer;
	set val=null;
	select t.TokenId into val from email as e, token as t where t.AccountId=acntid and t.TokenId=e.Token and e.EmailAddress=eml and t.`Status` ='pending';
	if val is null then
	return 1;
	end if;
	update token set `Status`='verified' where TokenId=val;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for verifyPhone
-- ----------------------------
DROP FUNCTION IF EXISTS `verifyPhone`;
delimiter ;;
CREATE FUNCTION `verifyPhone`(`acntid` integer,`ph` varchar(50))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	DECLARE val integer;
	set val=null;
	select t.TokenId into val from phone as p, token as t where t.AccountId=acntid and t.TokenId=p.Token and p.PhoneNo=ph and t.`Status` ='pending';
	if val is null then
	return 1;
	end if;
	update token set `Status`='verified' where TokenId=val;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for verifySSN
-- ----------------------------
DROP FUNCTION IF EXISTS `verifySSN`;
delimiter ;;
CREATE FUNCTION `verifySSN`(`acntid` integer,`_name` varchar(50),`_ssn` char(15))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
	declare val char(15);
	set val=null;
	select SSN into val from account where AccountId=acntid;
	if val is not null then
	return 1;
	end if;
	update account set SSN=_ssn, `Name`=_name,PlanId=2 where AccountId=acntid;
	RETURN 0;
END
;;
delimiter ;

-- ----------------------------
-- Event structure for finishSendPayment
-- ----------------------------
DROP EVENT IF EXISTS `finishSendPayment`;
delimiter ;;
CREATE EVENT `finishSendPayment`
ON SCHEDULE
EVERY '1' MINUTE STARTS '2018-12-04 11:31:04'
DO BEGIN
	DECLARE acnid INTEGER;
	DECLARE trnid integer;
	declare amt DECIMAL(10,2);
	declare done int default false;
	declare cur CURSOR for 
		select a.AccountId,trn.TransactionId,trn.Amount from transactionofaccount as trn,send_transactionofaccount as s, token as t, account as a
			where trn.TransactionId=s.TransactionId and s.TargetToken=t.TokenId and t.AccountId=a.AccountId and s.TStatus='pending' and TIMESTAMPDIFF(SECOND,trn.InitiatedTime,NOW())>=600;
	declare continue HANDLER for not found set done = true;
	open cur;
	update_loop:loop
		fetch cur into acnid,trnid,amt;
		if done then
			leave update_loop;
		end if;
		UPDATE account set Balance=Balance+amt, PendingBalance=PendingBalance-amt where AccountId=acnid;
		UPDATE send_transactionofaccount set TStatus='finished' where TransactionId=trnid;
	end loop;
	close cur;
END
;;
delimiter ;

-- ----------------------------
-- Event structure for weekLimite
-- ----------------------------
DROP EVENT IF EXISTS `weekLimite`;
delimiter ;;
CREATE EVENT `weekLimite`
ON SCHEDULE
EVERY '7' DAY STARTS '2018-12-04 11:40:15'
DO BEGIN
	DECLARE acnid INTEGER;
	DECLARE plid integer;
	declare weeklimit DECIMAL(10,2);
	#declare singlelimit decimal(10,2);
	declare total int default 0;
	declare done int default false;
	declare cur CURSOR for select AccountId,PlanId from account;
	declare continue HANDLER for not found set done = true;
	set total = 0;
	open cur;
	update_loop:loop
		fetch cur into acnid,plid;
		if done then
			leave update_loop;
		end if;
		select BalanceToBankWeekLimit into weeklimit from plan where PlanId=plid;
		UPDATE account set ToBankRollingLimit=ToBankRollingLimit+weeklimit,paymentRollingLimit=paymentRollingLimit+299.99 where AccountId=acnid;
	end loop;
	close cur;
END
;;
delimiter ;

-- ----------------------------
-- Event structure for WithdrawOutdateTransaction
-- ----------------------------
DROP EVENT IF EXISTS `WithdrawOutdateTransaction`;
delimiter ;;
CREATE EVENT `WithdrawOutdateTransaction`
ON SCHEDULE
EVERY '1' MINUTE STARTS '2018-12-04 12:27:16'
DO BEGIN
	DECLARE acnid INTEGER;
	DECLARE trnid integer;
	declare amt DECIMAL(10,2);
	declare done int default false;
	declare total INTEGER DEFAULT 0;
	declare cur CURSOR for 
		select a.AccountId,trn.TransactionId,trn.Amount from transactionofaccount as trn,send_transactionofaccount as s, token as t, account as a
			where a.AccountId=trn.CreateAccountId and trn.TransactionId=s.TransactionId and s.TargetToken=t.TokenId and t.AccountId is null and s.TStatus='pending' and TIMESTAMPDIFF(SECOND,trn.InitiatedTime,NOW())>=60*60*24*15;
	declare continue HANDLER for not found set done = true;
	open cur;
	update_loop:loop
		fetch cur into acnid,trnid,amt;
		if done then
			leave update_loop;
		end if;
		UPDATE account set Balance=Balance+amt,paymentRollingLimit=(paymentRollingLimit+amt) where AccountId=acnid;
		UPDATE send_transactionofaccount set TStatus='canceled' where TransactionId=trnid;
		set total=total+1;
	end loop;
	close cur;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
