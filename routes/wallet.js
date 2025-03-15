const express = require('express');
const router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require('fs');

// lightwallet 모듈을 사용하여 랜덤한 니모닉 코드를 얻습니다. 현재 얻은 네모닉코드"domain wife alone discover grunt noise art violin cannon piece hamster panda"

router.post('/newMnemonic', async (req, res) => {
    let mnemonic;
    try {
        mnemonic = lightwallet.keystore.generateRandomSeed();
        res.json({ mnemonic });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Mnemonic 생성 중 오류가 발생했습니다." });
    }
});


// TODO : 니모닉 코드와 패스워드를 이용해 keystore와 address를 생성합니다.
router.post('/newWallet', async(req, res) => {
    let password = req.body.password;
    let mnemonic = req.body.mnemonic;

    try {
        lightwallet.keystore.createVault({
            password: password,
            seedPhrase: mnemonic,
            hdPathString: "m/0'/0'/0'"
        },
        function (err, ks) {
            ks.keyFromPassword(password, function (err, pwDerivedKey) {
                ks.generateNewAddress(pwDerivedKey, 1);

                let address = (ks.getAddresses()).toString();
                let keystore = ks.serialize();

                fs.writeFile('wallet.json', keystore, function(err, data){
                    if(err) {
                        res.json({code: 999, message: "실패"});
                    } else {
                        res.json({code: 1, message: "성공"});
                    }
                });
            });
        });
    } catch (exception) {
        console.log("NewWallet ==>>>> " + exception);
    }
});
/* {
    "keystore": "{\"encSeed\":{\"encStr\":\"O7u5LY9NXqveCiaG6bv7tkeAH7SUvYlMHblvs5QoeAPDEwEy5TPuD4cv0Hz+ZDj3UAMDWESi0EqCZbje3xn6bGlNfJi7fl/LDETqQVM2AFAwue+Hf2vimQ1B+nrNClX3ShkaH246bIfRtlCSBENrScHLZLQQCvhrf++BgO4Kt6pXYkwe9pzIKg==\",\"nonce\":\"Nth54/SNMElmnLmUcDYv9NIepF5b9Ti/\"},\"encHdRootPriv\":{\"encStr\":\"jagHsdAGD0ATWjDhTnsVihuw6dYoTPio8dwY42W2ECzpuMDKVLqChoXlGSgx9yIIxSmc8bq7RyApT9vyBsbwdjAkDVlNsBCBpx9szv2UkKbmFfNAU6zTtGePWyBfK9S8l1lkVCzNgnUG4t//slqsbdJeH8wIGnIXcVqsoh7RmA==\",\"nonce\":\"JALM8ZGEi/G4N4eg7Xuv4M1r/tJMqvMK\"},\"addresses\":[\"e85a4496332a1f32559b6ec8dc8a9c138a388d76\"],\"encPrivKeys\":{\"e85a4496332a1f32559b6ec8dc8a9c138a388d76\":{\"key\":\"ES0XzHeqVVNeewWOb/5x9LTHLxYo7H5xgZIZ30Gh8BkKNlaUy9i1yGK3RwOUjfbH\",\"nonce\":\"wP3vukXQ0qjU+01J3/CUIK+pOZHva8Fc\"}},\"hdPathString\":\"m/0'/0'/0'\",\"salt\":\"jNoMGFu0V1dTDNHJfVKMwBupPIVtnofbzLPZJN0krds=\",\"hdIndex\":1,\"version\":3}",
    "address": "0xe85a4496332a1f32559b6ec8dc8a9c138a388d76"
} */
module.exports = router;