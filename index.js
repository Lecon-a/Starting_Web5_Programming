import { Web5 } from "@web5/api";
import { VerifiableCredential } from "@web5/credentials";
import { webcrypto } from "node:crypto";

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;


const { web5, did: aliceDid } = await Web5.connect();

const { did: aliceBearerDid } = await web5.agent.identity.get({ didUri: aliceDid })
// console.log(aliceBearerDid);


// Create a Verifiable Credential (VC)
const vc = await VerifiableCredential.create({
    type: 'Web5QuickstartCompletionCredential',
    issuer: aliceDid,
    subject: aliceDid,
    data: {
        name: "Sunday P. Afolabi",
        completionDate: new Date().toISOString(),
        expertiseLevel: "Beginner"
    }
})

console.log("VC\n\n",vc);

const signedVc = await vc.sign({ did: aliceBearerDid });

console.log("\n\nSigned VC\n\n",signedVc);

const { record } = await web5.dwn.records.create({
    data: signedVc,
    message: {
        schema: "Web5QuickstartCompletionCredential",
        dataFormat: "application/vc+jwt",
        published: true
    }
})

console.log("\n\nStore in DWN\n\n",record);

const readSignedVc = await record.data.text();

console.log("\n\nRead from DWN\n\n", readSignedVc);

const parsedVc = VerifiableCredential.parseJwt({ vcJwt: readSignedVc });

console.log("\n\nParsed VC\n\n", parsedVc);