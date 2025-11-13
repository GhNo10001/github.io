import { State } from './state.js';
import { Config } from './config.js';
import { Render } from './render.js';
import { Main } from './main.js';

export const Combat = {
    // 战斗系统
    fight(tier, callback = null) {
        const beastAtk = Config.beastAtk(tier);
        const beastDef = Config.beastDef(tier);
        const beastExp = Config.beastExp(tier);
        
        // 计算伤害
        const playerDmg = Math.max(1, State.atk - beastDef);
        const beastDmg = Math.max(1, beastAtk - State.def);
        
        // 战斗过程
        let playerHp = State.hp;
        let beastHp = beastAtk * 3; // 妖兽生命值为攻击力3倍
        
        Render.log(`遭遇${tier}阶妖兽！`, 'danger');
        
        // 战斗回合
        while (playerHp > 0 && beastHp > 0) {
            beastHp -= playerDmg;
            Render.log(`你对妖兽造成${playerDmg}点伤害`);
            
            if (beastHp <= 0) break;
            
            playerHp -= beastDmg;
            Render.log(`妖兽对你造成${beastDmg}点伤害`, 'danger');
        }
        
        // 战斗结果
        if (playerHp <= 0) {
            State.hp = 0;
            Render.log('你被妖兽击杀...', 'danger');
            Render.update();
            Main.ending('在与妖兽的战斗中陨落...');
            return;
        }
        
        // 胜利处理
        State.hp = playerHp;
        State.exp += beastExp;
        Render.log(`击败${tier}阶妖兽，获得${beastExp}点修为`, 'special');
        
        // 随机掉落物品
        if (Math.random() > 0.7) {
            const items = ['疗伤丹', '突破丹', '淬体丹'];
            const drop = items[Math.floor(Math.random() * items.length)];
            State.bag.push(drop);
            Render.log(`获得战利品：${drop}`, 'safe');
        }
        
        Render.update();
        if (callback) callback();
    }
};
