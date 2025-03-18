const PinataSDK = require("@pinata/sdk");  // Correction de l'import
const fs = require("fs");
require("dotenv").config();

const pinata = new PinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

async function upload() {
  try {
    const readableStreamForFile = fs.createReadStream("./hello.txt"); // Correction du fichier en stream
    const options = {
      pinataMetadata: { name: "hello.txt" },
      pinataOptions: { cidVersion: 0 }
    };
    const uploadResponse = await pinata.pinFileToIPFS(readableStreamForFile, options);
    console.log("Réponse d'upload :", uploadResponse);
    return uploadResponse.IpfsHash; // Retourne le CID
  } catch (error) {
    console.error("Erreur lors de l'upload :", error);
  }
}

async function retrieveFile(cid) {
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const content = await response.text();
    console.log("Contenu du fichier:", content);
    console.log("URL publique:", url);
  } catch (error) {
    console.error("Erreur de récupération:", error);
  }
}

upload().then(cid => {
  if (cid) retrieveFile(cid);
});
