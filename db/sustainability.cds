namespace sustainability.db;

using {
    managed,
    temporal,
    cuid
} from '@sap/cds/common';

/*----------------------------------------------------
              Data Types
------------------------------------------------------*/
type GOAL_TEMPLATE : String(10);
type CLIENT : String(10);

type STATUS : Integer enum {
    New           = 10;
    ![In Process] = 20;
    Escalted      = 40;
    Completed     = 30;
    Closed        = 60
}

/*-----------------------------------------------------
               Goal Management
-------------------------------------------------------*/
entity GoalTemplate : managed {
    key GoalTemplateID      : GOAL_TEMPLATE;
    key ClientID            : CLIENT;
        AgencyID            : String(10);
        TemplateName        : String(25);
        TemplateDescription : LargeString;
// GoalTemplateFields : Association to GoalTemplateFields;
}

entity GoalTemplateFields : managed {
    key GoalTemplateID   : GOAL_TEMPLATE;
    key ClientID         : CLIENT;
    key FieldID          : Integer64;
        FieldName        : String(30);
        FieldDescription : LargeString;
        FieldSRN         : Integer;
        FInputType       : String(30);
        DataType         : String(30);
        IsMandatory      : Boolean;
        IsActive         : Boolean;
        FieldSequence    : Integer64;
}

entity GoalHeader : managed {
    key GoalTemplateID         : GOAL_TEMPLATE;
    key ClientID               : CLIENT;
    key GoalID                 : Integer64;
        GoalStatus_Sys         : String(2); // Technical Status
        GoalStaus_Biz          : STATUS; //Business Status
        Visibility             : String(15);
        GoalName               : String(250);
        ImpactCategory         : String(25);
        Metric                 : String(100);
        virtual GoalCompletion : String(5); // Sum of Department + Employee + Supplier - based on casacading of goal
        BeginDate              : Date;
        EndDate                : Date;
        Category               : String(25);
        EmployeeAssignment     : Association to many EmployeeGoal
                                     on EmployeeAssignment.GoalID = GoalID;
        SupplierAssignment     : Association to many SupplierGoal
                                     on SupplierAssignment.GoalID = GoalID;
        DepartmentAssignment   : Association to many DepartmentGoal
                                     on  DepartmentAssignment.GoalID   = GoalID
                                     and DepartmentAssignment.ClientID = ClientID;
        GoalDetails            : Composition of many GoalDetails
                                     on  GoalDetails.GoalID         = GoalID
                                     and GoalDetails.GoalTemplateID = GoalTemplateID
                                     and GoalDetails.ClientID       = ClientID

}

entity GoalDetails : managed {
    key GoalTemplateID : GOAL_TEMPLATE;
    key ClientID       : CLIENT;
    key GoalID         : Integer64;
    key FieldID        : Integer64;
        FieldValue     : String(500);
        GoalFields     : Association to GoalTemplateFields
                             on  GoalFields.FieldID        = FieldID
                             and GoalFields.GoalTemplateID = GoalTemplateID;
//GoalStatus         : Association to GoalHeader
//                         on  GoalStatus.ClientID = ClientID
//                         and GoalStatus.GoalID   = GoalID;
}


entity GoalDropdownValues : managed {
    key SRNo           : Integer64;
    key GoalTemplateID : GOAL_TEMPLATE;
    key FieldID        : Integer64;
        Value          : String(40);
}

entity DepartmentGoal : managed { // No updation direcly in the department goal
    key ClientID               : CLIENT;
    key GoalID                 : Integer64;
    key AssignmentID           : Integer64; // Multiple goal assignment with in a single goal(serial number)
        DepartmentID           : String(10);
        AgencyID               : String(10);
        EmployeeID             : String(10);
        TargetAssigned         : Integer64;
        virtual TargetAchieved : Integer64; // Sum of Employee + Supplier - its subject casacding of goal
        Status_Biz             : STATUS;
        AssignedBy             : String(10);
        AdditionalInfo         : String(500);
        BeginDate              : Date;
        EndDate                : Date;
        GoalDetails            : Association to GoalDetails
                                     on GoalDetails.GoalID = GoalID;
        EmployeeDetails        : Association to EmployeeUser
                                     on  EmployeeDetails.EmployeeID = EmployeeID
                                     and EmployeeDetails.ClientID   = ClientID;
        DepartmentDetails      : Association to DepartmentHeader
                                     on  DepartmentDetails.DepartmentID = DepartmentID
                                     and DepartmentDetails.ClientID     = ClientID
}

