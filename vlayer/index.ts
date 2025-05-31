import { serve, env } from "bun";
import { createVlayerClient, preverifyEmail } from "@vlayer/sdk";
import { client, account } from "./client";
import { ethers } from "ethers";


const constants = require("./constants.json");

if (!env.DNS_SERVICE_URL) {
  throw new Error("No DNS_SERVICE_URL was not set");
}

if (!env.VLAYER_API_TOKEN) {
  throw new Error("No VLAYER_API_TOKEN was not set");
}

const vlayer = createVlayerClient();

serve({
  async fetch(req: Request): Promise<Response> {
    // Verificar si el método es POST y si tiene content-type multipart/form-data
    if (req.method === "POST" && req.headers.get("content-type")?.includes("multipart/form-data")) {
      // Usamos formData para obtener los datos enviados en la solicitud
      const formData = await req.formData();
      const file = formData.get("file");

      // Verificar si realmente recibimos un archivo
      if (file instanceof File) {
        const fileName = file.name;
        const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

        if (fileExtension !== "eml") {
        

        } else {
          return new Response("File not supported", { status: 400 });
        }

        try {

          // Leer el archivo en un buffer
          const fileStream = file.stream();
          const chunks: Buffer[] = []; // Aquí almacenaremos los fragmentos del archivo

          // Crear un stream que lea los datos del archivo y los almacene en el buffer
          for await (const chunk of fileStream) {
            chunks.push(Buffer.from(chunk)); // Convertimos cada fragmento en un Buffer y lo agregamos al array
          }

          // Unir todos los fragmentos del archivo en un solo buffer
          const fileBuffer = Buffer.concat(chunks);
          const email = fileBuffer.toString('utf-8');

          // const email = fs.readFileSync("nuevo.eml").toString();

          const unverifiedEmail = await preverifyEmail({
            mimeEmail: email,
            dnsResolverUrl: env.DNS_SERVICE_URL,
            token: env.VLAYER_API_TOKEN,
          });

          const string = unverifiedEmail.email.toString();
          console.log(string);


          /*
          const encodedAuthorizationData = ethers.utils.concat([
            '0x05', // MAGIC code for EIP7702
            ethers.utils.RLP.encode([
              authorizationData.chainId,
              authorizationData.address,
              authorizationData.nonce,
            ])
          ]);
          */

          // Generate and sign authorization data hash
          // const authorizationDataHash = ethers.keccak256(encodedAuthorizationData);
          
          // const hash = await vlayer.prove({
          //   address: constants.prover.address,
          //   proverAbi: constants.prover.abi,
          //   functionName: constants.prover.function,
          //   args: [unverifiedEmail],
          //   chainId: constants.chainId,
          // });
          //
          // const provingResult = await vlayer.waitForProvingResult({ hash });

          // On-chain

          // Create client, see docs here: https://viem.sh/docs/clients/wallet
          // const client = createWalletClient({...}); 
          // const account = "";
          
          
          return new Response("Everything is fine.", { status: 200 });
          
          try {
            /*
            const { request } = await client.simulateContract({
              address: constants.verifier.adress,
              abi: constants.verifier.abi,
              functionName: constants.verifier.function,
              args: provingResult,
              chain: constants.chainId,
              account: account,
            });
          
            const txHash = await client.writeContract(request);
          
            return new Response(`Transaction procesed correctly: ${txHash}`, { status: 200 });

              */
          } catch (err) {
            return new Response(`Error procesing the transaction: ${err}`, { status: 500 });
          }
          

        } catch (error) {
          return new Response("Error saving the file", { status: 500 });
        }
      } else {
        return new Response("No file was given", { status: 400 });
      }
    }

    // Si el método no es POST, retornar un error 405
    return new Response("Method not permited.", { status: 405 });
  },
  port: 3000,
});

console.log("Servidor escuchando en http://localhost:3000");

