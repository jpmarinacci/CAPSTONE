DELIMITER $$
CREATE DEFINER=`eLeapisit`@`%` PROCEDURE `sprocGetOppID`(in oppid_v int,in ownID_v int)
BEGIN
select * from eLeapData.opportunityTable
where opportunityTable.OpportunityID = oppid_v; 
END$$
DELIMITER ;
