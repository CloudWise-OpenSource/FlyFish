import { toMobx } from '@chaoswise/cw-mobx';


const model = {
  namespace: "jsonEditor",
  state: {
    errorState: false,
  },
  reducers: {
    setErrorState(flag){
      this.errorState=flag;
    },
    geterrorState(){
        return this.errorState
    }
  },
};

export default toMobx(model);