entity EmployeeGoal : managed {
    key ClientID               : CLIENT;
    key GoalID                 : Integer64;
    key AssignmentID           : Integer64;
        AgencyID                : String(10);
        EmployeeID             : String(10);
        TargetAssigned         : Integer64;
        virtual TargetAchieved : Integer64; // This field to be check with Hari to consider as virtual
        Status_Biz             : STATUS;
        AssignedBy             : String(10);
        AdditionalInfo         : String(500);
        BeginDate              : Date;
        EndDate                : Date;
        GoalDetails            : Association to GoalDetails
                                     on GoalDetails.GoalID = GoalID;
        EmployeeDetails        : Association to EmployeeUser
                                     on  EmployeeDetails.EmployeeID = EmployeeID
                                     and EmployeeDetails.ClientID   = ClientID
//GoalHeader : Association to GoalHeader on GoalHeader.GoalID = GoalID;
}

entity EmployeeGoal_Update : managed {
    key UpdateSRN       : Integer64;
    key ClientID        : CLIENT;
    key GoalID          : Integer64;
    key AssignmentID    : Integer64;
        AgencyID        : String(10);
        EmployeeID      : String(10);
        TargetAssigned  : Integer64;
        TargetAchieved  : Integer64;
        Status_Biz      : STATUS;
        AssignedBy      : String(10);
        AdditionalInfo  : String(500);
        LastChangedAt   : Timestamp;
        EmployeeDetails : Association to EmployeeUser
                              on  EmployeeDetails.EmployeeID = EmployeeID
                              and EmployeeDetails.ClientID   = ClientID
}

entity SupplierGoal : managed {
    key ClientID               : CLIENT;
    key GoalID                 : Integer64;
    key AssignmentID           : Integer64;
        SupplierID             : String(10);
        EmployeeID             : String(10);
        AgencyID               : String(10);
        TargetAssigned         : Integer64;
        virtual TargetAchieved : Integer64; // This field to be check with Hari to consider as virtual
        Status_Biz             : STATUS;
        AssignedBy             : String(10);
        AdditionalInfo         : String(500);
        BeginDate              : Date;
        EndDate                : Date;
        GoalDetails            : Association to GoalDetails
                                     on GoalDetails.GoalID = GoalID;
        EmployeeDetails        : Association to EmployeeUser
                                     on  EmployeeDetails.EmployeeID = EmployeeID
                                     and EmployeeDetails.ClientID   = ClientID;
        SupplierDetails        : Association to SupplierHeader
                                     on  SupplierDetails.SupplierID = SupplierID
                                     and SupplierDetails.ClientID   = ClientID;
// GoalHeader : Association to GoalHeader on GoalHeader.GoalID = GoalID;

}

entity SupplierGoal_Update : managed {
    key UpdateSRN       : Integer64;
    key ClientID        : CLIENT;
    key GoalID          : Integer64;
    key AssignmentID    : Integer64;
        SupplierID      : String(10);
        EmployeeID      : String(10);
        AgencyID        : String(10);
        TargetAssigned  : Integer64;
        TargetAchieved  : Integer64;
        Status_Biz      : STATUS;
        AssignedBy      : String(10);
        AdditionalInfo  : String(500);
        LastChangedAt   : Timestamp;
        EmployeeDetails : Association to EmployeeUser
                              on  EmployeeDetails.EmployeeID = EmployeeID
                              and EmployeeDetails.ClientID   = ClientID;
        SupplierDetails : Association to SupplierHeader
                              on  SupplierDetails.SupplierID = SupplierID
                              and SupplierDetails.ClientID   = ClientID;
}


/*----------------------------------------------------
              Supplier Management
  ----------------------------------------------------*/
entity SupplierHeader : managed {
    key ClientID          : CLIENT;
    key SupplierID        : String(10);
        DepartmentID      : String(10);
        SupplierName      : String(30);
        ContactName       : String(30);
        Email             : String(30);
        PhoneNo           : String(30);
        Address           : String(256);
        Country           : String(30);
        ContactNumber     : Integer64;
        SupplierStatus    : String(2); // Active or Inactive
        DepartmentDetails : Association to DepartmentHeader
                                on  DepartmentDetails.DepartmentID = DepartmentID
                                and DepartmentDetails.ClientID     = ClientID
}

