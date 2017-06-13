# Deploying in Kubernetes

The following guide details how to deploy the Stratos UI Console in Kubernetes.

## Requirements:

### Kubernetes

You will need a suitable Kubernetes environment and a machine from which to run the deployment commands.

You will need to have the `kubectl` CLI installed and available on your path. It should be appropriately configured to be able to communicate with your Kubernetes environment.

### Setup Helm

We use [Helm](https://github.com/kubernetes/helm) for deploying to Kubernetes.

You will need the Helm client installed on the machine from which you are deploying and you will need to install the Helm Server (Tiller) into you Kubernetes environment.

- Download the Helm client for your system from https://github.com/kubernetes/helm/releases.
For convenience the guide assumes that the helm client has been added to your PATH.
- To install the Helm server (Tiller) in your Kubernetes environment by running the following command:
```
helm init
```

## Deploying

To deploy the Stratos UI Console:

Open a terminal and cd to the `deploy/kubernetes` directory:

```
$ cd deploy/kubernetes
```

Create the persistent volumes needed by the Console:

```
kubectl create -f optional/console-pv.yaml
```
Run helm install:

```
$ helm install console --namespace console --name my-console
```

> You can change the namespace and name to values of your choice.

This will create a Console instance named `my-console` in a namespace called `console` in your Kubernetes cluster.

To check the status of the instance use the following command:
```
helm status my-console
```

Once the instance is in `DEPLOYED` state, find the IP address and port that the console is running on:

```
$ helm status my-console | grep ui-ext
console-ui-ext        10.0.0.162  192.168.77.1      80:30933/TCP,443:30941/TCP  1m  
```

In this example, the IP address is `192.168.77.1` and the node-port is `30941`, so the console is accessible on:

`https://192.168.77.1:30941`

The values will be different for your environment.

You can now access the console UI.

> You may see a certificate warning which you can safely ignore.

To login use the following credentials detailed [here](../../docs/access.md).

> Note: For some environments like Minikube, you are not given an IP Address - it may show as `<nodes>`. In this case, run `kubectl cluster-info` and use the IP address of your node shown in the output of this command.
