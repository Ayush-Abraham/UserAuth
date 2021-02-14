const { MongoClient } = require("mongodb");
                                                                                                                                    
const url = "url to your atlas thing";
const client = new MongoClient(url,{useUnifiedTopology:true});
 
 // The database to use
const dbName = "name of your database";

client.connect();
                      
 async function addNewUser(newUsername,newPassword) {
    try {
        console.log('start of addnewuser');
        const db = client.db(dbName);
        
        const col = db.collection("UserCredentials");
                                                                                                                                                                     
        let personDocument = {
            "id": Date.now().toString(),
            "u_name": newUsername,
            "pass_word": newPassword
        }
        
        const p = await col.insertOne(personDocument);
         
        } catch (err) {
            console.log(err.stack);
     } 
     finally {
    }
}

async function getCredentials(checkUsername) {
    try {
        const db = client.db(dbName);
        const col = db.collection("UserCredentials");        
        const myDoc = await col.findOne({"u_name":checkUsername});
        
        return (myDoc)         
        } catch (err) {
            console.log('\nerror\n'+err.stack);
     } 
     finally {
    }
}

async function getCredentialsbyID(checkID) {
    try {

        const db = client.db(dbName);

        const col = db.collection("UserCredentials");
        const myDoc = await col.findOne({"id":checkID});
               
        return (myDoc)         
        } catch (err) {
            console.log(err.stack);
     } 
     finally {
    }
}

module.exports={addNewUser,getCredentials,getCredentialsbyID}