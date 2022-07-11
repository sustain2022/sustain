async function roleMasterIDGen(req) {

    const sub = req.data;
    var roleID;
    var subcount = await cds.run(`SELECT MAX(CAST(REPLACE(REPLACE(RoleID , 'RL', ''), '', '') as int)) as count from SUSTAINABILITY_DB_RoleMaster`);
    if (subcount[0].COUNT != null) {
        subcount = parseInt(subcount[0].COUNT);
        roleID = ++subcount;
        roleID = roleID.toString();
        if (roleID.length === 1) {
            roleID = "00" + roleID;
        } else if (roleID.length === 2) {
            roleID = "0" + roleID;
        }
        sub.RoleID = "RL" + roleID;
    }
    else {
        subcount = 0;
        sub.RoleID = "RL" + "0001";
    }

}

exports._roleMasterIDGen = roleMasterIDGen;