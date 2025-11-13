import { State } from './state.js';
import { Config } from './config.js';
import { Render } from './render.js';

export const Bag = {
    // 应用效果到角色
    applyEff(effects) {
        if (!effects) return;
        
        for (const [key, value] of Object.entries(effects)) {
            // 处理背包物品
            if (key === 'bag') {
                State.bag.push(value);
                Render.log(`获得 ${value}`, 'safe');
            }
            
            // 处理修为
            if (key === 'exp') {
                State.exp += value;
                Render.log(`修为 +${value}`, 'special');
                this.checkLevelUp();
            }
            
            // 处理生命
            if (key === 'hp') {
                State.hp = Math.min(State.maxHp, Math.max(0, State.hp + value));
                Render.log(`${value > 0 ? '生命恢复' : '受到伤害'} ${Math.abs(value)}点`, value > 0 ? 'safe' : 'danger');
            }
            
            // 处理灵力
            if (key === 'mp') {
                State.mp = Math.min(State.maxMp, Math.max(0, State.mp + value));
                Render.log(`${value > 0 ? '灵力恢复' : '消耗灵力'} ${Math.abs(value)}点`);
            }
            
            // 处理气运
            if (key === 'qiy') {
                State.qiy = Math.max(0, Math.min(100, State.qiy + value));
                Render.log(`气运${value > 0 ? '增加' : '减少'} ${Math.abs(value)}点`);
            }
            
            // 处理熵变属性
            if (Config.entropy.keys.includes(key)) {
                State.entropy[key] = Math.max(
                    Config.entropy.min,
                    Math.min(Config.entropy.max, State.entropy[key] + value)
                );
                Render.log(`${Config.entropy.names[Config.entropy.keys.indexOf(key)]}${value > 0 ? '提升' : '降低'} ${Math.abs(value)}点`);
            }
        }
        
        Render.update();
    },
    
    // 使用物品
    useItem(item, index) {
        const power = Config.pillPower[item];
        if (!power) {
            Render.log(`【${item}】无法使用`, 'danger');
            return;
        }
        
        // 处理不同物品效果
        if (item === '疗伤丹') {
            const heal = Math.floor(State.maxHp * power.hp);
            this.applyEff({ hp: heal });
        }
        
        if (item === '突破丹') {
            const expGain = Math.floor(Config.expCurve(State.lv) * power.exp);
            this.applyEff({ exp: expGain });
        }
        
        if (item === '淬体丹') {
            const hpGain = Math.floor(State.maxHp * power.maxHp);
            State.maxHp += hpGain;
            State.hp = State.maxHp;
            Render.log(`体魄增强，生命上限+${hpGain}`, 'safe');
        }
        
        if (item === '毒丹') {
            const dmg = Math.floor(State.maxHp * Math.abs(power.hp));
            const expLoss = Math.floor(State.exp * Math.abs(power.exp));
            this.applyEff({ hp: -dmg, exp: -expLoss });
        }
        
        if (item === '祥瑞灵宠') {
            this.applyEff({ qiy: 20, life: 10 });
        }
        
        // 移除物品
        State.bag.splice(index, 1);
        Render.renderBag();
        Render.update();
    },
    
    // 检查是否升级
    checkLevelUp() {
        const needExp = Config.expCurve(State.lv);
        while (State.exp >= needExp && State.lv < Config.realm.length - 1) {
            State.exp -= needExp;
            State.lv++;
            
            // 升级属性提升
            State.maxHp += 30;
            State.hp = State.maxHp;
            State.maxMp += 20;
            State.mp = State.maxMp;
            State.atk += 5;
            State.def += 3;
            State.wux += 2;
            
            Render.log(`突破至${Config.realm[State.lv]}!`, 'special');
        }
    }
};
