import data from "./ListData.json";

var singleCollectionID;
var collectionData = {}
for (const collection in data) {
    collectionData[data[collection].id] = { "name": data[collection].text };
    if (data[collection].token) {
        collectionData[data[collection].id]["token"] = data[collection].token;
    }
    else {
        collectionData[data[collection].id]["token"] = "none";
    }
}
export class Backend {
    constructor() {

    }
    static async updateFloors() {
        for (const collection in data) {
            var response;
            var url = "https://api.coralcube.io/v1/getItems?offset=0&page_size=5&ranking=price_asc&symbol=" + data[collection].id;
            await fetch(url).then(res => res.json()).then(data => response = data);
            var floor = response.items[0].price / 1000000000;
            collectionData[data[collection].id]["floor"] = floor;
            var bid;
            var ask = Math.round((((response.items[2].price + response.items[3].price) / 2) / 1000000000) * 1000) / 1000;
            var description = response.collection.description;
            collectionData[data[collection].id]["description"] = description;
            var collectionImageURL = response.collection.image;
            collectionData[data[collection].id]["collectionImageURL"] = collectionImageURL;
            var sampleImageURL = response.collection.sample_item_image;
            collectionData[data[collection].id]["sampleImageURL"] = sampleImageURL;
            url = "https://api.coralcube.io/v1/getActivity?offset=0&page_size=1&activity_type=sales&collection_symbol=" + data[collection].id;
            await fetch(url).then(res => res.json()).then(data => response = data);
            var tempBid = response[0].price / 1000000000;
            if (tempBid < floor) {
                bid = Math.round(tempBid*1000)/1000;
            }
            else {
                bid = Math.round(floor * 1000) / 1000;
            }
            collectionData[data[collection].id]["bid"] = bid;
            collectionData[data[collection].id]["ask"] = ask;
        }
    }
    static getFloor(collectionID) {
        singleCollectionID = collectionID;
        return collectionData[collectionID]["floor"];
    }
    static getBid(collectionID) {
        singleCollectionID = collectionID;
        return collectionData[collectionID]["bid"];
    }
    static getAsk(collectionID) {
        singleCollectionID = collectionID;
        return collectionData[collectionID]["ask"];
    }
    
    static getCollectionNames() {
        return data;
    }
    static getDescription(collectionID) {
        singleCollectionID = collectionID;
        return collectionData[collectionID]["description"];
    }
    static getCollectionImageLink(collectionID) {
        singleCollectionID = collectionID;
        return collectionData[collectionID]["collectionImageURL"];
    }
    static getSampleImageLink(collectionID) {
        singleCollectionID = collectionID;
        return collectionData[collectionID]["sampleImageURL"];
    }
    static getCollectionName(collectionID) {
        return collectionData[collectionID]["name"];
    }
    static getCollectionToken(collectionID) {
        return collectionData[collectionID]["token"];
    }

}
Backend.updateFloors()
setInterval(Backend.updateFloors, 10000)