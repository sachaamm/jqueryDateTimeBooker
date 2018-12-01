class TB_Hasher{

    //https://gist.github.com/gordonbrander/2230317

    static hash(d) {

        return Math.random().toString(d).substr(2, 7);

    }

    static basicHash(n){

        let s = '';

        for(let i = 0 ; i < n ; i++){
            let a  = 1 + parseInt(Math.random() * 8);
            s+=a;

        }
        return s;
    }




}