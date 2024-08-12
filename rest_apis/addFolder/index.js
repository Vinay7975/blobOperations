const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const endpoint = 'https://127.0.0.1:8081';
    const key = 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==';
    const client = new CosmosClient({ endpoint, key });

    const databaseId = "sspSignage";
    const containerId = "folder";

    const database = client.database(databaseId);
    const container = database.container(containerId);

    if (req.body) {
        const item = req.body;

        try {
            const { resource: createdItem } = await container.items.create(item);
            context.res = {
                status: 200,
                body: createdItem
            };
        } catch (error) {
            context.res = {
                status: 500,
                body: error.message
            };
        }
    } else {
        context.res = {
            status: 400,
            body: "Please pass a JSON object in the request body"
        };
    }
};