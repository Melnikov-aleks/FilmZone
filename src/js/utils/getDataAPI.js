class getDataAPI {
    async getData(url) {
        const response = await fetch(url);
        return await response.json();
    }
}

export default new getDataAPI();
