import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as docker from "@pulumi/docker";

// Create an AWS resource (S3 Bucket)
var repository = new awsx.ecr.Repository("otel-collector", {
    forceDelete: true
});

const registryInfo = repository.repository.registryId.apply(async id => {
    const credentials = await aws.ecr.getCredentials({ registryId: id });
    const decodedCredentials = Buffer.from(credentials.authorizationToken, "base64").toString();
    const [username, password] = decodedCredentials.split(":");
    if (!password || !username) {
        throw new Error("Invalid credentials");
    }
    return {
        server: credentials.proxyEndpoint,
        username: username,
        password: password,
    };
});

const image = new docker.Image("my-image", {
    imageName: repository.repository.repositoryUrl,
    build: {
        context: "./docker-collector",
        dockerfile: "./docker-collector/Dockerfile",
        args: {
            "OTEL_VERSION": "0.90.1"
        },
    },
    //registry: registryInfo
});



// Export the name of the bucket
export const imageUri = image.imageName;
