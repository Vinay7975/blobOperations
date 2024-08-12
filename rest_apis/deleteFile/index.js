const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    const accountName = 'devstoreaccount1';
    const accountKey = 'Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==';
    const containerName = req.query.containerName;
    const blobName = req.query.blobName;
    context.log("containerName :", containerName)
    context.log("blobName :", blobName)

    if (!containerName || !blobName) {
        context.res = {
            status: 400,
            body: "Please provide both 'containerName' and 'blobName' in the URL parameters."
        };
        return;
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(`DefaultEndpointsProtocol=http;AccountName=${accountName};AccountKey=${accountKey};BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    try {
        await blobClient.delete();
        context.res = {
            status: 200,
            body: `Blob "${blobName}" in container "${containerName}" deleted successfully.`
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error deleting blob "${blobName}" in container "${containerName}": ${error.message}`
        };
    }
};
