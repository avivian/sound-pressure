const aws = require("aws-sdk");
const fs = require("fs").promises;

const credentials = new aws.SharedIniFileCredentials({ profile: "personal" });
aws.config.credentials = credentials;

const polly = new aws.Polly({ region: "eu-west-1" });

async function downloadMessage(message) {
  const params = {
    Engine: "neural",
    OutputFormat: "mp3",
    Text: `${message}`,
    LanguageCode: "fr-FR",
    VoiceId: "Lea",
  };

  const res = await polly.synthesizeSpeech(params).promise();

  await fs.writeFile(`public/audio.mp3`, res.AudioStream, {
    encoding: "binary",
  });
}

async function run() {
  await downloadMessage("Bonjour, Je m'appelle Lea. Et toi?");
}

run();
