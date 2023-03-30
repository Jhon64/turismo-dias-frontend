export const StorageHelper = {
    createStorage: (name: string, data: any) => {
        let newData = ""
        if (typeof data == 'object')
            newData = JSON.stringify(data);
        if (typeof data == 'string')
            newData = data
        localStorage.setItem(name, newData);
    },
    obtenerStorage: (name: string) => {
        const data = localStorage.getItem(name);
        let setData = null
        if (data !== null && data.length>0)
            setData = JSON.parse(data)
        return setData;
    },
    getTokenAuth: () => {
        const data = StorageHelper.obtenerAuthStorage();
        if (data !== null && data.token !== null)
            return data.token
        return null;
    },
    getUserId: () => {
        const data = StorageHelper.obtenerAuthStorage();
        if (data !== null && data.id !== null)
            return data.id
        return null;
    },

    createAuthStorage: (data: object) => {
        const name = "userData"
        StorageHelper.createStorage(name, data)
    },
    obtenerAuthStorage: () => {
        const name = "userData"
        const data = localStorage.getItem(name);
        let setData = null
        if (data !== null && data.length>0){
            setData = JSON.parse(data)
        }
        return setData;
    },
    limpiarStorage: () => {
        localStorage.clear()
    }
}