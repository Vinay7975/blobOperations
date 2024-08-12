const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {


    const listBlobsInContainer = async () => {
        const blobServiceClient = BlobServiceClient.fromConnectionString(`DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        
        const files = [];
        try {
            for await (const blob of containerClient.listBlobsFlat()) {
                files.push({
                    name: blob.name,
                    properties: blob.properties,
                    metadata: blob.metadata
                });
            }
        } catch (error) {
            context.log.error('Error listing files:', error.message);
            context.res = {
                status: 500,
                body: 'Error listing files',
            };
            return;
        }

        context.res = {
            body: {
                files,
            },
        };
    };

    await listBlobsInContainer();
};
