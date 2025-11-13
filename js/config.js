export const Config = {
  time:{start:{y:1,s:0,d:0,h:6},seasons:['春','夏','秋','冬'],hourName:['清晨','上午','正午','下午','傍晚','夜晚','深夜']},
  expCurve:(lv)=>Math.floor(100*Math.pow(1.55,lv)),
  realm:['凡人','炼气','筑基','金丹','元婴','化神','炼虚','合体','大乘','渡劫','飞升'],
  beastAtk:t=>10*Math.pow(1.5,t),beastDef:t=>5*Math.pow(1.4,t),beastExp:t=>10*t*t,
  eventCD:2,baseChoices:5,
  entropy:{keys:['spirit','morality','order','life'],names:['灵脉','正邪','秩序','生机'],max:100,min:-100,critical:60},
  pillPower:{疗伤:{hp:0.3},突破:{exp:0.2},解毒:{},淬体:{maxHp:0.1},负面:{hp:-0.2,exp:-0.1}}
};
