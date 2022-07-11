using sustainability.db as sustainability from '../db/sustainability';

service SustainabilityService {
    
    entity GoalTemplate as projection on sustainability.GoalTemplate;
     entity GoalTemp as projection on sustainability.GoalTemplate;
    entity GoaTemplateFields as projection on sustainability.GoalTemplateFields;
    entity GoalHeader as projection on sustainability.GoalHeader;
    entity GoalDetails as projection on sustainability.GoalDetails;
    entity GoalDropdownValues as projection on sustainability.GoalDropdownValues;     
    entity SupplierHeader as projection on sustainability.SupplierHeader;
    entity SupplierResources as projection on sustainability.SupplierResources;
    entity ClientResources as projection on sustainability.ClientResources;
    entity Client as projection on sustainability.Client;
    entity DepartmentHeader as projection on sustainability.DepartmentHeader;
    entity TeamHeader as projection on sustainability.TeamHeader;
    entity TeamDetails as projection on sustainability.TeamDetails;
    entity UserLogin as projection on sustainability.UserLogin;

    entity EmployeeGoal as projection on sustainability.EmployeeGoal;
    entity EmployeeGoalUpdate as projection on sustainability.EmployeeGoal_Update;
    entity DepartmentGoal as projection on sustainability.DepartmentGoal;   
    entity EmployeeUser as projection on sustainability.EmployeeUser;
    entity RoleMaster as projection on sustainability.RoleMaster;
    entity RolePermission as projection on sustainability.RolePermission;
    entity UserAssignedRoles as projection on sustainability.UserAssignedRoles;
    entity Country as projection on sustainability.Country;
    entity Region as projection on sustainability.Region;
    entity SupplierGoal as projection on sustainability.SupplierGoal;
    entity SupplierGoalUpdate as projection on sustainability.SupplierGoal_Update;
    entity AgencyReportTemplate as projection on sustainability.AgencyReportTemplate;
    entity AgencyReportTemplateDetails as projection on sustainability.AgencyReportTemplateDetails;
    entity AgencyReportHeader as projection on sustainability.AgencyReportHeader;
    entity AgencyReportDetails as projection on sustainability.AgencyReportDetails;
    
    //Virtual table for reports
    @readonly
    entity AgencyReport as projection on sustainability.AgencyReport;

    @readonly
    entity GoalStatusRep as projection on sustainability.GoalStatusRep;

    entity orgChart as projection on sustainability.orgChart;
}