entity SupplierResources : managed { //Having doubts "combo key required"
    key ClientID        : CLIENT;
    key SupplierID      : String(10);
    key EmployeeID      : String(10);
        RoleID          : String(10);
        EmployeeDetails : Association to EmployeeUser
                              on  EmployeeDetails.EmployeeID = EmployeeID
                              and EmployeeDetails.SupplierID = SupplierID
}

entity ClientResources : managed { //Having doubts on client resource table "combo key required"
    key ClientID        : CLIENT;
    key EmployeeID      : String(10);
        RoleID          : String(10);
        EmployeeDetails : Association to EmployeeUser
                              on  EmployeeDetails.EmployeeID = EmployeeID
                              and EmployeeDetails.ClientID   = ClientID
}

/*--------------------------------------------------------
                       User Management
----------------------------------------------------------*/
// Enterprise client regisration
entity Client : managed {
    key ClientID      : CLIENT;
        ClientName    : String(100);
        ContactPerson : String(100);
        Email         : String(50);
        Address       : String(256);
        CountryID     : String(3);
        ContactNumber : Integer64;
        Country       : Association to Country
                            on Country.CountryID = CountryID
}

//User Details
entity EmployeeUser : managed {
    key ClientID          : CLIENT;
    key UserID            : String(20);
    key EmployeeID        : String(10);
        SupplierID        : String(10);
        DepartmentID      : String(10);
        EmployeeName      : String(100);
        EmployeeType      : String(20); // Internal or External
        Email             : String(50);
        ContactNumber     : Integer64;
        CountryID         : String(3);
        ValidFrom         : Timestamp;
        ValidTo           : Timestamp;
        UserStatus        : String(10); // Values: Suspended, Blocked, InActive, Active
        Position          : String(30); // CXO, HOD, Senior Manager, Employee
        Supervisor        : String(10);
        isSupervisor      : Boolean;
        Country           : Association to Country
                                on Country.CountryID = CountryID;
        DepartmentDetails : Association to DepartmentHeader
                                on  DepartmentDetails.DepartmentID = DepartmentID
                                and DepartmentDetails.ClientID     = ClientID

// Role -> CXO, HOD, Senior Manager, Employee
// Supervisor/Lead -> HOD, Manager
// Hierarchy -> 1, 2, 3...
// Hierarchy level -> 1, 2, 3...

//Hierarchy level -> level number, hierachy role name, Description, Deparment, CLient
// Roles -> Use role master table

}

// Validating the logged in user
entity UserLogin : managed {
    key ClientID   : CLIENT;
    key UserID     : String(20);
    key Email      : String(100);
        Password   : String(100);
        UserType   : String(20);
        ValidFrom  : Timestamp;
        ValidTo    : Timestamp;
        UserStatus : String(10); // Values: Suspended, Blocked, InActive, Active
}

/*--------------------------------------------------------
                       Role Management
----------------------------------------------------------*/
entity RoleMaster { // to check with Hari, RoleID is required or not
    key ClientID        : CLIENT;
    key RoleID          : String(10);
        RoleName        : String(10);
        RoleType        : String(15);
        Description     : String(50);
        RoleStatus      : String(10); // Active, InAcive or Blocked
       // PermissionID    : String(10); // not required here
        RolePermissions : Association to RolePermission
                              on  RolePermissions.ClientID     = ClientID
                              and RolePermissions.RoleID       = RoleID
                            //  and RolePermissions.PermissionID = PermissionID
}

entity RolePermission { // to check with Hari, RoleID is required or not
    key ClientID     : CLIENT;
    key PermissionID : String(10);
    key RoleID       : String(10);
        Description  : String(15);
        PermissionByObject:  array of {
                ObjectID: String(15);
                Read: Boolean;
                Write: Boolean;
                Delete: Boolean;
        };
        PermissionType: String(10);
}

entity RolePermissionObject {
    key RPObjectID: Integer;
        ObjectName : String(15);
}

entity UserAssignedRoles {
    key ClientID       : CLIENT;
    key UserID         : String(10);
    key RoleID         : String(10);
        UserRoleStatus : String(10); // Active, Inactive
        RoleDettails   : Association to RoleMaster
                             on  RoleDettails.ClientID = ClientID
                             and RoleDettails.RoleID   = RoleID

}

