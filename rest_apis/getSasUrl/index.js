const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require("@azure/storage-blob");


async function generateSASToken(context, blobName) {
    context.log(`generateSASToken called to generate sas token for blobname ::: ${blobName}`);
    
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        new StorageSharedKeyCredential(accountName, accountKey)
    );
    
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    const permissions = BlobSASPermissions.parse("w");
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    
    const sasToken = generateBlobSASQueryParameters(
        {
            containerName: containerClient.containerName,
            blobName: blobName,
            permissions: permissions,
            startsOn: new Date(),
            expiresOn: expiryDate,
        },
        new StorageSharedKeyCredential(accountName, accountKey)
    ).toString();
    
    return sasToken;
}

async function getGenerateSasToken(req, context) {
    context.log(`Http function processed request for url "${req.url}"`);
    
    try {
        const fileName = req.query.fileName;
        context.log(`fileName: ${fileName}`);
        
        const sasToken = await generateSASToken(context, fileName);
        const blobUrlWithSas = `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;
        
        context.log(`Generated SAS Token URL: ${blobUrlWithSas}`);
        
        context.res = {
            status: 200,
            body: {
                blobUrlWithSas,
            },
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: {
                error: error.message,
            },
        };
    }
}

module.exports = async function (context, req) {
    await getGenerateSasToken(req, context);
};