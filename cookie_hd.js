let cookie_handmade = [];

function add_cookie(ck){
    cookie_handmade.push(ck);
}

function get_cookie(ck){
    for(i = 0; i < cookie_handmade.length; i++){
        if (ck == cookie_handmade[i]){
           // console.log(ck);
            return true;
        }
        else return false;
    }
}

function remove_cookie(ck){
    ///console.log(ck);
    for(i = 0; i < cookie_handmade.length; i++){
        if (ck == cookie_handmade[i]){
           // console.log(cookie_handmade[i]);
            cookie_handmade.splice(i, 1);
            ///console.log(cookie_handmade[i]+'deleted');
        }
    }
}

module.exports.add_cookie = add_cookie;
module.exports.get_cookie = get_cookie;
module.exports.remove_cookie = remove_cookie;