/*--------------------------------------------------------
                       Global Tables
----------------------------------------------------------*/
entity Country {
    key RegionID    : String(5);
    key CountryID   : String(3);
        CountryName : String(100);
}

entity Region {
    key RegionID   : String(5);
        RegionName : String(50);
}

/*---------------------------------------------------------
                       Team Management
-----------------------------------------------------------*/

entity TeamHeader : managed {
    key ClientID          : CLIENT;
    key DepartmentID      : String(10);
    key TeamID            : String(10);
        TeamName          : String(50);
        TeamDescription   : String(500);
        TeamType          : String(20); // Internal or External
        DepartmentDetails : Association to DepartmentHeader
                                on  DepartmentDetails.DepartmentID = DepartmentID
                                and DepartmentDetails.ClientID     = ClientID
}

entity TeamDetails : managed {
    key ClientID        : CLIENT;
    key TeamID          : String(10);
    key DepartmentID    : String(10);
    key EmployeeID      : String(10);
        RoleID          : String(5); // Team Role: Group Manager, Team Lead, Quality, Monitoring
        TeamDetails     : Association to TeamHeader
                              on  TeamDetails.TeamID       = TeamID
                              and TeamDetails.ClientID     = ClientID
                              and TeamDetails.DepartmentID = DepartmentID;
        EmployeeDetails : Association to EmployeeUser
                              on EmployeeDetails.EmployeeID = EmployeeID
}

/*---------------------------------------------------------
                       Department Management
-----------------------------------------------------------*/

entity DepartmentHeader : managed {
    key ClientID              : CLIENT;
    key DepartmentID          : String(10);
        SupplierID            : String(10);
        DepartmentName        : String(50);
        DepartmentDescription : String(500);
        HOD                   : String(30);
        DepartmentStatus      : String(15); // Active or Inactive
        DepartmentType        : String(20); // Internal or External
        ParentDepartmentID    : String(10);
        Ranking               : Integer;
}


entity AgencyReportTemplate : managed {
    key ClientID                    : CLIENT;
    key TemplateID                  : String(10);
        Agency                      : String(10);
        TemplateName                : String(50);
        TemplateDescription         : LargeString;
        TemplateType                : String(10);
        AgencyReportTemplateDetails : Composition of many AgencyReportTemplateDetails
                                          on  AgencyReportTemplateDetails.TemplateID = TemplateID
                                          and AgencyReportTemplateDetails.ClientID   = ClientID
}

entity AgencyReportTemplateDetails : managed {
    key TemplateID       : String(10);
    key ClientID         : CLIENT;
    key FieldID          : Integer64;
        FieldName        : String(100);
        FieldDescription : LargeString;
        FieldSRN         : Integer;
}

entity AgencyReportHeader : managed {
    key TemplateID          : String(10);
    key ClientID            : CLIENT;
    key RecordNumber        : UUID;
        SupplierID          : String(10);
        ExportID            : Integer;
        AgencyReportDetails : Composition of many AgencyReportDetails
                                  on  AgencyReportDetails.TemplateID   = TemplateID
                                  and AgencyReportDetails.ClientID     = ClientID
                                  and AgencyReportDetails.RecordNumber = RecordNumber
/*  AgencyReportDetails            : Composition of many AgencyReportDetails
                               on  AgencyReportDetails.RecordNumber         = RecordNumber
                               and AgencyReportDetails.TemplateID = TemplateID
                               and AgencyReportDetails.ClientID       = ClientID */
}

entity AgencyReportDetails : managed {
    key TemplateID         : String(10);
    key ClientID           : CLIENT;
    key RecordNumber       : UUID;
    key FieldID            : Integer64;
        FieldValue         : String(500);
        AgencyFieldDetails : Association to AgencyReportTemplateDetails
                                 on  AgencyFieldDetails.TemplateID = TemplateID
                                 and AgencyFieldDetails.ClientID   = ClientID
                                 and AgencyFieldDetails.FieldID    = FieldID
}

