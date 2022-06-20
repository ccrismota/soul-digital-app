const admin = require("firebase-admin")
const express = require("express");
const api = express();
const cors = require("cors");

//Medleware
api.use(express.json()); //corpo json é convertida no objeto req.body
//CORS => CROSS ORIGIN RESOURCE SHARING
api.use(cors());

const auth = admin.auth();
const db = admin.firestore();

db.settings({ignoreUndefinedProperties: true}); // Para que seja ignorad uma propriedade undefine,  caso haja

// ROTA DE ADIÇÃO
api.post("/admin", async(req, res)=>{
  try {
    const {email, password, displayName} = req.body;

    if(!email && !password){
      return res
      .status(400)
      .json({ success: false, message: "Email/senha indefinidoa"})
    }

    auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    await auth.setCustomUserClaims(user.uid, {admin: true});
    //espelhamento de informações
    await db
    .collection("adnins")
    .doc(user.uid)
    .set({uid: user.uid, email: email, displayName: displayName});

    res.status(201).json({success: true});
  }catch (err){
    res.status(500).json({success: false, error: err});
  }
});

//ROTA DE LISTAGEM
api.get("/admin", async (req, res)=>{
  const snapshots = await db.collection("admins").get();
  const admins = snapshots.docs.map((doc)=>doc.data);
  res.json(admins);
});


//ROTADE ATUALIZAÇÃO
api.put("/admins/:uid", async(req, res)=>{
  try {
    const { uid } = req.params;
    const { email, password, displayName} = req.body;
    const user = await auth.updateUser( uid, {
      email: email,
      password: password,
      displayName: displayName,
    });

    await db
    .collection("admins")
    .doc(user.uid)
    .update({email: user.email, displayName: user.displayName});

    res.json({success: true});//por padrão o status é 200
  } catch (err) {
    res.status(500).json({success: false, error: err});
  }
});

api.delete("/admin/:uid", async(req, res)=>{
  try {
    const { uid } = req.params;
    await auth.deleteUser(uid);
    await db.collection("admins").doc(uid).delete();

    res.json({success: true});
  } catch (err) {
    res.status(500).json({success: false, error: err});
  }
})


module.exports = { api };


