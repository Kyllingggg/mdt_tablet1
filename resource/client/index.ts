// onNet and emitNet are globally available, no import needed!

RegisterCommand('mdt', () => {
    SetNuiFocus(true, true);
    SendNUIMessage({
        action: 'setVisible',
        data: true
    });
}, false);

RegisterNuiCallback('closeMDT', (data: any, cb: Function) => {
    SetNuiFocus(false, false);
    SendNUIMessage({
        action: 'setVisible',
        data: false
    });
    cb({});
});

RegisterNuiCallback('searchPlayer', (data: { name: string }, cb: Function) => {
    emitNet('mdt:server:searchPlayer', data.name);
    cb({});
});

RegisterNuiCallback('getDashboardData', (data: any, cb: Function) => {
    emitNet('mdt:server:getDashboardData');
    cb({});
});

RegisterNuiCallback('getRoles', (data: any, cb: Function) => {
    emitNet('mdt:server:getRoles');
    cb({});
});

RegisterNuiCallback('toggleActive', (data: { isActive: boolean }, cb: Function) => {
    emitNet('mdt:server:toggleActive', data.isActive);
    cb({});
});

onNet('mdt:client:receiveSearchResults', (results: any[]) => {
    SendNUIMessage({
        action: 'searchResults',
        data: results
    });
});

onNet('mdt:client:receiveDashboardData', (data: any) => {
    SendNUIMessage({
        action: 'dashboardData',
        data: data
    });
});

onNet('mdt:client:receiveRoles', (roles: any[]) => {
    SendNUIMessage({
        action: 'rolesData',
        data: roles
    });
});

onNet('mdt:client:activeStatusToggled', (isActive: boolean) => {
    SendNUIMessage({
        action: 'activeStatus',
        data: isActive
    });
});