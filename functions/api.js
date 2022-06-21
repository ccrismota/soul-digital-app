const admin = require("firebase-admin");
const express = require("express");
const api = express();
const cors = require("cors");

//Meddleware
api.use(express.json()); //corpo json é convertida no objeto req.body
//CORS => CROSS ORIGIN RESOURCE SHARING
api.use(cors());

const auth = admin.auth();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true }); // Para que seja ignorad uma propriedade undefine,  caso haja

/**
 *FUNÇÃO MEDDLEWARE
 * FUNÇÃO QUE FAZ MEDIAÇÃO ENTRE AS ENTRE AS REQUISIÇÕES DO FRONT E O BACKEND
 */
const onlySuper = async (req, res, next) => {
  try {
    const userToken = req.headers.authorization.slice(7); //Bearer 'asfghjhgjhgsdggsfhkkjljkj' vai pegar a partir da 7º casa
    const decodedToken = await auth.verifyIdToken(userToken);
    const user = await auth.getUser(decodedToken.uid);
    // {admin: true, super: false}
    if (user.customClaims["super"]) {
      next();
    } else {
      res
        .status(401)
        .json({
          success: false,
          message: "Usuario não é super administrador!",
        });
    }
  } catch (err) {
    // caso o usuario não enviar token
    res.status(400).json({ success: false, message: "Token inválido" });
  }
};

//### ROTAS

// ROTA DE ADIÇÃO
api.post("/admin", onlySuper, async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email && !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email/senha indefinidoa" });
    }

    auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    await auth.setCustomUserClaims(user.uid, { admin: true });
    //espelhamento de informações
    await db
      .collection("adnins")
      .doc(user.uid)
      .set({ uid: user.uid, email: email, displayName: displayName });

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

//ROTA DE LISTAGEM
api.get("/admin", onlySuper, async (req, res) => {
  const snapshots = await db.collection("admins").get();
  const admins = snapshots.docs.map((doc) => doc.data);
  res.json(admins);
});

//ROTADE ATUALIZAÇÃO
api.put("/admins/:uid", onlySuper, async (req, res) => {
  try {
    const { uid } = req.params;
    const { email, password, displayName } = req.body;
    const user = await auth.updateUser(uid, {
      email: email,
      password: password,
      displayName: displayName,
    });

    await db
      .collection("admins")
      .doc(user.uid)
      .update({ email: user.email, displayName: user.displayName });

    res.json({ success: true }); //por padrão o status é 200
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

//ROTA DELETE
api.delete("/admin/:uid", onlySuper, async (req, res) => {
  try {
    const { uid } = req.params;
    await auth.deleteUser(uid);
    await db.collection("admins").doc(uid).delete();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = { api };
