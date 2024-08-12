const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");


module.export = async function (context, req) {
    const accountName = "upload1234";
    const accountKey = "CSiOFOT/iQJpkSBj7AbFRz4E1p4sw/8xX/ozlr29BTxXdV6hT87tSoHy6R72B63Q5FyieZwZqtn5+ASt8XyrFA==";
    const containerName = req.query.containerName;
    context.log('Container name: ', containerName);

    if (!containerName){
        context.res = {
            status: 400,
            body: "Please provide a container name on the query string."
        };
        return;
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(`DefaultEndpointsProtocol=http;AccountName=${accountName};AccountKey=${accountKey};BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
}
// Function to create a BlobServiceClient
function createBlobServiceClient(account, accountKey) {
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
    return new BlobServiceClient(
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential
    );
}

// Function to create a container
async function createContainer() {
    const account = "upload1234";
    const accountKey = "CSiOFOT/iQJpkSBj7AbFRz4E1p4sw/8xX/ozlr29BTxXdV6hT87tSoHy6R72B63Q5FyieZwZqtn5+ASt8XyrFA==";
    const blobServiceClient = createBlobServiceClient(account, accountKey);

    const containerName = `newcontainer${new Date().getTime()}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const createContainerResponse = await containerClient.create();
    console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId);
}

// Export createContainer function directly
module.exports = createContainer;