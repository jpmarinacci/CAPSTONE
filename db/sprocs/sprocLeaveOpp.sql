DELIMITER $$
CREATE DEFINER=`eLeapisit`@`%` PROCEDURE `sprocLeaveOpp`(in oppId int, in userId int)
BEGIN
    DECLARE errno INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
    GET CURRENT DIAGNOSTICS CONDITION 1 errno = MYSQL_ERRNO;
SELECT errno AS MYSQL_ERROR;
    ROLLBACK;
    END;
	START TRANSACTION;
SELECT 'success' AS 'status';
  
DELETE FROM eLeapData.filledSeatTable 
WHERE
    opportunityId = oppId
    AND personId = userId;
SELECT 
    *
FROM
    eLeapData.filledSeatTable;
commit;

END$$
DELIMITER ;
