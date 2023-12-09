# Build and push a custom OpenTelemetry Collector

This is an example of building a custom OpenTelemetry collector image with a baked config file.

It uses a [chainguard](https://www.chainguard.dev/chainguard-images) base image for the runtime container, and a devcontainer is available to build it.

It also uses Pulumi to build it and push it to ECR.