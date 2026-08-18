import { oxmysql } from '@overextended/oxmysql';

// Get ESX object if possible to resolve player identities
const getESX = () => {
    try {
        return exports.es_extended.getSharedObject();
    } catch (e) {
        return null;
    }
};

onNet('mdt:server:getDashboardData', async () => {
    const src = source;
    try {
        const [officers, bolos, news, wantedList] = await Promise.all([
            oxmysql.query('SELECT identifier as id, CONCAT(firstname, " ", lastname) as name, job_grade FROM users WHERE job = "police" AND mdt_active = 1', []),
            oxmysql.query('SELECT * FROM mdt_bolos ORDER BY timestamp DESC LIMIT 20', []),
            oxmysql.query('SELECT * FROM mdt_news ORDER BY timestamp DESC LIMIT 20', []),
            oxmysql.query('SELECT * FROM mdt_wanted ORDER BY timestamp DESC LIMIT 20', [])
        ]);

        emitNet('mdt:client:receiveDashboardData', src, {
            officers,
            bolos,
            news,
            wantedList
        });
    } catch (error) {
        console.error('Database error fetching dashboard data:', error);
        emitNet('mdt:client:receiveDashboardData', src, { officers: [], bolos: [], news: [], wantedList: [] });
    }
});

onNet('mdt:server:getRoles', async () => {
    const src = source;
    try {
        const roles = await oxmysql.query('SELECT * FROM mdt_roles', []);
        emitNet('mdt:client:receiveRoles', src, roles);
    } catch (error) {
        console.error('Database error fetching roles:', error);
        emitNet('mdt:client:receiveRoles', src, []);
    }
});

onNet('mdt:server:toggleActive', async (isActive: boolean) => {
    const src = source;
    const ESX = getESX();
    if (!ESX) return;

    const xPlayer = ESX.GetPlayerFromId(src);
    if (!xPlayer) return;

    try {
        await oxmysql.update('UPDATE users SET mdt_active = ? WHERE identifier = ?', [isActive ? 1 : 0, xPlayer.identifier]);
        emitNet('mdt:client:activeStatusToggled', src, isActive);
    } catch (error) {
        console.error('Database error toggling active status:', error);
    }
});

onNet('mdt:server:searchPlayer', async (name: string) => {
    const src = source; 
    const query = 'SELECT firstname, lastname, dateofbirth FROM users WHERE firstname LIKE ? OR lastname LIKE ? LIMIT 10';
    
    try {
        const results = await oxmysql.query(query, [`%${name}%`, `%${name}%`]);
        emitNet('mdt:client:receiveSearchResults', src, results);
    } catch (error) {
        console.error('Database error during MDT search:', error);
        emitNet('mdt:client:receiveSearchResults', src, []);
    }
});