const admin = require("firebase-admin");
const credencials = require("./credencials.json");

admin.initializeApp({
  credential: admin.credential.cert(credencials),
});

const args = process.argv.slice(2);
const auth = admin.auth();

( async () => {
  try {
    const [email, password, displayName] = args;
    const user = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    await auth.setCustomUserClaims(user.uid, {super: true, admin: true});

    console.log(`super usuario [${user.email}] criado.`);

  } catch (err){

    console.log(err);
  }
})();
