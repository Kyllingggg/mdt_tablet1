/**
 * Simple wrapper around fetch API tailored for FiveM NUI requests.
 * @param eventName The endpoint event name to trigger.
 * @param data Optional data payload.
 * @param mockData Optional mock data for browser testing.
 */
export async function fetchNui<T = any>(eventName: string, data?: any, mockData?: T): Promise<T> {
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data),
    };

    if (typeof (window as any).GetParentResourceName === 'function') {
        const resourceName = (window as any).GetParentResourceName();
        const resp = await fetch(`https://${resourceName}/${eventName}`, options);
        return await resp.json();
    }

    return new Promise(resolve => setTimeout(() => resolve(mockData as T), 100));
}
