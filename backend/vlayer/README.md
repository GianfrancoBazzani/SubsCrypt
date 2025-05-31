### Vlayer email prover - verifier service

This is a small service that takes an eml file through http
and processes it to prove and verify it on-chain.


#### How to run it

1. Set the env

```bash
cp env.example .env

vim .env
```


2. Build the image with docker

```bash
docker build -t <name> .
```

3. Run it and expose the 3000 port

```bash
docker run -d -p 3000:3000 <name>
```
