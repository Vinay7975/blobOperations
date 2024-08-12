const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Blob storage account credentials
    const accountName = 'upload1234';
    // const accountKey = '';
    
    // Blob container and blob name
    const containerName = 'esignage';
    const blobName = req.query.blobName;
    context.log("Blob Name: " ,blobName);

    // File path to save the downloaded blob
    const filePath = "./downloads/${blobName}";
    
    context.log("Starting download from Azure Storage...");

    try {
        await downloadBlobToFile(accountName, accountKey, containerName, blobName, filePath);
        context.log(`Downloaded ${blobName} to successfully.`);
        context.res = {
            status: 200,
            body: `Downloaded ${blobName} to successfully.`
        };
        context.log("Download completed")
    } catch (error) {
        context.log(`Error downloading ${blobName}: ${error.message}`);
        context.res = {
            status: 500,
            body: `Error: ${error.message}`
        };
    }
};

async function downloadBlobToFile(accountName, accountKey, containerName, blobName, filePath) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(`DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    await blobClient.downloadToFile(filePath);
}
