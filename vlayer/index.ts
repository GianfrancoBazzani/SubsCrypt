import { serve, env } from "bun";
import { createVlayerClient, preverifyEmail } from "@vlayer/sdk";
import { hashAuthorization, recoverAuthorizationAddress } from 'viem/utils'
import { decodeAbiParameters, parseAbiParameters, concat, recoverAddress, toHex } from 'viem'
import { client, account } from "./client";

// import { createVlayerClient, preverifyEmail } from "@vlayer/sdk/dist";
const constants = require("./constants.json");

if (!env.DNS_SERVICE_URL) {
  throw new Error("No DNS_SERVICE_URL was not set");
}

if (!env.VLAYER_API_TOKEN) {
  throw new Error("No VLAYER_API_TOKEN was not set");
}

const vlayer = createVlayerClient();

function cleanString(input) {
    // Reemplaza todos los ocurrencias de '=\r\n' con una cadena vacía
    return input.replace(/=\r\n/g, '');
}

function parseAuthorizationContent(input: string, delimeter: string): `0x{string}`[] {
    
    const startDelimiter = delimeter;
    const endDelimiter = delimeter;
    
    // const startDelimiter = '__AUTHORIZATION__';
    // const endDelimiter = '__AUTHORIZATION__';

    let startIdx = 0;
    let results = [];

    while (startIdx < input.length) {
        let start = input.indexOf(startDelimiter, startIdx);
        if (start === -1) break; // Si no se encuentra el inicio, terminamos.

        let end = input.indexOf(endDelimiter, start + startDelimiter.length);
        if (end === -1) break; // Si no se encuentra el fin, terminamos.

        let content = input.substring(start + startDelimiter.length, end);
        results.push(cleanString(content));

        startIdx = end + endDelimiter.length;
    }

    if (results.length === 0) {
        throw new Error("No match was found");
    }

    return results; // Devuelve todos los contenidos entre los delimitadores
}



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

        if (fileExtension !== "eml") {} else {
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



          const unverifiedEmail = await preverifyEmail({
            mimeEmail: email,
            dnsResolverUrl: env.DNS_SERVICE_URL,
            token: env.VLAYER_API_TOKEN,
          });


          const string = unverifiedEmail.email.toString();
          const content = parseAuthorizationContent(unverifiedEmail.email.toString(), '__AUTHORIZATION__')[0];
          const salt = parseAuthorizationContent(unverifiedEmail.email.toString(), '__SALT__')[0].replace("__SALT__", '');

          


          // bytes32 hash, bytes32 r, bytes32 s, uint8 yParity, bytes32 salt
          
          // console.log(string);
          // console.log(content);

            // [
            //   { name: "chainId", type: "uint" },
            //   { name: "contract", type: "address" },
            //   { name: "nonce", type: "uint" },
            //   { name: "r", type: "bytes" },
            //   { name: "s", type: "bytes" },
            //   { name: "yParity", type: "uint8" },
            // ],

          const values = decodeAbiParameters(
            parseAbiParameters("uint256 chainId, address contractAddress, uint256 nonce, bytes32 r, bytes32 s, uint8 v, uint8 yParity"),
            content
          )

          const chainId = values.at(0);
          const contractAdress = values.at(1);
          const nonce = values.at(2);
          const r = values.at(3);
          const s = values.at(4);
          const v = values.at(5);
          const yParity = values.at(6);

          const hash = hashAuthorization({
            contractAddress: contractAdress,
            chainId: chainId,
            nonce: nonce,
          });

          console.log("contract: ", contractAdress);
          console.log("chainId: ", chainId);
          console.log("nonce: ", nonce);
          console.log("yParity: ", yParity);
          
          console.log("r: ", r);
          console.log("s: ", s);
          console.log("v: ", v);

          console.log("hash: ", hash);
          console.log("salt: ", salt);
          console.log("\n")


          const signature = concat([r, s, toHex(v)]);
          console.log(signature)

          const address = await recoverAddress({
            hash: hash,
            signature: signature
          })

          // console.log(address)



          // const hashFromProver = await vlayer.prove({
          //   address: constants.prover.address,
          //   proverAbi: constants.prover.abi,
          //   functionName: constants.prover.function,
          //   args: [unverifiedEmail, hash, r, s, v, yParity, salt],
          //   chainId: constants.chainId,
          // });
          
          return new Response("Everything is fine.", { status: 200 });

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