entity AgencyReport {
        // key SerialNo         : Integer64;
    key RecordNumber     : UUID;
        TemplateID       : String(10);
        CreatedAt        : Timestamp;
        ExportID         : Integer;
        virtual Column0  : String(500);
        virtual Column1  : String(500);
        virtual Column2  : String(500);
        virtual Column3  : String(500);
        virtual Column4  : String(500);
        virtual Column5  : String(500);
        virtual Column6  : String(500);
        virtual Column7  : String(500);
        virtual Column8  : String(500);
        virtual Column9  : String(500);
        virtual Column10 : String(500);
        virtual Column11 : String(500);
        virtual Column12 : String(500);
        virtual Column13 : String(500);
        virtual Column14 : String(500);
        virtual Column15 : String(500);
        virtual Column16 : String(500);
        virtual Column17 : String(500);
        virtual Column18 : String(500);
        virtual Column19 : String(500);
        virtual Column20 : String(500);
        virtual Column21 : String(500);
        virtual Column22 : String(500);
        virtual Column23 : String(500);
        virtual Column24 : String(500);
        virtual Column25 : String(500);
        virtual Column26 : String(500);
        virtual Column27 : String(500);
        virtual Column28 : String(500);
        virtual Column29 : String(500);
        virtual Column30 : String(500);
        virtual Column31 : String(500);
        virtual Column32 : String(500);
        virtual Column33 : String(500);
        virtual Column34 : String(500);
        virtual Column35 : String(500);
        virtual Column36 : String(500);
        virtual Column37 : String(500);
        virtual Column38 : String(500);
        virtual Column39 : String(500);
        virtual Column40 : String(500);
        virtual Column41 : String(500);
        virtual Column42 : String(500);
        virtual Column43 : String(500);
        virtual Column44 : String(500);
        virtual Column45 : String(500);
        virtual Column46 : String(500);
        virtual Column47 : String(500);
        virtual Column48 : String(500);
        virtual Column49 : String(500);
        virtual Column50 : String(500);
        virtual Column51 : String(500);
        virtual Column52 : String(500);
        virtual Column53 : String(500);
        virtual Column54 : String(500);
        virtual Column55 : String(500);
        virtual Column56 : String(500);
        virtual Column57 : String(500);
        virtual Column58 : String(500);
        virtual Column59 : String(500);
        virtual Column60 : String(500);
        virtual Column61 : String(500);
        virtual Column62 : String(500);
        virtual Column63 : String(500);
        virtual Column64 : String(500);
        virtual Column65 : String(500);
        virtual Column66 : String(500);
        virtual Column67 : String(500);
        virtual Column68 : String(500);
        virtual Column69 : String(500);
        virtual Column70 : String(500);

}

entity GoalStatusRep {
    key SerialNo              : Integer;
        virtual GoalStatus    : String(10);
        virtual NumberOfGoals : Integer64;
        virtual Behind        : Integer64;
        virtual OnTrack       : Integer64;
        virtual NotStarted    : Integer64;
        virtual Completed     : Integer64;
        virtual Escalted      : Integer64;
}

/*---------------------------------------------------------
                       Role Request Management
-----------------------------------------------------------*/
entity RequestCategory {
    key RequestID       : Integer;
    key ClientID        : CLIENT;
        RequestCategory : String(50); //Ex: Role Access
        RequestPriority : Integer;
}

entity RequestDetails {
    key RequestID          : Integer;
    key ClientID           : CLIENT;
        RequestCategory    : String(50);
        Description        : String(255);
        Status             : String(10);
        TicketNumber       : Integer64;
        RequestSubCategory : String(50);
}


/*---------------------------------------------------------
                       Org Structure
-----------------------------------------------------------*/

entity OrgStructure {
    key orgKey         : Integer;
        nodes          : Association to EmployeeUser;
        lines          : array of {
            supervisor : String(10);
            employee   : String(10);
        }
}

entity orgChart {
    key ClientID          : CLIENT;
        nodes             : array of {
            EmployeeID    : String(10);
            SupplierID    : String(10);
            DepartmentID  : String(10);
            EmployeeName  : String(100);
            EmployeeType  : String(20); // Internal or External
            Email         : String(50);
            ContactNumber : Integer64;
            CountryID     : String(3);
            Position      : String(30); // CXO, HOD, Senior Manager, Employee
            Supervisor    : String(15);
            TeamMembers   : Integer;
            GoalsAssigned : Integer;
            TeamGoals     : Integer;
        };
        lines             : array of {
            supervisor    : String(15);
            employee      : String(15);
        }
}
