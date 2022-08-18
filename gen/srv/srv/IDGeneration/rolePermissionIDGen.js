async function rolePermission(req) {
    const sub = req.data;
    var roleID;
    var subcount = await cds.run(`SELECT MAX(CAST(REPLACE(REPLACE(PermissionID , 'PR', ''), '', '') as int)) as count from SUSTAINABILITY_DB_RolePermission`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        roleID = ++subcount;
        roleID = roleID.toString();
        if (roleID.length === 1) {
            roleID = "00" + roleID;
        } else if (roleID.length === 2) {
            roleID = "0" + roleID;
        }
        sub.PermissionID = "PR" + roleID;
    }
    else {
        subcount = 0;
        sub.PermissionID = "PR" + "0001";
    }

}


exports._rolePermission = rolePermission;